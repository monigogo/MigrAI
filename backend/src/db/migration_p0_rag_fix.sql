-- ═══════════════════════════════════════════════════════════════════════════
-- Migración P0 — arreglar el anclaje RAG (dimensión de embeddings,
-- fuente_tipo, deduplicación/versionado)
--
-- CÓMO USAR ESTE FICHERO:
-- No lo ejecutes de un tirón. Es en dos partes:
--   PARTE 1 (DIAGNÓSTICO): solo lectura. Ejecútala primero, en el SQL Editor
--   del dashboard de Supabase, y revisa los resultados antes de continuar.
--   PARTE 2 (MIGRACIÓN): modifica la tabla de verdad. Solo ejecútala después
--   de revisar la Parte 1, y solo si entiendes que vacía documentos_normativa
--   (ver nota abajo).
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────
-- PARTE 1 — DIAGNÓSTICO (solo lectura, ejecuta esto primero)
-- ─────────────────────────────────────────────────────────────────────────

-- 1a) Dimensión real declarada en la columna embedding hoy
select format_type(a.atttypid, a.atttypmod) as embedding_type
from pg_attribute a
where a.attrelid = 'public.documentos_normativa'::regclass
  and a.attname = 'embedding';

-- 1b) ¿Hay datos, y con qué dimensión real tienen los vectores guardados?
select count(*) as total_filas from documentos_normativa;
select vector_dims(embedding) as dims from documentos_normativa limit 1;

-- 1c) Valores reales de tramite y tipo hoy en la tabla
select distinct tramite, tipo from documentos_normativa order by 1, 2;

-- 1d) ¿Existe ya la columna fuente_tipo en la BD real? (schema.sql del repo
-- nunca la declaró, pero ingest.py y retriever.py la usaban antes de esta
-- migración — puede que la BD real tenga una columna que el repo no refleja)
select column_name from information_schema.columns
where table_name = 'documentos_normativa'
order by column_name;

-- 1e) Firma real de la función RPC (puede diferir de lo que hay en schema.sql)
select pg_get_functiondef(p.oid)
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where p.proname = 'buscar_documentos' and n.nspname = 'public';


-- ─────────────────────────────────────────────────────────────────────────
-- PARTE 2 — MIGRACIÓN (destructiva: revisa la Parte 1 antes de ejecutar)
--
-- IMPORTANTE: si la Parte 1 (1b) muestra vectores con 1536 dimensiones,
-- son incompatibles con el modelo de embeddings que usa el código hoy
-- (sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2, 384 dim).
-- No hay forma de "convertir" esos vectores — hay que descartarlos y
-- volver a ingerir todo con uv run python -m src.rag.ingest (ver
-- src/rag/ingest.py). Si la tabla ya está vacía o casi vacía, no hay
-- pérdida real.
-- ─────────────────────────────────────────────────────────────────────────

begin;

-- 2a) Vaciar la tabla — los embeddings existentes (si los hay) no son
-- válidos para el nuevo tamaño de columna y no son recuperables.
truncate table documentos_normativa;

-- 2b) Cambiar la dimensión de la columna a 384 (coincide con el modelo real)
alter table documentos_normativa
  alter column embedding type vector(384);

-- 2c) Añadir las columnas nuevas de deduplicación/versionado
alter table documentos_normativa
  add column if not exists contenido_hash text,
  add column if not exists activo boolean not null default true;

-- 2d) Si existiera una columna fuente_tipo real (confirmado en el paso 1d),
-- se elimina — el código ya unificó todo a la columna "tipo" (que ya
-- existía y contenía el mismo valor).
alter table documentos_normativa drop column if exists fuente_tipo;

-- 2e) Recrear el índice de similitud (la dimensión cambió)
drop index if exists idx_docs_embedding;
create index idx_docs_embedding
  on documentos_normativa
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 2f) Índice para el chequeo de deduplicación en cada reingesta
create index if not exists idx_docs_contenido_hash
  on documentos_normativa(contenido_hash);

-- 2g) Recrear el RPC con la firma de 384 dimensiones y el filtro de "activo"
drop function if exists buscar_documentos(vector(1536), text, int);

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

commit;

-- ─────────────────────────────────────────────────────────────────────────
-- DESPUÉS DE ESTA MIGRACIÓN:
-- 1. Sube (si no existen ya) los PDFs de normativa/comunidad/tasa/formularios
--    para arraigo_social, nie_tie, reagrupacion en el bucket "documentos-legales"
--    de Supabase Storage (antes no tenían ninguna carpeta asignada).
-- 2. Ejecuta: cd backend && uv run python -m src.rag.ingest
-- 3. Verifica que cada uno de los 7 trámites devuelve contexto no vacío:
--    uv run python -c "from src.rag.retriever import buscar_contexto; \
--      print(buscar_contexto('¿qué necesito?', tramite='nie_tie'))"
-- ─────────────────────────────────────────────────────────────────────────
