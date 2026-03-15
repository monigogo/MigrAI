/**
 * Todas las funciones para interactuar con la API del backend de migrAI.
 */

// ── Tipos de Datos ──────────────────────────────────────────────────────────

export interface PerfilData {
  sesion_id:  string;
  pais:       string;
  rango_edad: string;
}

export interface PreguntaData {
  pregunta:   string;
  sesion_id:  string;
  pais:       string;
  rango_edad: string;
}

export interface PreguntaRespuesta {
  respuesta:         string;
  tramite_detectado: string;
  conversacion_id:   string;
  idioma_usado:      string;
}

export interface PaisesResponse {
  paises:      string[];
  rangos_edad: string[];
}

export interface FeedbackData {
  conversacion_id: string;
  dudas_resueltas: boolean;
}

export interface MensajeHistorial {
  id:               string;
  tramite:          string;
  pregunta:         string;
  respuesta:        string;
  agente_usado:     string;
  dudas_resueltas:  boolean | null;
  idioma_respuesta: string;
  creado_en:        string;
}

// ── Constantes ──────────────────────────────────────────────────────────────

// Con el proxy de Vite corregido (sin rewrite), /api/v1 llega completo al backend
const API_BASE_URL = "/api/v1";

// ── Sesión anónima ───────────────────────────────────────────────────────────

/**
 * Genera o recupera el ID anónimo del usuario.
 * Se guarda en localStorage — persiste aunque cierre el navegador.
 */
export const getSesionId = (): string => {
  let id = localStorage.getItem("migrai_sesion_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("migrai_sesion_id", id);
  }
  return id;
};

/**
 * Guarda el perfil del usuario en localStorage.
 */
export const guardarPerfil = (pais: string, rangoEdad: string): void => {
  localStorage.setItem("migrai_pais",       pais);
  localStorage.setItem("migrai_rango_edad", rangoEdad);
};

/**
 * Recupera el perfil guardado.
 * Devuelve null si el usuario no ha completado la bienvenida.
 */
export const getPerfil = (): { pais: string; rangoEdad: string } | null => {
  const pais      = localStorage.getItem("migrai_pais");
  const rangoEdad = localStorage.getItem("migrai_rango_edad");
  if (!pais || !rangoEdad) return null;
  return { pais, rangoEdad };
};

/**
 * Borra el perfil guardado.
 * Útil para que el usuario pueda cambiar su país.
 */
export const borrarPerfil = (): void => {
  localStorage.removeItem("migrai_pais");
  localStorage.removeItem("migrai_rango_edad");
};

// ── Endpoints ────────────────────────────────────────────────────────────────

/**
 * Obtiene la lista de países y rangos de edad disponibles.
 */
export const obtenerPaises = async (): Promise<PaisesResponse> => {
  const response = await fetch(`${API_BASE_URL}/paises`);
  if (!response.ok) throw new Error("No se pudo obtener la lista de países.");
  return response.json();
};

/**
 * Crea o actualiza la sesión anónima del usuario en Supabase.
 * Se llama al terminar la pantalla de bienvenida.
 */
export const crearSesion = async (perfil: PerfilData): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/sesion`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(perfil),
  });
  if (!response.ok) throw new Error("Error al crear la sesión.");
  return response.json();
};

/**
 * Envía una pregunta al chatbot.
 * El backend decide qué agente responde y guarda todo en Supabase.
 */
export const enviarPregunta = async (
  datosPregunta: PreguntaData
): Promise<PreguntaRespuesta> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preguntar`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(datosPregunta),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Error: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Error en enviarPregunta:", error);
    return {
      respuesta:         "Lo siento, no puedo responder ahora. Inténtalo de nuevo.",
      tramite_detectado: "error",
      conversacion_id:   "",
      idioma_usado:      "",
    };
  }
};

/**
 * Guarda si el usuario resolvió sus dudas.
 * Si dice NO → se marca para análisis y mejora.
 */
export const enviarFeedback = async (
  conversacionId: string,
  dudasResueltas: boolean
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        conversacion_id: conversacionId,
        dudas_resueltas: dudasResueltas,
      }),
    });
    if (!response.ok) throw new Error("Error al enviar feedback.");
    return response.json();
  } catch (error) {
    console.error("Error en enviarFeedback:", error);
  }
};

/**
 * Obtiene el historial de conversaciones de la sesión actual.
 */
export const obtenerHistorial = async (): Promise<MensajeHistorial[]> => {
  try {
    const sesionId = getSesionId();
    const response = await fetch(`${API_BASE_URL}/historial/${sesionId}`);
    if (!response.ok) throw new Error("Error al obtener historial.");
    const data = await response.json();
    return data.historial || [];
  } catch (error) {
    console.error("Error en obtenerHistorial:", error);
    return [];
  }
};

/**
 * Verifica que el backend está vivo.
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};