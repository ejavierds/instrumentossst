/**
 * =========================================================================================
 * BACKEND API REST - SERVICIO CENTRAL INSTITUCIONAL (HCUAMP 2026)
 * Proyecto: Estrategia de Formación en SST para Gerentes y Supervisores del HCUAMP (2026)
 * Autora: Lcda. María Pargas | Maestría en Gerencia de la Salud Pública - UNERG
 * Repositorio Central de Datos (ID: 1Xyy-vs2PJMxunvcCCMACMet9MMNsxq3fG2BkSk5AxDc)
 * =========================================================================================
 */

// ID del documento del repositorio central
const SPREADSHEET_ID = "1Xyy-vs2PJMxunvcCCMACMet9MMNsxq3fG2BkSk5AxDc";

// Nombres de las pestañas
const SHEETS = {
  SURVEY: "Respuestas_Encuesta",
  EXPERTS: "Validacion_Expertos",
  EXPERT_ITEMS: "Detalle_Items_Expertos",
  CONFIG: "Configuracion"
};

/**
 * Función de inicialización y formateo del Repositorio de Datos.
 * Ejecutar una vez desde el editor del servicio para crear las tablas y encabezados.
 */
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // 1. Pestaña de Encuestas
  let surveySheet = ss.getSheetByName(SHEETS.SURVEY);
  if (!surveySheet) {
    surveySheet = ss.insertSheet(SHEETS.SURVEY);
  }
  const surveyHeaders = [
    "Timestamp", "ID_Registro", "Consentimiento", "Edad", "Sexo", "Nivel_Instruccion",
    "Cargo_HCUAMP", "Experiencia_Anos", "Condicion_Laboral", "Supervisados_Aprox",
    "Formacion_SST_3Anos", "Tipo_Formacion", "Miembro_CSSL", "Participo_Elecciones_Del", "Turno",
    // Test de Conocimiento (P1 a P20)
    "P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09", "P10",
    "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20",
    "Total_Conocimiento_Ptos", "Nivel_Conocimiento",
    "Score_Dim_A_Delegados", "Score_Dim_B_CSSL", "Score_Dim_C_SSST", "Score_Dim_D_PSST",
    // Escala Likert de Necesidades (P21 a P40)
    "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30",
    "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39", "L40",
    "Media_Dim_A_Delegados", "Media_Dim_B_CSSL", "Media_Dim_C_SSST", "Media_Dim_D_PSST",
    "Media_General_Necesidades", "Nivel_Necesidad"
  ];
  styleHeaders(surveySheet, surveyHeaders, "#0f4c81");

  // 2. Pestaña de Juicio de Expertos
  let expertSheet = ss.getSheetByName(SHEETS.EXPERTS);
  if (!expertSheet) {
    expertSheet = ss.insertSheet(SHEETS.EXPERTS);
  }
  const expertHeaders = [
    "Timestamp", "ID_Experto", "Nombres_Apellidos", "Cedula", "Telefono",
    "Profesion", "Especialidad_Grado", "Institucion", "Cargo", "Anos_Experiencia",
    "Total_Items_Evaluados", "Total_Claridad_Si", "Porc_Claridad",
    "Total_Pertinencia_Si", "Porc_Pertinencia",
    "Total_Coherencia_Si", "Porc_Coherencia",
    "Dictamen_Final", "Comentario_General", "Fecha_Evaluacion"
  ];
  styleHeaders(expertSheet, expertHeaders, "#1e3a8a");

  // 3. Pestaña de Detalle de Ítems evaluados por Expertos
  let itemDetailSheet = ss.getSheetByName(SHEETS.EXPERT_ITEMS);
  if (!itemDetailSheet) {
    itemDetailSheet = ss.insertSheet(SHEETS.EXPERT_ITEMS);
  }
  const itemDetailHeaders = [
    "Timestamp", "ID_Experto", "Experto_Nombre", "Numero_Item", "Seccion",
    "Contenido_Evaluado", "Claridad_Cumple", "Pertinencia_Cumple", "Coherencia_Cumple", "Observaciones_Sugerencias"
  ];
  styleHeaders(itemDetailSheet, itemDetailHeaders, "#0369a1");

  Logger.log("✅ Tablas y encabezados configurados exitosamente en el repositorio central.");
}

function styleHeaders(sheet, headers, hexColor) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(hexColor);
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}

/**
 * =========================================================================================
 * MANEJADOR HTTP POST (doPost) - Recepción de Instrumentos
 * =========================================================================================
 */
