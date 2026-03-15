# 📋 Requisitos del Sistema — migrAI

> Documento de especificación funcional, técnica y de diseño de la aplicación **migrAI**, plataforma de orientación migratoria impulsada por inteligencia artificial.

---

## 1. Visión General

**migrAI** es una aplicación web progresiva (PWA-ready) diseñada para orientar a personas migrantes durante su proceso de integración en un nuevo país. La interfaz está optimizada para usuarios **sin conocimientos tecnológicos avanzados**, priorizando la claridad visual, el lenguaje simple y la accesibilidad en cualquier dispositivo.

> ✅ **Sin registro. Sin login. Sin contraseñas.** El usuario entra directamente y completa un breve onboarding para personalizar su experiencia.

---

## 2. Objetivos del Sistema

| # | Objetivo |
|---|----------|
| 1 | Guiar al usuario migrante paso a paso en su proceso de integración |
| 2 | Ofrecer respuestas rápidas sobre documentos, derechos y trámites |
| 3 | Ser accesible para personas con poca experiencia tecnológica |
| 4 | Funcionar correctamente en móvil, tablet y escritorio |
| 5 | No requerir ningún tipo de cuenta, registro ni contraseña |
| 6 | Preparar la arquitectura frontend para conectarse a un backend externo |

---

## 3. Usuarios Objetivo

- **Perfil principal:** Personas migrantes recién llegadas, con o sin estudios formales
- **Rango de edad:** 18 a 56+ años
- **Idioma:** Español (primera versión)
- **Dispositivo más usado:** Smartphone (Android o iOS)
- **Nivel tecnológico:** Básico — pueden enviar mensajes de WhatsApp pero no manejan apps complejas

---

## 4. Stack Tecnológico

### 4.1 Frontend (implementado)

| Tecnología | Versión | Rol |
|------------|---------|-----|
| **React** | 18.3.x | Librería de interfaz de usuario |
| **Vite** | Latest | Bundler y servidor de desarrollo |
| **TypeScript** | Latest | Tipado estático |
| **Tailwind CSS** | 3.x | Sistema de estilos utilitarios |
| **shadcn/ui** | Latest | Componentes accesibles base |
| **React Router DOM** | 6.x | Enrutamiento SPA |
| **Lucide React** | 0.462.x | Iconografía |
| **TanStack Query** | 5.x | Gestión de estado asíncrono (listo para backend) |

### 4.2 Backend (por conectar)

La aplicación está preparada para integrarse con:

- **API REST** o **GraphQL** para enviar los datos del onboarding y personalizar respuestas
- **Servicio de IA** (OpenAI, Gemini, etc.) para el chat inteligente
- **Sin base de datos de usuarios** — no se almacenan cuentas ni credenciales

---

## 5. Arquitectura de la Aplicación

```
src/
├── pages/
│   ├── Index.tsx          # Pantalla de inicio + tabs de navegación
│   └── NotFound.tsx       # Página 404
├── components/
│   ├── OnboardingForm.tsx # Formulario de perfil inicial (2 pasos)
│   ├── Dashboard.tsx      # Panel principal + vista de chat
│   ├── PathCard.tsx       # Tarjeta de selección de ruta
│   └── ui/                # Componentes shadcn/ui reutilizables
├── hooks/                 # Custom hooks (mobile, toast)
├── lib/
│   └── utils.ts           # Utilidades (cn, etc.)
└── index.css              # Design tokens globales (HSL)
```

---

## 6. Módulos Funcionales

### 6.1 🏠 Pantalla de Inicio (`Index.tsx`)

**Descripción:** Primera pantalla que ve el usuario al entrar a la app. No requiere ningún tipo de autenticación.

**Funcionalidades:**
- Header fijo con logo y nombre de la app
- Navegación por tabs: **Inicio** y **Aprender**
- Sección hero de bienvenida con mensaje amigable
- Dos tarjetas de selección de ruta:
  - *No sé por dónde empezar* → inicia onboarding desde cero
  - *Ya inicié mi proceso* → onboarding para usuarios con proceso activo
- Sección de **Recursos útiles** con tarjetas de contenido informativo
- Tab **Aprender**: lista de cursos con temáticas de idioma, cívica, digital y legal
- Footer con aviso legal

**Estados de la pantalla:**
```
"home" → "onboarding" → "dashboard"
```

---

### 6.2 📝 Formulario de Onboarding (`OnboardingForm.tsx`)

**Descripción:** Recoge datos básicos del usuario para personalizar la experiencia. **No crea ninguna cuenta ni almacena datos de forma permanente.**

**Estructura (2 pasos):**

