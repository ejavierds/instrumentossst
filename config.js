/**
 * Configuración Global, Datos de los Instrumentos y Rutinas de Utilidad
 * Investigación: Estrategia de Formación en Seguridad y Salud Laboral para Gerentes y Supervisores del HCUAMP, Barquisimeto 2026.
 * Autora: Lcda. María Pargas | UNERG - Maestría en Gerencia de la Salud Pública
 */

const APP_CONFIG = {
  appName: "SST-Investiga HCUAMP",
  author: "Lcda. María Pargas",
  authorRole: "Investigadora Principal",
  institution: "Universidad Nacional Experimental de los Llanos Centrales «Rómulo Gallegos» (UNERG)",
  sede: "Hospital Central Universitario Dr. Antonio María Pineda (HCUAMP) - Barquisimeto",
  year: 2026,
  sheetId: "1Xyy-vs2PJMxunvcCCMACMet9MMNsxq3fG2BkSk5AxDc",
  // URL por defecto del Endpoint del Servicio Central
  defaultGasUrl: "https://script.google.com/macros/s/AKfycbwnvzDi1tY360LgFpESlfPMFkr2ZgLenTL-3fIm5E_zyyB0q13gztiTbgY2POTIn34/exec", 
  storageKeyGasUrl: "sst_hcuamp_gas_url",
  storageKeySurveyDraft: "sst_hcuamp_survey_draft",
  storageKeyExpertDraft: "sst_hcuamp_expert_draft",
  // Credencial de acceso de seguridad al Dashboard
  dashboardPassword: "Salud_2026"
};

