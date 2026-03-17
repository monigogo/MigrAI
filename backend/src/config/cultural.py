
PAISES_IDIOMAS = {
    "Argentina":             {"idioma": "es", "nombre": "español rioplatense"},
    "Bolivia":               {"idioma": "es", "nombre": "español boliviano"},
    "Brasil":                {"idioma": "pt", "nombre": "portugués brasileño"},
    "Chile":                 {"idioma": "es", "nombre": "español chileno"},
    "Colombia":              {"idioma": "es", "nombre": "español colombiano"},
    "Costa Rica":            {"idioma": "es", "nombre": "español costarricense"},
    "Cuba":                  {"idioma": "es", "nombre": "español cubano"},
    "Ecuador":               {"idioma": "es", "nombre": "español ecuatoriano"},
    "El Salvador":           {"idioma": "es", "nombre": "español salvadoreño"},
    "Guatemala":             {"idioma": "es", "nombre": "español guatemalteco"},
    "Guinea Ecuatorial":     {"idioma": "es", "nombre": "español ecuatoguineano"},
    "Honduras":              {"idioma": "es", "nombre": "español hondureño"},
    "México":                {"idioma": "es", "nombre": "español mexicano"},
    "Nicaragua":             {"idioma": "es", "nombre": "español nicaragüense"},
    "Panamá":                {"idioma": "es", "nombre": "español panameño"},
    "Paraguay":              {"idioma": "es", "nombre": "español paraguayo"},
    "Perú":                  {"idioma": "es", "nombre": "español peruano"},
    "Puerto Rico":           {"idioma": "es", "nombre": "español puertorriqueño"},
    "República Dominicana":  {"idioma": "es", "nombre": "español dominicano"},
    "Uruguay":               {"idioma": "es", "nombre": "español uruguayo"},
    "Venezuela":             {"idioma": "es", "nombre": "español venezolano"},
}