| Paso | Campo | Tipo | Valores |
|------|-------|------|---------|
| 1 | País de origen | Selección única | Venezuela, Colombia, Ecuador, Perú, Honduras, Guatemala, El Salvador, Cuba, Haití, México, Nicaragua, Brasil, Argentina, República Dominicana, Otro |
| 2 | Rango de edad | Selección única | 18–25, 26–35, 36–45, 46–55, 56+ años |
| 2 | Sexo | Selección única | Masculino, Femenino, Prefiero no decir |

> ⚠️ **Nota:** Edad y sexo se muestran en la **misma pantalla** (paso 2) para reducir fricción.

**Comportamiento:**
- Barra de progreso visual (2 segmentos)
- Botón "Continuar" solo activo si el campo del paso actual está seleccionado
- Botón "Atrás" regresa al paso anterior o a la pantalla de inicio
- Al completar, devuelve `{ country, age, sex }` al componente padre (estado en memoria, sin persistencia)

**Datos disponibles para la sesión:**
```typescript
{
  country: string,   // País de origen
  age: string,       // Rango de edad
  sex: string        // "masculino" | "femenino" | "otro"
}
```

> 🔒 Estos datos **no se envían a ninguna base de datos de usuarios**. Se usan únicamente para personalizar la experiencia durante la sesión.

---

### 6.3 📊 Panel Principal (`Dashboard.tsx`)

**Descripción:** Vista personalizada según el perfil del usuario y la ruta elegida.

**Vistas:**
1. **Dashboard principal** — tarjetas de acción y CTA al chat
2. **Chat con migrAI** — interfaz de mensajería integrada

#### Dashboard principal

- Badge de perfil con país, edad y sexo del usuario
- Saludo personalizado según ruta (`new` o `continue`)
- Tarjetas de acción contextual (3 opciones según ruta):
  - **Ruta nueva:** Guía paso a paso, Documentos, Preguntas frecuentes
  - **Ruta activa:** Siguiente paso, Chat con migrAI, Mis documentos
- Botón prominente "Hablar con migrAI" en la parte inferior

#### Chat con migrAI

- Header sticky con avatar y estado de disponibilidad
- Banner de ayuda contextual ("Consejo: puedes tocar una pregunta...")
- Burbujas de chat diferenciadas (usuario / asistente)
- Estado de escritura animado ("migrAI está escribiendo…")
- **Preguntas rápidas** predefinidas:
  - 📄 ¿Qué documentos necesito?
  - ⚖️ ¿Cuáles son mis derechos?
  - 📋 ¿Cuál es el siguiente paso?
- Campo de texto libre con botón de envío
- Scroll automático al último mensaje
- Aviso legal en el pie del chat

**Respuestas del chat (actualmente simuladas, listas para API):**

| Intención detectada | Palabras clave | Respuesta |
|---------------------|---------------|-----------|
| Documentos | "documento", "papel" | Lista de documentos requeridos |
| Pasos del proceso | "paso", "siguiente", "proceso" | Lista numerada de pasos |
| Derechos | "derecho" | Lista de derechos del migrante |
| General | cualquier otra | Mensaje de bienvenida y orientación |

> 🔌 **Punto de integración:** Reemplazar `getAIResponse()` por llamada a API de IA real, enviando el perfil del usuario como contexto.

---

## 7. Diseño y Experiencia de Usuario

### 7.1 Sistema de Diseño

| Token | Valor (HSL) | Uso |
|-------|------------|-----|
| `--primary` | `200 98% 39%` | Botones, iconos, selecciones activas |
| `--background` | `209 40% 96%` | Fondo general de la app |
| `--card` | `210 40% 98%` | Superficies elevadas (tarjetas) |
| `--foreground` | `222 47% 11%` | Texto principal |
| `--muted-foreground` | `215 20% 65%` | Texto secundario / subtítulos |
| `--border` | `212 26% 83%` | Bordes de componentes |
| `--warm` | `30 80% 55%` | Variante de tarjeta alternativa |
| `--success` | `152 60% 42%` | Confirmaciones y selecciones |

**Tipografía:**
- **Headings:** `Outfit` (Google Fonts) — fuerte, legible, moderno
- **Body:** `DM Sans` (Google Fonts) — amigable, de alta legibilidad
- **Mono:** `Space Mono` — código y datos técnicos

**Radio de bordes:** `0.5rem` base, escalable (`md`, `lg`, `xl`, `2xl`, `3xl`)

---

### 7.2 Diseño Responsivo

| Breakpoint | Dispositivo | Comportamiento |
|-----------|-------------|----------------|
| `< 768px` | 📱 Móvil | Layout de columna única. Botones de ancho completo. Tap targets ≥ 48px |
| `768px – 1024px` | 📟 Tablet | Contenedor centrado `max-w-md` con márgenes laterales |
| `> 1024px` | 🖥️ Escritorio | Shell de app móvil centrada (`max-w-md`) sobre fondo `bg-muted` |