// 20 Preguntas del Test de Conocimiento sobre Gestión en SST (LOPCYMAT)
const KNOWLEDGE_QUESTIONS = [
  {
    id: 1,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    question: "Según la LOPCYMAT, ¿cuál es la proporción establecida para elegir Delegados de Prevención en una entidad de 10 a 50 trabajadores?",
    options: [
      { key: "A", text: "Dos (2) delegados." },
      { key: "B", text: "Un (1) delegado." },
      { key: "C", text: "Tres (3) delegados." }
    ],
    correctAnswer: "A",
    rationale: "El artículo 41 de la LOPCYMAT estipula que en empresas de 11 a 50 trabajadores corresponden 2 delegados de prevención."
  },
  {
    id: 2,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    question: "¿Quiénes tienen la potestad legal para elegir a los Delegados de Prevención?",
    options: [
      { key: "A", text: "La Oficina de Gestión Humana del hospital." },
      { key: "B", text: "El sindicato de trabajadores." },
      { key: "C", text: "Los trabajadores, mediante votación directa y secreta." }
    ],
    correctAnswer: "C",
    rationale: "La elección es potestad exclusiva y soberana de los trabajadores mediante votación libre, universal, directa y secreta (Art. 41 LOPCYMAT)."
  },
  {
    id: 3,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    question: "¿Cuánto tiempo dura la inamovilidad laboral especial de un Delegado de Prevención tras culminar su período estatutario?",
    options: [
      { key: "A", text: "Seis (6) meses." },
      { key: "B", text: "Un (1) año." },
      { key: "C", text: "No posee inamovilidad tras culminar su período." }
    ],
    correctAnswer: "A", // En la doctrina y clave del instrumento se toma la opción A (prórroga protectora)
    rationale: "La normativa protege la gestión del delegado posterior a su mandato para prevenir retaliaciones laborales."
  },
  {
    id: 4,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    question: "¿Cuál de las siguientes es una facultad legal del Delegado de Prevención?",
    options: [
      { key: "A", text: "Sancionar económicamente al patrono por incumplimientos." },
      { key: "B", text: "Exigir al empleador información sobre daños a la salud y procesos peligrosos." },
      { key: "C", text: "Elaborar y firmar unilateralmente el Programa de SST." }
    ],
    correctAnswer: "B",
    rationale: "Art. 42 LOPCYMAT: Es facultad del delegado exigir información oportuna sobre los procesos peligrosos y daños a la salud."
  },
  {
    id: 5,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    question: "¿Ante qué organismo deben registrarse formalmente los Delegados de Prevención una vez electos?",
    options: [
      { key: "A", text: "Instituto Nacional de Prevención, Salud y Seguridad Laborales (INPSASEL)." },
      { key: "B", text: "Inspectoría del Trabajo." },
      { key: "C", text: "Instituto Venezolano de los Seguros Sociales (IVSS)." }
    ],
    correctAnswer: "A",
    rationale: "El registro formal de delegados electos debe tramitarse obligatoriamente ante el INPSASEL."
  },
  {
    id: 6,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    question: "¿Cómo debe estar conformado el Comité de Seguridad y Salud Laboral?",
    options: [
      { key: "A", text: "De forma paritaria (igual número de representantes del patrono y de los trabajadores)." },
      { key: "B", text: "Exclusivamente por médicos ocupacionales y prevencionistas." },
      { key: "C", text: "Por una mayoría del tren directivo del hospital." }
    ],
    correctAnswer: "A",
    rationale: "Art. 46 LOPCYMAT: El CSSL es un órgano paritario y colegiado integrado por Delegados de Prevención y representantes del patrono en igual número."
  },
  {
    id: 7,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    question: "Según la normativa, ¿cuál es la frecuencia mínima con la que debe reunirse el CSSL?",
    options: [
      { key: "A", text: "Semanalmente." },
      { key: "B", text: "Trimestralmente." },
      { key: "C", text: "Mensualmente." }
    ],
    correctAnswer: "C",
    rationale: "El Reglamento Parcial de la LOPCYMAT (Art. 76) establece que el Comité debe reunirse con carácter ordinario al menos una vez al mes."
  },
  {
    id: 8,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    question: "¿Cuál es el rol del CSSL respecto al Programa de Seguridad y Salud en el Trabajo (PSST)?",
    options: [
      { key: "A", text: "Redactarlo técnicamente y registrarlo ante las autoridades." },
      { key: "B", text: "Participar en su elaboración, aprobarlo y evaluar su cumplimiento." },
      { key: "C", text: "Archivar el documento para el expediente institucional." }
    ],
    correctAnswer: "B",
    rationale: "Art. 47 LOPCYMAT: El Comité tiene la atribución fundamental de participar activamente en la elaboración, aprobación y evaluación del PSST."
  },
  {
    id: 9,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    question: "¿Cómo deben documentarse legalmente los acuerdos alcanzados en las reuniones del CSSL?",
    options: [
      { key: "A", text: "Mediante memorandos internos enviados por Gestión Humana." },
      { key: "B", text: "A través de minutas digitales enviadas por correo electrónico." },
      { key: "C", text: "En un libro de actas debidamente foliado, sellado y firmado por los asistentes." }
    ],
    correctAnswer: "C",
    rationale: "Los acuerdos y deliberaciones deben asentarse en un Libro de Actas sellado por INPSASEL y debidamente firmado por los miembros presentes."
  },
  {
    id: 10,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    question: "¿Quiénes fungen como los representantes legítimos de los trabajadores ante el CSSL?",
    options: [
      { key: "A", text: "Los líderes sindicales de la institución." },
      { key: "B", text: "Los Delegados de Prevención electos." },
      { key: "C", text: "Los jefes de los departamentos clínicos." }
    ],
    correctAnswer: "B",
    rationale: "La representación de los trabajadores ante el Comité corresponde exclusivamente a los Delegados de Prevención electos democráticamente."
  },
  {
    id: 11,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    question: "¿Qué naturaleza tiene el Servicio de Seguridad y Salud en el Trabajo en la entidad empleadora?",
    options: [
      { key: "A", text: "Es una estructura técnica y multidisciplinaria de carácter obligatorio." },
      { key: "B", text: "Es una comisión voluntaria de trabajadores interesados en la salud." },
      { key: "C", text: "Es una oficina externa adscrita a la Inspectoría del Trabajo." }
    ],
    correctAnswer: "A",
    rationale: "Art. 39 LOPCYMAT: El SSST es un servicio esencial, multidisciplinario y de carácter obligatorio para toda institución pública o privada."
  },
  {
    id: 12,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    question: "¿A quién le corresponde la obligación legal de elaborar el Programa de Seguridad y Salud en el Trabajo?",
    options: [
      { key: "A", text: "A la Oficina de Gestión Humana." },
      { key: "B", al: "Al Servicio de Seguridad y Salud en el Trabajo (SSST)." },
      { key: "C", text: "Al Comité de Seguridad y Salud Laboral (CSSL)." }
    ],
    correctAnswer: "B",
    rationale: "Corresponde al SSST la elaboración técnica del PSST (Art. 61 LOPCYMAT), sometiéndolo a aprobación y control del CSSL."
  },
  {
    id: 13,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    question: "¿Cuál de las siguientes es una función inherente al SSST?",
    options: [
      { key: "A", text: "Aplicar amonestaciones y despidos justificados." },
      { key: "B", text: "Mantener la vigilancia epidemiológica de los accidentes y enfermedades ocupacionales." },
      { key: "C", text: "Negociar convenciones colectivas de trabajo." }
    ],
    correctAnswer: "B",
    rationale: "Art. 40 LOPCYMAT: La vigilancia continua de la salud y epidemiología ocupacional es función técnica medular del SSST."
  },
  {
    id: 14,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    question: "¿Qué perfiles profesionales deben conformar obligatoriamente el SSST?",
    options: [
      { key: "A", text: "Profesionales de la medicina ocupacional, higiene, ergonomía y seguridad industrial." },
      { key: "B", text: "Únicamente médicos cirujanos y enfermeras." },
      { key: "C", text: "Exclusivamente abogados laboralistas y administradores." }
    ],
    correctAnswer: "A",
    rationale: "El carácter multidisciplinario del SSST demanda médicos ocupacionales, higienistas, ergónomos y especialistas en seguridad industrial."
  },
  {
    id: 15,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    question: "¿En qué momentos es obligatorio que el SSST garantice la realización de evaluaciones médicas al personal?",
    options: [
      { key: "A", text: "Pre-empleo, pre-vacacional, post-vacacional y de egreso." },
      { key: "B", text: "Solo al momento de ingresar a la institución." },
      { key: "C", text: "Exclusivamente cuando el trabajador reporta sentirse enfermo." }
    ],
    correctAnswer: "A",
    rationale: "El Reglamento LOPCYMAT exige exámenes médicos pre-empleo, periódicos (pre/post-vacacional) y al término de la relación laboral (egreso)."
  },
  {
    id: 16,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    question: "¿Qué Norma Técnica vigente del INPSASEL rige la elaboración, implementación y evaluación del PSST?",
    options: [
      { key: "A", text: "Norma Técnica NT-01-2008." },
      { key: "B", text: "Norma Técnica NT-04-2023." },
      { key: "C", text: "Norma Técnica NT-02-2008." }
    ],
    correctAnswer: "A",
    rationale: "La Norma Técnica NT-01-2008 dictada por INPSASEL regula la metodología técnica para la elaboración e implementación del PSST."
  },
  {
    id: 17,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    question: "Según la norma técnica, ¿cuál es un componente obligatorio que debe detallarse en el PSST por cada puesto de trabajo?",
    options: [
      { key: "A", text: "La identificación exhaustiva de los procesos peligrosos." },
      { key: "B", text: "La escala salarial y los bonos de productividad." },
      { key: "C", text: "El perfil de ingreso y evaluación de desempeño." }
    ],
    correctAnswer: "A",
    rationale: "La identificación y evaluación de procesos peligrosos por puesto es el corazón operativo del Programa de Seguridad y Salud."
  },
  {
    id: 18,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    question: "Para auditar la eficacia del PSST, la normativa actualizada exige la inclusión obligatoria de:",
    options: [
      { key: "A", text: "Fotografías de las instalaciones del hospital." },
      { key: "B", text: "Entrevistas cualitativas mensuales a los pacientes." },
      { key: "C", text: "Indicadores de gestión cuantitativos (frecuencia, severidad, morbilidad)." }
    ],
    correctAnswer: "C",
    rationale: "El control estadístico de gestión requiere tasas de frecuencia neta, severidad, morbilidad ocupacional y horas hombre de capacitación."
  },
  {
    id: 19,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    question: "Frente a emergencias o riesgos inminentes en el hospital, ¿qué debe contener el PSST?",
    options: [
      { key: "A", text: "Autorizaciones para el cierre definitivo de la institución." },
      { key: "B", text: "Planes de contingencia, rutas de desalojo y atención de emergencias." },
      { key: "C", text: "Permisos no remunerados automáticos para todo el personal." }
    ],
    correctAnswer: "B",
    rationale: "Todo PSST debe integrar obligatoriamente planes de contingencia, evacuación y protocolos de auxilio médico inmediato."
  },
  {
    id: 20,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    question: "El diseño de los planes de formación técnica para los trabajadores en materia de riesgos laborales es responsabilidad de:",
    options: [
      { key: "A", text: "El Ministerio de Salud a nivel central." },
      { key: "B", text: "El Programa de Seguridad y Salud en el Trabajo (diseñado por el SSST)." },
      { key: "C", text: "El sindicato hospitalario local." }
    ],
    correctAnswer: "B",
    rationale: "El plan anual de capacitación en SST forma parte integral del PSST diseñado por el SSST y aprobado por el CSSL."
  }
];

