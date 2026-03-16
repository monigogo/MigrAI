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

// Soporte MULTI-ENTORNO:
// Si estás en local (Vite/Docker), usa "/api/v1".
// Si estás en producción (Vercel/Netlify), leerá la variable de entorno que le pongas con tu URL real del backend.
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

// ── Sesión anónima ───────────────────────────────────────────────────────────

export const getSesionId = (): string => {
  let id = localStorage.getItem("migrai_sesion_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("migrai_sesion_id", id);
  }
  return id;
};

export const guardarPerfil = (pais: string, rangoEdad: string): void => {
  localStorage.setItem("migrai_pais",       pais);
  localStorage.setItem("migrai_rango_edad", rangoEdad);
};

export const getPerfil = (): { pais: string; rangoEdad: string } | null => {
  const pais      = localStorage.getItem("migrai_pais");
  const rangoEdad = localStorage.getItem("migrai_rango_edad");
  if (!pais || !rangoEdad) return null;
  return { pais, rangoEdad };
};

export const borrarPerfil = (): void => {
  localStorage.removeItem("migrai_pais");
  localStorage.removeItem("migrai_rango_edad");
};

// ── Endpoints ────────────────────────────────────────────────────────────────

export const obtenerPaises = async (): Promise<PaisesResponse> => {
  const response = await fetch(`${API_BASE_URL}/paises`);
  if (!response.ok) throw new Error("No se pudo obtener la lista de países.");
  return response.json();
};

export const crearSesion = async (perfil: PerfilData): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/sesion`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(perfil),
  });
  if (!response.ok) throw new Error("Error al crear la sesión.");
  return response.json();
};

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

export const enviarPreguntaStream = async (
  datosPregunta: PreguntaData,
  onToken: (token: string) => void,
  onFin: (meta: PreguntaRespuesta) => void,
  onError: (msg: string) => void
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preguntar-stream`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(datosPregunta),
    });

    if (!response.ok || !response.body) {
      onError("No se pudo conectar al asistente.");
      return;
    }

    const reader  = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const texto = decoder.decode(value);
      const lineas = texto.split("\n\n");

      for (const linea of lineas) {
        if (!linea.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(linea.replace("data: ", ""));
          if (data.token)  onToken(data.token);
          if (data.error)  onError(data.error);
          if (data.fin)    onFin({
            respuesta:         "",
            tramite_detectado: data.tramite_detectado,
            conversacion_id:   data.conversacion_id,
            idioma_usado:      data.idioma_usado,
          });
        } catch {
          // chunk incompleto, se ignora
        }
      }
    }
  } catch (error) {
    console.error("Error en enviarPreguntaStream:", error);
    onError("Lo siento, no puedo responder ahora. Inténtalo de nuevo.");
  }
};

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

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