function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("No se recibieron datos en el cuerpo de la petición.");
    }

    const action = data.action || (e.parameter ? e.parameter.action : "submit_survey");
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === "submit_survey") {
      return handleSurveySubmission(ss, data);
    } else if (action === "submit_expert_validation") {
      return handleExpertSubmission(ss, data);
    } else if (action === "setup") {
      setupSheets();
      return createJsonResponse({ status: "success", message: "Estructura de hojas inicializada correctamente." });
    } else {
      return createJsonResponse({ status: "error", message: "Acción no reconocida: " + action });
    }

  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString(),
      stack: err.stack
    });
  }
}

/**
 * Procesa el envío de la encuesta al personal
 */
function handleSurveySubmission(ss, data) {
  let sheet = ss.getSheetByName(SHEETS.SURVEY);
  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(SHEETS.SURVEY);
  }

  const timestamp = new Date();
  const idRegistro = "ENC-" + Utilities.formatDate(timestamp, "America/Caracas", "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 899 + 100);

  const socio = data.sociodemographic || {};
  const test = data.knowledgeAnswers || {};
  const scores = data.knowledgeScore || {};
  const likert = data.likertAnswers || {};
  const likertStats = data.likertStats || {};

  const row = [
    timestamp,
    idRegistro,
    data.consentAccepted ? "SÍ" : "NO",
    socio.edad || "",
    socio.sexo || "",
    socio.nivelInstruccion || "",
    socio.cargo || "",
    socio.experienciaAnos || 0,
    socio.condicionLaboral || "",
    socio.supervisadosAprox || 0,
    socio.formacionPrevia || "",
    socio.tipoFormacion || "N/A",
    socio.miembroCSSL || "",
    socio.participoElecciones || "",
    socio.turno || "",
    
    // Test P1 a P20
    test.P01 || "", test.P02 || "", test.P03 || "", test.P04 || "", test.P05 || "",
    test.P06 || "", test.P07 || "", test.P08 || "", test.P09 || "", test.P10 || "",
    test.P11 || "", test.P12 || "", test.P13 || "", test.P14 || "", test.P15 || "",
    test.P16 || "", test.P17 || "", test.P18 || "", test.P19 || "", test.P20 || "",
    
    scores.totalScore || 0,
    scores.level || "",
    scores.dimA || 0,
    scores.dimB || 0,
    scores.dimC || 0,
    scores.dimD || 0,

    // Likert L21 a L40
    likert.L21 || 0, likert.L22 || 0, likert.L23 || 0, likert.L24 || 0, likert.L25 || 0,
    likert.L26 || 0, likert.L27 || 0, likert.L28 || 0, likert.L29 || 0, likert.L30 || 0,
    likert.L31 || 0, likert.L32 || 0, likert.L33 || 0, likert.L34 || 0, likert.L35 || 0,
    likert.L36 || 0, likert.L37 || 0, likert.L38 || 0, likert.L39 || 0, likert.L40 || 0,

    likertStats.dimA || 0,
    likertStats.dimB || 0,
    likertStats.dimC || 0,
    likertStats.dimD || 0,
    likertStats.overallMean || 0,
    likertStats.level || ""
  ];

  sheet.appendRow(row);

  return createJsonResponse({
    status: "success",
    message: "Encuesta guardada con éxito en el repositorio central institucional.",
    idRegistro: idRegistro,
    totalScore: scores.totalScore,
    knowledgeLevel: scores.level,
    likertMean: likertStats.overallMean,
    likertLevel: likertStats.level
  });
}

/**
 * Procesa el envío del instrumento de validación de expertos
 */