// 20 Ítems de la Escala de Necesidades de Formación en SST (Escala Likert 1 a 5)
const LIKERT_ITEMS = [
  // Dimensión A: Delegados de Prevención (21-25)
  {
    id: 21,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    text: "Procedimientos técnicos y logísticos para organizar las elecciones de delegados."
  },
  {
    id: 22,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    text: "Límites legales de la inamovilidad laboral de los delegados de prevención."
  },
  {
    id: 23,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    text: "Gestión de respuestas ante las denuncias o exigencias de información de los delegados."
  },
  {
    id: 24,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    text: "Integración del delegado en las inspecciones de áreas clínicas y administrativas."
  },
  {
    id: 25,
    dimension: "A",
    dimensionName: "Delegados de Prevención",
    text: "Manejo de la plataforma web de INPSASEL para el registro formal de los delegados."
  },

  // Dimensión B: Comité de Seguridad y Salud Laboral (CSSL) (26-30)
  {
    id: 26,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    text: "Criterios legales para la designación de los representantes del patrono en el CSSL."
  },
  {
    id: 27,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    text: "Metodología para dirigir reuniones paritarias y mediar conflictos laborales."
  },
  {
    id: 28,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    text: "Redacción técnica de actas y minutas según los estándares exigidos por el INPSASEL."
  },
  {
    id: 29,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    text: "Procedimiento administrativo para el registro del CSSL y el reporte de acuerdos."
  },
  {
    id: 30,
    dimension: "B",
    dimensionName: "Comité de Seguridad y Salud Laboral (CSSL)",
    text: "Rol gerencial en la evaluación del desempeño y efectividad del Comité."
  },

  // Dimensión C: Servicio de Seguridad y Salud en el Trabajo (SSST) (31-35)
  {
    id: 31,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    text: "Requisitos de infraestructura, dotación y perfiles para el funcionamiento del SSST."
  },
  {
    id: 32,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    text: "Coordinación entre Gestión Humana y el SSST para la vigilancia epidemiológica."
  },
  {
    id: 33,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    text: "Metodología legal para la investigación y declaración de accidentes laborales en < 24 hrs."
  },
  {
    id: 34,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    text: "Obligaciones patronales referidas a la realización de evaluaciones médicas ocupacionales."
  },
  {
    id: 35,
    dimension: "C",
    dimensionName: "Servicio de Seguridad y Salud en el Trabajo (SSST)",
    text: "Manejo de estadísticas de morbilidad y ausentismo por causas comprobadas de origen laboral."
  },

  // Dimensión D: Programa de Seguridad y Salud en el Trabajo (PSST) (36-40)
  {
    id: 36,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    text: "Análisis e identificación de procesos peligrosos y riesgos biológicos hospitalarios."
  },
  {
    id: 37,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    text: "Estructura y llenado de los formatos digitales exigidos por la Norma Técnica NT-04-2023."
  },
  {
    id: 38,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    text: "Diseño, cálculo y medición de indicadores de gestión cuantitativos de salud ocupacional."
  },
  {
    id: 39,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    text: "Formulación de planes de contingencia para emergencias en entornos asistenciales críticos."
  },
  {
    id: 40,
    dimension: "D",
    dimensionName: "Programa de Seguridad y Salud en el Trabajo (PSST)",
    text: "Estrategias para la socialización e inducción del PSST al personal de nuevo ingreso."
  }
];

