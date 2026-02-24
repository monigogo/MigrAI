import type { Resource, Course } from '@/types'

// ─── Países disponibles en el onboarding ─────────────────────────
export const COUNTRIES = [
  'Argentina',
  'Brasil',
  'Bolivia',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Chile',
  'Ecuador',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'República Dominicana',
  'Uruguay',
  'Venezuela',
  'Otro',
] as const

// ─── Rangos de edad ───────────────────────────────────────────────
export const AGE_RANGES = [
  '18–25 años',
  '26–35 años',
  '36–45 años',
  '46–55 años',
  '56+ años',
] as const

// ─── Opciones de sexo ─────────────────────────────────────────────
export const SEX_OPTIONS = [
  { value: 'masculino' as const, label: 'Masculino',       emoji: '👨' },
  { value: 'femenino'  as const, label: 'Femenina',        emoji: '👩' },
  { value: 'otro'      as const, label: 'Prefiero no decir', emoji: '🤝' },
]

// ─── Recursos estáticos (Fase 4 → vendrán del backend por país) ──
export const STATIC_RESOURCES: Resource[] = [
  { id: '1', emoji: '📄', title: 'Documentos necesarios',  desc: 'Lista completa según tu situación',    tag: 'Esencial'  },
  { id: '2', emoji: '⚖️', title: 'Tus derechos',           desc: 'Lo que puedes exigir como migrante',   tag: 'Legal'     },
  { id: '3', emoji: '🏥', title: 'Acceso a salud',         desc: 'Cómo acceder al sistema sanitario',    tag: 'Salud'     },
  { id: '4', emoji: '🏠', title: 'Buscar vivienda',        desc: 'Opciones y ayudas para alojamiento',   tag: 'Vivienda'  },
]

// ─── Cursos estáticos (Fase 4 → vendrán del backend) ─────────────
export const STATIC_COURSES: Course[] = [
  { id: '1', emoji: '🗣️', title: 'Idioma y comunicación',  desc: 'Estudia idiomas' ,                   duration: 'Flexible'},
  { id: '2', emoji: '🏛️', title: 'Ruta del Empleo',        desc: 'Organiza tu vida laboral',            duration:  'Flexible'},
  { id: '3', emoji: '💻', title: 'Habilidades digitales',  desc: 'Formaciones en Tecnología digital',       duration: 'Flexible'},
  { id: '4', emoji: '📋', title: 'Derechos legales',       desc: 'Entiende el sistema jurídico',            duration: 'Flexible'},
]

// ─── Preguntas rápidas del chat ───────────────────────────────────
export const QUICK_QUESTIONS = [
  { emoji: '📄', text: '¿Qué documentos necesito?' },
  { emoji: '⚖️', text: '¿Cuáles son mis derechos?' },
  { emoji: '📋', text: '¿Cuál es el siguiente paso?' },
] as const

// ─── Aviso legal ──────────────────────────────────────────────────
export const LEGAL_NOTICE =
  'migrAI proporciona orientación general e informativa. ' +
  'No reemplaza el asesoramiento legal o profesional oficial.'