**Principios de diseño responsivo aplicados:**
- Layout siempre en columna única (mobile-first)
- `max-w-md` como ancho máximo del contenedor principal
- Headers sticky (`position: sticky; top: 0`) para navegación siempre accesible
- Inputs y botones con altura mínima de `44px` para uso táctil
- Scroll vertical nativo, sin scrollbars horizontales
- `backdrop-blur` en overlays para profundidad visual

---

### 7.3 Accesibilidad

- Textos con tamaño mínimo `text-sm` (14px), preferentemente `text-base` (16px)
- Contraste WCAG AA garantizado mediante tokens HSL definidos
- Atributos `aria-label` en botones sin texto visible
- Estados `disabled` visualmente diferenciados (`opacity-40`)
- Emojis como apoyo visual, nunca como único indicador de acción
- Animaciones reducidas a transiciones suaves (no vestibulares)
- Lenguaje simple: frases cortas, verbos en imperativo, sin tecnicismos

---

## 8. Flujo de Usuario (User Flow)

```
┌──────────────────────────┐
│   Pantalla de Inicio      │
│   (Sin login requerido)   │
│   tabs: Inicio / Aprender │
└────────────┬─────────────┘
             │ El usuario elige ruta
             ▼
┌──────────────────────────┐
│  Onboarding (2 pasos)     │
│  Paso 1: País             │
│  Paso 2: Edad + Sexo      │
│  (Sin crear cuenta)       │
└────────────┬─────────────┘
             │ Completa los datos
             ▼
┌──────────────────────────┐
│  Dashboard                │
│  - Perfil de sesión       │
│  - Tarjetas de acción     │
│  - CTA: Chat IA           │
└────────────┬─────────────┘
             │ Toca "Hablar con migrAI"
             ▼
┌──────────────────────────┐
│  Chat con migrAI          │
│  - Preguntas rápidas      │
│  - Texto libre            │
│  - Respuestas IA          │
└──────────────────────────┘
```

---

## 9. Integraciones Pendientes (Backend)

### 9.1 API de Chat IA

```typescript
// POST /api/chat
// Body:
{
  message: string,
  context: {
    country: string,
    age: string,
    sex: string,
    path: "new" | "continue"
  },
  history: Array<{ role: "user" | "assistant", content: string }>
}

// Response:
{
  reply: string
}
```

> ⚠️ **No se requiere autenticación ni token de usuario** para llamar a la API. El contexto del usuario se envía directamente en el cuerpo de cada petición.

### 9.2 API de Recursos y Guías (opcional)

```typescript
// GET /api/resources?country=Venezuela
// Response:
{
  resources: Array<{
    title: string,
    tag: string,
    emoji: string,
    desc: string,
    url: string
  }>
}
```

---

## 10. Requisitos No Funcionales

| Requisito | Descripción |
|-----------|-------------|
| **Rendimiento** | First Contentful Paint < 2s en redes 4G |
| **Compatibilidad** | Chrome 90+, Safari 14+, Firefox 90+, Edge 90+ |
| **Escalabilidad** | Componentes desacoplados listos para lazy loading |
| **Mantenibilidad** | TypeScript estricto + componentes con responsabilidad única |
| **Seguridad** | Sin claves privadas en frontend. HTTPS obligatorio |
| **Privacidad** | Sin cuentas de usuario. Sin almacenamiento de datos personales. Sin tracking |
| **Idioma** | Español (preparado para internacionalización futura con i18n) |
| **Sin barreras** | La app es 100% funcional sin ningún tipo de registro o login |

---

## 11. Pendientes y Mejoras Futuras

- [ ] Integración con API de IA real (OpenAI / Gemini) para el chat
- [ ] Recursos y guías cargados dinámicamente desde backend según país
- [ ] Notificaciones push de recordatorio de trámites
- [ ] Modo de texto grande (accesibilidad visual)
- [ ] Soporte para más idiomas (Portugués, Inglés, Creole)
- [ ] PWA con instalación en pantalla de inicio
- [ ] Panel de administración para gestionar recursos y guías

---

## 12. Convenciones de Código

- **Componentes:** PascalCase (`OnboardingForm.tsx`)
- **Hooks:** camelCase con prefijo `use` (`use-mobile.tsx`)
- **Tokens CSS:** kebab-case con prefijo `--` (`--primary-foreground`)
- **Clases Tailwind:** tokens semánticos del sistema de diseño, sin colores hardcodeados
- **Tipado:** interfaces TypeScript para todas las props de componentes

---

*Documento actualizado: Febrero 2026 — Versión 1.1*
*Proyecto: migrAI — Plataforma de orientación para migrantes*
*⚠️ Política: Sin login. Sin registro. Sin contraseñas.*