// Matriz de Evaluación para Juicio de Expertos (40 Ítems consolidando Parte II y Parte III)
const EXPERT_EVALUATION_ITEMS = [
  // PARTE II: TEST DE CONOCIMIENTO (1 al 20)
  { id: 1, section: "Parte II: Test de Conocimiento", content: "Del. Prevención: Proporción de trabajadores" },
  { id: 2, section: "Parte II: Test de Conocimiento", content: "Del. Prevención: Potestad de elección" },
  { id: 3, section: "Parte II: Test de Conocimiento", content: "Del. Prevención: Tiempo de inamovilidad" },
  { id: 4, section: "Parte II: Test de Conocimiento", content: "Del. Prevención: Facultades legales" },
  { id: 5, section: "Parte II: Test de Conocimiento", content: "Del. Prevención: Organismo de registro" },
  { id: 6, section: "Parte II: Test de Conocimiento", content: "Comité (CSSL): Conformación paritaria" },
  { id: 7, section: "Parte II: Test de Conocimiento", content: "Comité (CSSL): Frecuencia de reuniones" },
  { id: 8, section: "Parte II: Test de Conocimiento", content: "Comité (CSSL): Rol sobre el Programa (PSST)" },
  { id: 9, section: "Parte II: Test de Conocimiento", content: "Comité (CSSL): Documentación de acuerdos" },
  { id: 10, section: "Parte II: Test de Conocimiento", content: "Comité (CSSL): Representación trabajadora" },
  { id: 11, section: "Parte II: Test de Conocimiento", content: "Servicio (SSST): Naturaleza de la estructura" },
  { id: 12, section: "Parte II: Test de Conocimiento", content: "Servicio (SSST): Obligación del Programa" },
  { id: 13, section: "Parte II: Test de Conocimiento", content: "Servicio (SSST): Funciones inherentes" },
  { id: 14, section: "Parte II: Test de Conocimiento", content: "Servicio (SSST): Perfiles profesionales" },
  { id: 15, section: "Parte II: Test de Conocimiento", content: "Servicio (SSST): Evaluaciones médicas" },
  { id: 16, section: "Parte II: Test de Conocimiento", content: "Programa (PSST): Norma Técnica aplicable" },
  { id: 17, section: "Parte II: Test de Conocimiento", content: "Programa (PSST): Identificación de procesos" },
  { id: 18, section: "Parte II: Test de Conocimiento", content: "Programa (PSST): Inclusión de indicadores" },
  { id: 19, section: "Parte II: Test de Conocimiento", content: "Programa (PSST): Planes de contingencia" },
  { id: 20, section: "Parte II: Test de Conocimiento", content: "Programa (PSST): Responsable de formación" },

  // PARTE III: ESCALA DE NECESIDADES (21 al 40)
  { id: 21, section: "Parte III: Escala de Necesidades", content: "Del. Prevención: Logística de elecciones" },
  { id: 22, section: "Parte III: Escala de Necesidades", content: "Del. Prevención: Límites de inamovilidad" },
  { id: 23, section: "Parte III: Escala de Necesidades", content: "Del. Prevención: Gestión de denuncias" },
  { id: 24, section: "Parte III: Escala de Necesidades", content: "Del. Prevención: Inspecciones conjuntas" },
  { id: 25, section: "Parte III: Escala de Necesidades", content: "Del. Prevención: Registro en plataforma web" },
  { id: 26, section: "Parte III: Escala de Necesidades", content: "Comité (CSSL): Criterios de designación" },
  { id: 27, section: "Parte III: Escala de Necesidades", content: "Comité (CSSL): Mediación de conflictos" },
  { id: 28, section: "Parte III: Escala de Necesidades", content: "Comité (CSSL): Redacción técnica de actas" },
  { id: 29, section: "Parte III: Escala de Necesidades", content: "Comité (CSSL): Procedimiento de registro" },
  { id: 30, section: "Parte III: Escala de Necesidades", content: "Comité (CSSL): Evaluación de desempeño" },
  { id: 31, section: "Parte III: Escala de Necesidades", content: "Servicio (SSST): Requisitos de funcionamiento" },
  { id: 32, section: "Parte III: Escala de Necesidades", content: "Servicio (SSST): Vigilancia epidemiológica" },
  { id: 33, section: "Parte III: Escala de Necesidades", content: "Servicio (SSST): Investigación de accidentes" },
  { id: 34, section: "Parte III: Escala de Necesidades", content: "Servicio (SSST): Evaluaciones ocupacionales" },
  { id: 35, section: "Parte III: Escala de Necesidades", content: "Servicio (SSST): Manejo de estadísticas" },
  { id: 36, section: "Parte III: Escala de Necesidades", content: "Programa (PSST): Riesgos hospitalarios" },
  { id: 37, section: "Parte III: Escala de Necesidades", content: "Programa (PSST): Llenado formato NT-04-2023" },
  { id: 38, section: "Parte III: Escala de Necesidades", content: "Programa (PSST): Diseño de indicadores" },
  { id: 39, section: "Parte III: Escala de Necesidades", content: "Programa (PSST): Planes de contingencia" },
  { id: 40, section: "Parte III: Escala de Necesidades", content: "Programa (PSST): Inducción a nuevo ingreso" }
];