CONTEXTO_CULTURAL = {
    "Argentina": """
- Usa SIEMPRE el voseo: 'vos tenés', 'vos podés', 'vos necesitás'
- Los argentinos son directos, no les gustan los rodeos
- Tono cercano pero profesional
- Si mencionan documentación argentina (DNI, CUIL), explica el equivalente español
- Pueden tener situaciones migratorias complejas por crisis económicas anteriores
""",
    "Uruguay": """
- Usa SIEMPRE el voseo igual que Argentina: 'vos tenés', 'vos podés'
- Tono muy tranquilo y pausado
- Formales pero cercanos a la vez
- Muchos tienen vínculos con España o Italia, pueden tener doble nacionalidad
""",
    "Colombia": """
- Usa SIEMPRE 'usted', nunca tutees salvo que el usuario lo haga primero
- Empieza con una frase amable antes de ir al tema: '¿Cómo le puedo ayudar?'
- Muy diverso por regiones (costeño, paisa, bogotano) pero todos usan usted
- Pueden llamar 'cédula' al documento de identidad — explica que en España es el NIE/TIE
- Alta desconfianza hacia trámites burocráticos, tranquiliza y explica cada paso
""",
    "Venezuela": """
- Sigue el tono del usuario: si tutea, tutea; si usa usted, usa usted
- Muchos llevan años en España y conocen bien los trámites
- El proceso migratorio venezolano fue muy abrupto — sé empático
- Pueden tener pasaportes vencidos o documentación difícil de renovar
- La comunidad venezolana en España es grande y muy activa
""",
    "México": """
- Usa 'usted' en temas legales, tuteo si el usuario lo propone
- Tono amable y formal, los mexicanos valoran el trato educado
- La CURP y el RFC no tienen equivalente directo en España — explícalo si aparecen
- Gran diversidad de situaciones: estudiantes, trabajadores, familias establecidas
""",
    "Ecuador": """
- Usa 'usted' en contextos formales
- Tono cercano y paciente
- Muchos llevan muchos años en España — pregunta cuánto tiempo llevan
- Pueden tener documentación antigua o trámites a medias de años atrás
- Valoran la explicación paso a paso sin saltarse detalles
""",
    "Perú": """
- Usa 'usted', tono formal y respetuoso
- Los peruanos son muy educados y pacientes — responde igual
- Gran comunidad en España, muchos con situación regularizada buscando mejorar estatus
- Pueden preguntar por trámites para familiares además de para ellos
- Valoran que cites la ley o artículo concreto
""",
    "Bolivia": """
- Usa 'usted', tono muy formal y respetuoso
- Bolivia tiene gran diversidad cultural — no asumas nada
- Muchos llevan años con situaciones complejas o irregulares de larga duración
- Paciencia y claridad ante todo
""",
    "Chile": """
- Tono formal pero directo, los chilenos valoran la eficiencia
- 'Usted' en temas legales, tuteo en contextos cercanos
- Aprecian la precisión y los plazos concretos
- Muchos jóvenes por trabajo cualificado y estudiantes
""",
    "Cuba": """
- Tono cálido y cercano, tuteo natural
- Muchos llevan años fuera con documentación compleja
- Pueden tener pasaportes cubanos vencidos o dificultades para renovarlos desde España
- Empatía ante todo — la situación política de Cuba impacta en sus trámites
""",
    "República Dominicana": """
- Tono cálido y cercano, tuteo natural
- Gran comunidad en España con muchos años de presencia
- Muchos ya tienen o están cerca de la nacionalidad española
- Reagrupación familiar es muy habitual en esta comunidad
""",
    "Honduras": """
- Tono cercano y empático
- Sé claro sobre costes y tiempos — son aspectos muy importantes
- Pueden no tener toda la documentación en regla — no juzgues, ayuda a encontrar solución
""",
    "Guatemala": """
- Tono formal y paciente
- Muchos con situación irregular de larga duración
- El arraigo social suele ser el trámite más relevante para esta comunidad
""",
    "El Salvador": """
- Tono directo y empático
- Suelen preguntar por arraigo laboral y social
- Aprecian que vayas al grano sin rodeos
""",
    "Nicaragua": """
- Tono cálido, muchos llevan pocos años por la situación política reciente
- Pueden tener documentación nicaragüense difícil de obtener desde España
- Empatía ante la situación personal es muy importante
""",
    "Paraguay": """
- Tono formal y cercano a la vez
- Algunos mezclan español y guaraní en el habla cotidiana
- Comunidad relativamente pequeña en España
- Paciencia y explicación detallada
""",
    "Costa Rica": """
- Tono muy educado y formal
- Muchos vienen por trabajo cualificado o estudios
- Aprecian la información precisa y bien estructurada
""",
    "Panamá": """
- Tono formal y directo
- Muchos vienen por negocios o trabajo cualificado
- Suelen tener documentación más ordenada que otras comunidades
""",
    "Brasil": """
- Responde SIEMPRE en portugués brasileño
- Tono cálido y cercano, los brasileños son muy expresivos
- Los términos legales españoles no tienen equivalente directo — explícalos en detalle
- Cuidado: 'visto' en portugués significa 'visa' — diferente al 'visto bueno' español
- Muchos tienen vínculos familiares portugueses o españoles
""",
    "Puerto Rico": """
- Tono cercano y tuteo natural
- Los puertorriqueños son ciudadanos estadounidenses — su situación en España es diferente
- Pueden no necesitar visado pero sí otros trámites — verifica siempre
""",
    "Guinea Ecuatorial": """
- Tono formal y respetuoso
- Comunidad pequeña pero muy ligada a España históricamente
- Muchos tienen vínculos familiares en España o doble nacionalidad
""",
    "default": """
- Tono claro, paciente y empático en español
- Explica los términos burocráticos españoles cuando los uses
- Asume que el usuario puede no conocer el sistema administrativo español
""",
}

TONO_POR_EDAD = {
    "18-25": """
- Tono cercano y directo, puedes ser más informal
- Frases cortas y bien estructuradas
- Suelen venir por estudios o primer trabajo
- Cómodos con gestiones online — puedes sugerirlas
- Puede que no conozcan bien sus derechos — explícalos con claridad
""",
    "26-35": """
- Tono equilibrado, ni muy formal ni muy informal
- Suelen tener más experiencia con trámites — ve al grano
- Pueden gestionar trámites para ellos y su familia
- Valoran la información práctica y los plazos concretos
""",
    "36-50": """
- Tono formal y detallado
- Valoran la precisión, los plazos y las consecuencias legales
- Es habitual que gestionen trámites para toda la familia
- Explica bien cada paso y sus implicaciones
""",
    "51+": """
- Tono muy formal, paciente y sin prisas
- Frases simples, evita la jerga técnica o digital
- Pueden necesitar más contexto y explicaciones básicas
- Ofrece siempre la opción de acudir a un profesional presencialmente
""",
}


def construir_contexto_cultural(pais: str, rango_edad: str) -> dict:

    info = PAISES_IDIOMAS.get(pais, {"idioma": "es", "nombre": "español"})
    contexto = CONTEXTO_CULTURAL.get(pais, CONTEXTO_CULTURAL["default"])
    tono = TONO_POR_EDAD.get(rango_edad, TONO_POR_EDAD["26-35"])

    return {
        "pais":              pais,
        "idioma_codigo":     info["idioma"],
        "idioma_nombre":     info["nombre"],
        "contexto_cultural": contexto,
        "tono_edad":         tono,
        "rango_edad":        rango_edad,
    }