function handleExpertSubmission(ss, data) {
  let expertSheet = ss.getSheetByName(SHEETS.EXPERTS);
  let detailSheet = ss.getSheetByName(SHEETS.EXPERT_ITEMS);
  if (!expertSheet || !detailSheet) {
    setupSheets();
    expertSheet = ss.getSheetByName(SHEETS.EXPERTS);
    detailSheet = ss.getSheetByName(SHEETS.EXPERT_ITEMS);
  }

  const timestamp = new Date();
  const expertId = "EXP-" + Utilities.formatDate(timestamp, "America/Caracas", "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 899 + 100);

  const exp = data.expertData || {};
  const stats = data.validationStats || {};
  const items = data.matrixEvaluations || [];

  const expertRow = [
    timestamp,
    expertId,
    exp.nombresApellidos || "",
    exp.cedula || "",
    exp.telefono || "",
    exp.profesion || "",
    exp.especialidadGrado || "",
    exp.institucion || "",
    exp.cargo || "",
    exp.experienciaAnos || 0,
    items.length,
    stats.claridadSi || 0,
    stats.porcClaridad || "0%",
    stats.pertinenciaSi || 0,
    stats.porcPertinencia || "0%",
    stats.coherenciaSi || 0,
    stats.porcCoherencia || "0%",
    data.dictamenFinal || "",
    data.comentarioGeneral || "",
    data.fechaEvaluacion || Utilities.formatDate(timestamp, "America/Caracas", "dd/MM/yyyy")
  ];

  expertSheet.appendRow(expertRow);

  // Inserción en lote de las 40 filas detalladas para trazabilidad metodológica
  if (items && items.length > 0) {
    const detailRows = items.map(it => [
      timestamp,
      expertId,
      exp.nombresApellidos || "Experto",
      it.id,
      it.section || "",
      it.content || "",
      it.claridad ? "SÍ" : "NO",
      it.pertinencia ? "SÍ" : "NO",
      it.coherencia ? "SÍ" : "NO",
      it.observaciones || ""
    ]);
    detailSheet.getRange(detailSheet.getLastRow() + 1, 1, detailRows.length, detailRows[0].length).setValues(detailRows);
  }

  return createJsonResponse({
    status: "success",
    message: "Validación de juicio de expertos asentada satisfactoriamente.",
    expertId: expertId,
    dictamenFinal: data.dictamenFinal
  });
}

/**
 * =========================================================================================
 * MANEJADOR HTTP GET (doGet) - Lectura y Analítica para el Dashboard
 * =========================================================================================
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "get_dashboard";
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === "ping") {
      return createJsonResponse({ status: "success", message: "API REST SST HCUAMP activa.", timestamp: new Date() });
    }

    if (action === "get_dashboard") {
      const dashboardData = computeDashboardMetrics(ss);
      return createJsonResponse({
        status: "success",
        data: dashboardData
      });
    }

    return createJsonResponse({ status: "error", message: "Acción GET no soportada: " + action });

  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString(),
      stack: err.stack
    });
  }
}

/**
 * Procesa y agrega los datos crudos para el consumo visual en Chart.js
 */
function computeDashboardMetrics(ss) {
  const surveySheet = ss.getSheetByName(SHEETS.SURVEY);
  const expertSheet = ss.getSheetByName(SHEETS.EXPERTS);

  // 1. Estadísticas de Encuestas
  let surveyRows = [];
  if (surveySheet && surveySheet.getLastRow() > 1) {
    surveyRows = surveySheet.getRange(2, 1, surveySheet.getLastRow() - 1, surveySheet.getLastColumn()).getValues();
  }

  const totalEncuestados = surveyRows.length;

  // Variables para acumulación
  let totalKnowledgeScore = 0;
  let knowledgeLevels = { Bajo: 0, Medio: 0, Alto: 0 };
  let knowledgeDimScores = { dimA: 0, dimB: 0, dimC: 0, dimD: 0 };
  
  let totalLikertMean = 0;
  let likertLevels = { "Baja necesidad": 0, "Moderada necesidad": 0, "Alta necesidad": 0 };
  let likertDimScores = { dimA: 0, dimB: 0, dimC: 0, dimD: 0 };

  let cargos = {};
  let nivelInstruccion = {};
  let sexo = { Femenino: 0, Masculino: 0, Otro: 0 };
  let formacionSST = { "Sí": 0, "No": 0 };
  let tiposFormacion = {};

  surveyRows.forEach(row => {
    // Índices según surveyHeaders:
    // 4: Sexo, 5: Nivel_Instruccion, 6: Cargo, 10: Formacion_SST_3Anos, 11: Tipo_Formacion
    // 35: Total_Conocimiento_Ptos, 36: Nivel_Conocimiento, 37: dimA, 38: dimB, 39: dimC, 40: dimD
    // 61: Media_Dim_A, 62: Media_Dim_B, 63: Media_Dim_C, 64: Media_Dim_D, 65: Media_General, 66: Nivel_Necesidad

    const sx = row[4] || "No especificado";
    sexo[sx] = (sexo[sx] || 0) + 1;

    const inst = row[5] || "No especificado";
    nivelInstruccion[inst] = (nivelInstruccion[inst] || 0) + 1;

    const cg = row[6] || "No especificado";
    cargos[cg] = (cargos[cg] || 0) + 1;

    const form = row[10] || "No";
    formacionSST[form] = (formacionSST[form] || 0) + 1;

    const tipoF = row[11];
    if (tipoF && tipoF !== "N/A") {
      tiposFormacion[tipoF] = (tiposFormacion[tipoF] || 0) + 1;
    }

    const kScore = Number(row[35]) || 0;
    const kLevel = row[36] || "Bajo";
    totalKnowledgeScore += kScore;
    if (knowledgeLevels[kLevel] !== undefined) knowledgeLevels[kLevel]++;
    else knowledgeLevels["Bajo"]++;

    knowledgeDimScores.dimA += Number(row[37]) || 0;
    knowledgeDimScores.dimB += Number(row[38]) || 0;
    knowledgeDimScores.dimC += Number(row[39]) || 0;
    knowledgeDimScores.dimD += Number(row[40]) || 0;

    const lMean = Number(row[65]) || 0;
    const lLevel = row[66] || "Moderada necesidad";
    totalLikertMean += lMean;
    if (likertLevels[lLevel] !== undefined) likertLevels[lLevel]++;
    else likertLevels["Moderada necesidad"]++;

    likertDimScores.dimA += Number(row[61]) || 0;
    likertDimScores.dimB += Number(row[62]) || 0;
    likertDimScores.dimC += Number(row[63]) || 0;
    likertDimScores.dimD += Number(row[64]) || 0;
  });

  const avgKnowledge = totalEncuestados > 0 ? (totalKnowledgeScore / totalEncuestados).toFixed(2) : 0;
  const avgLikert = totalEncuestados > 0 ? (totalLikertMean / totalEncuestados).toFixed(2) : 0;

  const avgKnowledgeDims = {
    dimA: totalEncuestados > 0 ? (knowledgeDimScores.dimA / totalEncuestados).toFixed(2) : 0,
    dimB: totalEncuestados > 0 ? (knowledgeDimScores.dimB / totalEncuestados).toFixed(2) : 0,
    dimC: totalEncuestados > 0 ? (knowledgeDimScores.dimC / totalEncuestados).toFixed(2) : 0,
    dimD: totalEncuestados > 0 ? (knowledgeDimScores.dimD / totalEncuestados).toFixed(2) : 0
  };

  const avgLikertDims = {
    dimA: totalEncuestados > 0 ? (likertDimScores.dimA / totalEncuestados).toFixed(2) : 0,
    dimB: totalEncuestados > 0 ? (likertDimScores.dimB / totalEncuestados).toFixed(2) : 0,
    dimC: totalEncuestados > 0 ? (likertDimScores.dimC / totalEncuestados).toFixed(2) : 0,
    dimD: totalEncuestados > 0 ? (likertDimScores.dimD / totalEncuestados).toFixed(2) : 0
  };

  // 2. Estadísticas de Juicio de Expertos
  let expertRows = [];
  if (expertSheet && expertSheet.getLastRow() > 1) {
    expertRows = expertSheet.getRange(2, 1, expertSheet.getLastRow() - 1, expertSheet.getLastColumn()).getValues();
  }

  const totalExpertos = expertRows.length;
  let dictamenes = {
    "Aprobado sin modificaciones": 0,
    "Aprobado con observaciones": 0,
    "No Aprobado": 0
  };
  let sumClaridad = 0;
  let sumPertinencia = 0;
  let sumCoherencia = 0;

  expertRows.forEach(row => {
    // expertHeaders: 12: Porc_Claridad, 14: Porc_Pertinencia, 16: Porc_Coherencia, 17: Dictamen_Final
    const cl = parseFloat(String(row[12]).replace("%", "")) || 0;
    const pt = parseFloat(String(row[14]).replace("%", "")) || 0;
    const ch = parseFloat(String(row[16]).replace("%", "")) || 0;
    sumClaridad += cl;
    sumPertinencia += pt;
    sumCoherencia += ch;

    const dict = row[17] || "Aprobado con observaciones";
    if (dictamenes[dict] !== undefined) dictamenes[dict]++;
    else dictamenes["Aprobado con observaciones"]++;
  });

  const avgClaridad = totalExpertos > 0 ? (sumClaridad / totalExpertos).toFixed(1) : 0;
  const avgPertinencia = totalExpertos > 0 ? (sumPertinencia / totalExpertos).toFixed(1) : 0;
  const avgCoherencia = totalExpertos > 0 ? (sumCoherencia / totalExpertos).toFixed(1) : 0;

  return {
    summary: {
      totalEncuestados: totalEncuestados,
      avgKnowledgeScore: avgKnowledge,
      avgLikertScore: avgLikert,
      totalExpertos: totalExpertos,
      lastUpdated: new Date()
    },
    knowledge: {
      levels: knowledgeLevels,
      dimAverages: avgKnowledgeDims
    },
    likert: {
      levels: likertLevels,
      dimAverages: avgLikertDims
    },
    sociodemographic: {
      cargos: cargos,
      nivelInstruccion: nivelInstruccion,
      sexo: sexo,
      formacionSST: formacionSST,
      tiposFormacion: tiposFormacion
    },
    experts: {
      total: totalExpertos,
      dictamenes: dictamenes,
      criterios: {
        claridad: avgClaridad,
        pertinencia: avgPertinencia,
        coherencia: avgCoherencia
      }
    }
  };
}

/**
 * Helper para generar respuesta JSON con cabeceras CORS
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