// Opciones de Escala Likert
const LIKERT_OPTIONS = [
  { value: 1, label: "Nada necesaria", short: "1" },
  { value: 2, label: "Poco necesaria", short: "2" },
  { value: 3, label: "Moderadamente necesaria", short: "3" },
  { value: 4, label: "Bastante necesaria", short: "4" },
  { value: 5, label: "Totalmente necesaria", short: "5" }
];

// Funciones de Cálculo Metodológico
const SCORING = {
  // Baremo de Conocimiento: 0-10 Bajo, 11-15 Medio, 16-20 Alto
  getKnowledgeCategory(score) {
    if (score <= 10) return { level: "Bajo", badgeClass: "bg-red-500/20 text-red-300 border-red-500/40", color: "#ef4444" };
    if (score <= 15) return { level: "Medio", badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40", color: "#f59e0b" };
    return { level: "Alto", badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", color: "#10b981" };
  },

  // Baremo de Necesidades de Formación (Medias): 1-2.50 Baja, 2.51-3.50 Moderada, 3.51-5.00 Alta necesidad
  getLikertCategory(mean) {
    const val = Number(mean);
    if (val <= 2.50) return { level: "Baja necesidad", badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", color: "#10b981" };
    if (val <= 3.50) return { level: "Moderada necesidad", badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40", color: "#f59e0b" };
    return { level: "Alta necesidad", badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40", color: "#f43f5e" };
  }
};

// Utilidades UI (Toast Notifications, Local Storage, etc.)
const UI = {
  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    
    const toast = document.createElement("div");
    const colors = {
      success: "border-emerald-500/60 bg-emerald-950/90 text-emerald-200 shadow-emerald-900/40",
      error: "border-rose-500/60 bg-rose-950/90 text-rose-200 shadow-rose-900/40",
      info: "border-sky-500/60 bg-sky-950/90 text-sky-200 shadow-sky-900/40",
      warning: "border-amber-500/60 bg-amber-950/90 text-amber-200 shadow-amber-900/40"
    };

    const icons = {
      success: `<svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`,
      error: `<svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`,
      info: `<svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>`,
      warning: `<svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`
    };

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 text-sm font-medium ${colors[type] || colors.info}`;
    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-2", "opacity-0");
    });

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  },

  getGasUrl() {
    return localStorage.getItem(APP_CONFIG.storageKeyGasUrl) || APP_CONFIG.defaultGasUrl;
  },

  async initServerEnv() {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        if (data && data.gasUrl) {
          APP_CONFIG.defaultGasUrl = data.gasUrl;
          const inputGas = document.getElementById("gas-url-input");
          if (inputGas && !localStorage.getItem(APP_CONFIG.storageKeyGasUrl)) {
            inputGas.value = data.gasUrl;
          }
        }
        if (data && data.dashboardPassword) {
          APP_CONFIG.dashboardPassword = data.dashboardPassword;
        }
        console.log("⚙️ Variables de entorno del servidor cargadas exitosamente.");
      }
    } catch (e) {
      // Si corre en entorno local estático, usa los valores predefinidos
    }
  },

  setGasUrl(url) {
    if (url) {
      localStorage.setItem(APP_CONFIG.storageKeyGasUrl, url.trim());
    } else {
      localStorage.removeItem(APP_CONFIG.storageKeyGasUrl);
    }
  }
};
