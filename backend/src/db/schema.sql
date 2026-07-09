-- Activa la extensión de vectores (una sola vez por proyecto)
create extension if not exists vector;

-- ── Tabla principal: fragmentos de PDFs con vectores ──────────────────────
-- NOTA: embedding es vector(384) porque el modelo usado en
-- src/rag/embeddings.py es sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
-- (384 dimensiones). Si el modelo de embeddings cambia alguna vez, este valor
-- y el de la función buscar_documentos() deben cambiar juntos, y hay que
-- re-ingerir todo (los vectores no son portables entre modelos distintos).
create table if not exists documentos_normativa (
  id             uuid      primary key default gen_random_uuid(),
  contenido      text      not null,
  embedding      vector(384),
  tramite        text      not null,
  fuente         text,
  pagina         int,
  tipo           text      default 'normativa',  -- 'normativa' | 'comunidad' | 'tasa' | 'formulario'
  contenido_hash text,                            -- sha256(fuente|pagina|indice|contenido), para deduplicar reingestas
  activo         boolean   not null default true,  -- false = superado por una reingesta más reciente del mismo fichero
  fecha_carga    timestamp default now()
);

-- Índice para búsqueda rápida por similitud de vectores
create index if not exists idx_docs_embedding
  on documentos_normativa
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Índice para filtrar por trámite
create index if not exists idx_docs_tramite
  on documentos_normativa(tramite);

-- Índice para el chequeo de deduplicación en cada reingesta
create index if not exists idx_docs_contenido_hash
  on documentos_normativa(contenido_hash);

-- ── Sesiones anónimas ─────────────────────────────────────────────────────
create table if not exists sesiones (
  id            uuid      primary key,
  pais          text,
  rango_edad    text,
  idioma        text,
  creado_en     timestamp default now(),
  ultimo_acceso timestamp default now()
);

-- ── Historial de conversaciones ───────────────────────────────────────────
create table if not exists conversaciones (
  id                uuid    primary key default gen_random_uuid(),
  sesion_id         uuid    references sesiones(id),
  tramite           text,
  pregunta          text    not null,
  respuesta         text,
  agente_usado      text,
  idioma_respuesta  text,
  pais_usuario      text,
  dudas_resueltas   boolean,               -- true=sí, false=no, null=no respondió
  necesita_revision boolean default false, -- true = va a la cola de análisis
  creado_en         timestamp default now()
);

-- Índices para consultas rápidas
create index if not exists idx_conv_sesion
  on conversaciones(sesion_id);

create index if not exists idx_conv_revision
  on conversaciones(necesita_revision)
  where necesita_revision = true;

create index if not exists idx_conv_tramite
  on conversaciones(tramite);

-- ── Función de búsqueda por similitud (la usa el RAG) ─────────────────────
create or replace function buscar_documentos(
  query_embedding vector(384),
  tramite_filtro  text,
  top_k           int default 5
)
returns table (
  id        uuid,
  contenido text,
  fuente    text,
  pagina    int,
  tipo      text,
  similitud float
)
language sql stable
as $$
  select
    id,
    contenido,
    fuente,
    pagina,
    tipo,
    1 - (embedding <=> query_embedding) as similitud
  from documentos_normativa
  where tramite = tramite_filtro
    and activo = true
  order by embedding <=> query_embedding
  limit top_k;
$$;

-- ── Vista para análisis de consultas sin resolver ─────────────────────────
create or replace view consultas_sin_resolver as
  select
    c.id,
    c.sesion_id,
    c.tramite,
    c.pregunta,
    c.respuesta,
    c.agente_usado,
    c.pais_usuario,
    c.creado_en
  from conversaciones c
  where c.necesita_revision = true
  order by c.creado_en desc;

-- ── Vista de análisis por país ────────────────────────────────────────────
create or replace view analisis_por_pais as
  select
    s.pais,
    s.rango_edad,
    count(c.id)                                                as total_consultas,
    sum(case when c.dudas_resueltas = true  then 1 else 0 end) as resueltas,
    sum(case when c.dudas_resueltas = false then 1 else 0 end) as sin_resolver,
    count(distinct c.tramite)                                  as tramites_distintos
  from sesiones s
  left join conversaciones c on c.sesion_id = s.id
  where s.pais is not null
  group by s.pais, s.rango_edad
  order by total_consultas desc;