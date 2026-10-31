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
 * MANEJADOR HTTP GET (doGet) - Lectura, Diagnóstico y Analítica para el Dashboard
 * =========================================================================================
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "get_dashboard";
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === "ping") {
      return createJsonResponse({ 
        status: "success", 
        message: "API REST SST HCUAMP activa.", 
        spreadsheetId: SPREADSHEET_ID,
        timestamp: new Date() 
      });
    }

    // Acción de diagnóstico profundo de hojas, filas y columnas del repositorio central
    if (action === "inspect_sheets") {
      const sheetsList = ss.getSheets().map(function(s) {
        const lastRow = s.getLastRow();
        const lastCol = s.getLastColumn();
        let headers = [];
        let sampleRow = [];
        if (lastRow > 0 && lastCol > 0) {
          headers = s.getRange(1, 1, 1, Math.min(lastCol, 30)).getValues()[0];
        }
        if (lastRow > 1 && lastCol > 0) {
          sampleRow = s.getRange(2, 1, 1, Math.min(lastCol, 10)).getValues()[0];
        }
        return {
          name: s.getName(),
          rowCount: lastRow,
          colCount: lastCol,
          headers: headers,
          sampleRow: sampleRow
        };
      });

      return createJsonResponse({
        status: "success",
        spreadsheetId: SPREADSHEET_ID,
        totalSheets: sheetsList.length,
        sheets: sheetsList
      });
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

// Clave metodológica oficial de respuestas correctas del Test de Conocimiento (20 ítems LOPCYMAT)
const KNOWLEDGE_KEY = {
  1: "A", 2: "C", 3: "B", 4: "B", 5: "A",
  6: "B", 7: "B", 8: "A", 9: "B", 10: "A",
  11: "B", 12: "A", 13: "B", 14: "B", 15: "B",
  16: "B", 17: "B", 18: "A", 19: "B", 20: "B"
};

/**
 * Localiza de manera inteligente la pestaña con las respuestas de encuestas,
 * buscando por nombre oficial, por patrones comunes o por volumen de datos.
 */
function findSurveySheet(ss) {
  let sheet = ss.getSheetByName(SHEETS.SURVEY);
  if (sheet && sheet.getLastRow() > 1) return sheet;

  const allSheets = ss.getSheets();
  
  // Buscar pestañas con nombres alusivos a encuestas/respuestas
  for (let i = 0; i < allSheets.length; i++) {
    const s = allSheets[i];
    const name = s.getName().toLowerCase();
    const isExpert = name.includes("expert") || name.includes("juicio") || name.includes("valida");
    const isConfig = name.includes("config");
    if (!isExpert && !isConfig && s.getLastRow() > 1) {
      if (name.includes("encuesta") || name.includes("respuesta") || name.includes("survey") || 
          name.includes("form") || name.includes("hoja 1") || name.includes("sheet1") || name.includes("datos")) {
        return s;
      }
    }
  }

  // Fallback: pestaña con más filas que no sea de expertos o config
  let bestSheet = null;
  let maxRows = 1;
  for (let i = 0; i < allSheets.length; i++) {
    const s = allSheets[i];
    const name = s.getName().toLowerCase();
    const isExpert = name.includes("expert") || name.includes("juicio") || name.includes("valida");
    const isConfig = name.includes("config");
    if (!isExpert && !isConfig && s.getLastRow() > maxRows) {
      maxRows = s.getLastRow();
      bestSheet = s;
    }
  }

  return bestSheet || sheet || allSheets[0];
}

/**
 * Localiza la pestaña de juicio de expertos
 */
function findExpertSheet(ss) {
  let sheet = ss.getSheetByName(SHEETS.EXPERTS);
  if (sheet && sheet.getLastRow() > 1) return sheet;

  const allSheets = ss.getSheets();
  for (let i = 0; i < allSheets.length; i++) {
    const s = allSheets[i];
    const name = s.getName().toLowerCase();
    if ((name.includes("expert") || name.includes("juicio") || name.includes("valida")) && 
        !name.includes("detalle") && !name.includes("item") && s.getLastRow() > 1) {
      return s;
    }
  }
  return sheet || null;
}

/**
 * Procesa y agrega los datos crudos con detección dinámica de columnas y cálculo en tiempo real
 */
function computeDashboardMetrics(ss) {
  const surveySheet = findSurveySheet(ss);
  const expertSheet = findExpertSheet(ss);

  let surveyRows = [];
  const headerMap = {};
  const detectedSheetName = surveySheet ? surveySheet.getName() : "No detectada";

  if (surveySheet && surveySheet.getLastRow() > 1) {
    const lastCol = Math.max(1, surveySheet.getLastColumn());
    const allData = surveySheet.getRange(1, 1, surveySheet.getLastRow(), lastCol).getValues();
    const rawHeaders = allData[0];
    
    // Normalizar encabezados (minúsculas sin espacios ni caracteres especiales)
    rawHeaders.forEach(function(h, idx) {
      if (h !== null && h !== undefined) {
        const norm = String(h).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        if (norm) headerMap[norm] = idx;
      }
    });

    surveyRows = allData.slice(1);
  }

  const totalEncuestados = surveyRows.length;

  // Helper para buscar índice de columna por alias
  function findColIdx(aliases, defaultIdx) {
    for (let i = 0; i < aliases.length; i++) {
      const norm = aliases[i].toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      if (headerMap[norm] !== undefined) return headerMap[norm];
    }
    return defaultIdx;
  }

  // Mapeo dinámico de columnas sociodemográficas
  const colSexo = findColIdx(["sexo", "genero"], 4);
  const colInstruccion = findColIdx(["nivelinstruccion", "instruccion", "educacion", "grado"], 5);
  const colCargo = findColIdx(["cargohcuamp", "cargo", "puesto", "funcion"], 6);
  const colFormacion = findColIdx(["formacionsst3anos", "formacionprevia", "formacionsst", "formacion"], 10);
  const colTipoFormacion = findColIdx(["tipoformacion", "tipo"], 11);

  // Mapeo de columnas de totales y promedios calculados
  const colTotalKnow = findColIdx(["totalconocimientoptos", "totalconocimiento", "scoreconocimiento", "puntajeconocimiento", "puntajetotal", "conocimientototal"], 35);
  const colLevelKnow = findColIdx(["nivelconocimiento", "categoriaconocimiento", "nivel"], 36);
  const colScoreDimA = findColIdx(["scoredimadelegados", "scoredima", "dimadelegados", "delegadosscore"], 37);
  const colScoreDimB = findColIdx(["scoredimbcssl", "scoredimb", "dimbcssl", "csslscore"], 38);
  const colScoreDimC = findColIdx(["scoredimcssst", "scoredimc", "dimcssst", "ssstscore"], 39);
  const colScoreDimD = findColIdx(["scoredimdpsst", "scoredimd", "dimdpsst", "psstscore"], 40);

  const colMediaDimA = findColIdx(["mediadimadelegados", "mediadima", "promediodima"], 61);
  const colMediaDimB = findColIdx(["mediadimbcssl", "mediadimb", "promediodimb"], 62);
  const colMediaDimC = findColIdx(["mediadimcssst", "mediadimc", "promediodimc"], 63);
  const colMediaDimD = findColIdx(["mediadimdpsst", "mediadimd", "promediodimd"], 64);
  const colOverallLikert = findColIdx(["mediageneralnecesidades", "medialikert", "promediolikert", "promedionecesidades", "mediageneral"], 65);
  const colLevelLikert = findColIdx(["nivelnecesidad", "categorianecesidad"], 66);

  // Mapeo de columnas individuales de preguntas (P01 a P20)
  const knowledgeCols = [];
  for (let q = 1; q <= 20; q++) {
    const qStr = q < 10 ? "p0" + q : "p" + q;
    const qAlt = "p" + q;
    knowledgeCols.push(findColIdx([qStr, qAlt, "pregunta" + q, "preg" + q], 14 + q));
  }

  // Mapeo de columnas Likert (L21 a L40)
  const likertCols = [];
  for (let l = 21; l <= 40; l++) {
    const lStr = "l" + l;
    const lAlt = "p" + l;
    const lNum = "l" + (l - 20);
    likertCols.push(findColIdx([lStr, lAlt, lNum, "item" + l, "likert" + l], 20 + l));
  }

  // Variables acumuladoras
  let totalKnowledgeScore = 0;
  let knowledgeLevels = { Bajo: 0, Medio: 0, Alto: 0 };
  let knowledgeDimScores = { dimA: 0, dimB: 0, dimC: 0, dimD: 0 };
  
  let totalLikertMean = 0;
  let likertLevels = { "Baja necesidad": 0, "Moderada necesidad": 0, "Alta necesidad": 0 };
  let likertDimScores = { dimA: 0, dimB: 0, dimC: 0, dimD: 0 };

  const cargos = {};
  const nivelInstruccion = {};
  const sexo = { Femenino: 0, Masculino: 0, Otro: 0 };
  const formacionSST = { "Sí": 0, "No": 0 };
  const tiposFormacion = {};

  surveyRows.forEach(function(row) {
    // 1. Datos Sociodemográficos
    const sx = (colSexo !== -1 && row[colSexo] !== undefined && String(row[colSexo]).trim()) ? String(row[colSexo]).trim() : "No especificado";
    sexo[sx] = (sexo[sx] || 0) + 1;

    const inst = (colInstruccion !== -1 && row[colInstruccion] !== undefined && String(row[colInstruccion]).trim()) ? String(row[colInstruccion]).trim() : "No especificado";
    nivelInstruccion[inst] = (nivelInstruccion[inst] || 0) + 1;

    const cg = (colCargo !== -1 && row[colCargo] !== undefined && String(row[colCargo]).trim()) ? String(row[colCargo]).trim() : "No especificado";
    cargos[cg] = (cargos[cg] || 0) + 1;

    const form = (colFormacion !== -1 && row[colFormacion] !== undefined && String(row[colFormacion]).trim()) ? String(row[colFormacion]).trim() : "No";
    const formNorm = (form.toLowerCase().indexOf("s") === 0 || form.toLowerCase() === "si" || form.toLowerCase() === "sí") ? "Sí" : "No";
    formacionSST[formNorm] = (formacionSST[formNorm] || 0) + 1;

    const tipoF = (colTipoFormacion !== -1 && row[colTipoFormacion] !== undefined && String(row[colTipoFormacion]).trim()) ? String(row[colTipoFormacion]).trim() : "";
    if (tipoF && tipoF !== "N/A" && tipoF !== "Ninguna") {
      tiposFormacion[tipoF] = (tiposFormacion[tipoF] || 0) + 1;
    }

    // 2. Test de Conocimiento: usar total precalculado o calcular al vuelo
    let kScore = 0;
    let kDimA = 0, kDimB = 0, kDimC = 0, kDimD = 0;
    const hasPrecalcScore = (colTotalKnow !== -1 && row[colTotalKnow] !== "" && row[colTotalKnow] !== null && !isNaN(Number(row[colTotalKnow])));

    if (hasPrecalcScore && Number(row[colTotalKnow]) > 0) {
      kScore = Number(row[colTotalKnow]);
      kDimA = Number(row[colScoreDimA]) || 0;
      kDimB = Number(row[colScoreDimB]) || 0;
      kDimC = Number(row[colScoreDimC]) || 0;
      kDimD = Number(row[colScoreDimD]) || 0;
    } else {
      // Cálculo dinámico ítem por ítem con clave metodológica
      for (let i = 0; i < 20; i++) {
        const cIdx = knowledgeCols[i];
        if (cIdx !== -1 && row[cIdx] !== undefined) {
          const val = String(row[cIdx]).trim().toUpperCase();
          const expected = KNOWLEDGE_KEY[i + 1];
          let isCorrect = false;
          if (val === "1" || val === "TRUE" || val === "VERDADERO" || val === "SÍ" || val === "SI") {
            isCorrect = true;
          } else if (val === expected || val.indexOf(expected + ")") === 0 || val.indexOf(expected + ".") === 0 || val.indexOf(expected + " ") === 0) {
            isCorrect = true;
          }
          if (isCorrect) {
            kScore += 1;
            if (i < 5) kDimA += 1;
            else if (i < 10) kDimB += 1;
            else if (i < 15) kDimC += 1;
            else kDimD += 1;
          }
        }
      }
    }

    totalKnowledgeScore += kScore;
    let kLevel = "Bajo";
    if (kScore >= 16) kLevel = "Alto";
    else if (kScore >= 11) kLevel = "Medio";
    knowledgeLevels[kLevel] = (knowledgeLevels[kLevel] || 0) + 1;

    knowledgeDimScores.dimA += kDimA;
    knowledgeDimScores.dimB += kDimB;
    knowledgeDimScores.dimC += kDimC;
    knowledgeDimScores.dimD += kDimD;

    // 3. Escala Likert de Necesidades: usar total precalculado o promediar al vuelo
    let lMean = 0;
    let lDimA = 0, lDimB = 0, lDimC = 0, lDimD = 0;
    const hasPrecalcLikert = (colOverallLikert !== -1 && row[colOverallLikert] !== "" && row[colOverallLikert] !== null && !isNaN(Number(row[colOverallLikert])));

    if (hasPrecalcLikert && Number(row[colOverallLikert]) > 0) {
      lMean = Number(row[colOverallLikert]);
      lDimA = Number(row[colMediaDimA]) || 0;
      lDimB = Number(row[colMediaDimB]) || 0;
      lDimC = Number(row[colMediaDimC]) || 0;
      lDimD = Number(row[colMediaDimD]) || 0;
    } else {
      let sumAll = 0, countAll = 0;
      let sumA = 0, countA = 0;
      let sumB = 0, countB = 0;
      let sumC = 0, countC = 0;
      let sumD = 0, countD = 0;

      for (let i = 0; i < 20; i++) {
        const cIdx = likertCols[i];
        if (cIdx !== -1 && row[cIdx] !== undefined) {
          const numVal = parseFloat(String(row[cIdx]).replace(/[^0-9.]/g, ''));
          if (!isNaN(numVal) && numVal >= 1 && numVal <= 5) {
            sumAll += numVal;
            countAll++;
            if (i < 5) { sumA += numVal; countA++; }
            else if (i < 10) { sumB += numVal; countB++; }
            else if (i < 15) { sumC += numVal; countC++; }
            else { sumD += numVal; countD++; }
          }
        }
      }

      lMean = countAll > 0 ? (sumAll / countAll) : 0;
      lDimA = countA > 0 ? (sumA / countA) : 0;
      lDimB = countB > 0 ? (sumB / countB) : 0;
      lDimC = countC > 0 ? (sumC / countC) : 0;
      lDimD = countD > 0 ? (sumD / countD) : 0;
    }

    totalLikertMean += lMean;
    let lLevel = "Moderada necesidad";
    if (lMean > 3.50) lLevel = "Alta necesidad";
    else if (lMean <= 2.50) lLevel = "Baja necesidad";
    likertLevels[lLevel] = (likertLevels[lLevel] || 0) + 1;

    likertDimScores.dimA += lDimA;
    likertDimScores.dimB += lDimB;
    likertDimScores.dimC += lDimC;
    likertDimScores.dimD += lDimD;
  });

  const avgKnowledge = totalEncuestados > 0 ? (totalKnowledgeScore / totalEncuestados).toFixed(2) : "0.00";
  const avgLikert = totalEncuestados > 0 ? (totalLikertMean / totalEncuestados).toFixed(2) : "0.00";

  const avgKnowledgeDims = {
    dimA: totalEncuestados > 0 ? (knowledgeDimScores.dimA / totalEncuestados).toFixed(2) : "0.00",
    dimB: totalEncuestados > 0 ? (knowledgeDimScores.dimB / totalEncuestados).toFixed(2) : "0.00",
    dimC: totalEncuestados > 0 ? (knowledgeDimScores.dimC / totalEncuestados).toFixed(2) : "0.00",
    dimD: totalEncuestados > 0 ? (knowledgeDimScores.dimD / totalEncuestados).toFixed(2) : "0.00"
  };

  const avgLikertDims = {
    dimA: totalEncuestados > 0 ? (likertDimScores.dimA / totalEncuestados).toFixed(2) : "0.00",
    dimB: totalEncuestados > 0 ? (likertDimScores.dimB / totalEncuestados).toFixed(2) : "0.00",
    dimC: totalEncuestados > 0 ? (likertDimScores.dimC / totalEncuestados).toFixed(2) : "0.00",
    dimD: totalEncuestados > 0 ? (likertDimScores.dimD / totalEncuestados).toFixed(2) : "0.00"
  };

  // 2. Estadísticas de Juicio de Expertos con mapeo flexible
  let expertRows = [];
  const expertHeaderMap = {};
  if (expertSheet && expertSheet.getLastRow() > 1) {
    const lastColExp = Math.max(1, expertSheet.getLastColumn());
    const allExpData = expertSheet.getRange(1, 1, expertSheet.getLastRow(), lastColExp).getValues();
    allExpData[0].forEach(function(h, idx) {
      if (h !== null && h !== undefined) {
        const norm = String(h).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        if (norm) expertHeaderMap[norm] = idx;
      }
    });
    expertRows = allExpData.slice(1);
  }

  function findExpColIdx(aliases, defaultIdx) {
    for (let i = 0; i < aliases.length; i++) {
      const norm = aliases[i].toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      if (expertHeaderMap[norm] !== undefined) return expertHeaderMap[norm];
    }
    return defaultIdx;
  }

  const colExpClaridad = findExpColIdx(["porcclaridad", "claridad", "totalclaridadsi"], 12);
  const colExpPertinencia = findExpColIdx(["porcpertinencia", "pertinencia", "totalpertinenciasi"], 14);
  const colExpCoherencia = findExpColIdx(["porccoherencia", "coherencia", "totalcoherenciasi"], 16);
  const colExpDictamen = findExpColIdx(["dictamenfinal", "dictamen", "resultado"], 17);

  const totalExpertos = expertRows.length;
  const dictamenes = {
    "Aprobado sin modificaciones": 0,
    "Aprobado con observaciones": 0,
    "No Aprobado": 0
  };
  let sumClaridad = 0;
  let sumPertinencia = 0;
  let sumCoherencia = 0;

  expertRows.forEach(function(row) {
    const cl = parseFloat(String(row[colExpClaridad] || "").replace(/[^0-9.]/g, "")) || 0;
    const pt = parseFloat(String(row[colExpPertinencia] || "").replace(/[^0-9.]/g, "")) || 0;
    const ch = parseFloat(String(row[colExpCoherencia] || "").replace(/[^0-9.]/g, "")) || 0;
    sumClaridad += cl;
    sumPertinencia += pt;
    sumCoherencia += ch;

    const dict = (colExpDictamen !== -1 && row[colExpDictamen]) ? String(row[colExpDictamen]).trim() : "Aprobado con observaciones";
    if (dictamenes[dict] !== undefined) dictamenes[dict]++;
    else dictamenes["Aprobado con observaciones"]++;
  });

  const avgClaridad = totalExpertos > 0 ? (sumClaridad / totalExpertos).toFixed(1) : "0.0";
  const avgPertinencia = totalExpertos > 0 ? (sumPertinencia / totalExpertos).toFixed(1) : "0.0";
  const avgCoherencia = totalExpertos > 0 ? (sumCoherencia / totalExpertos).toFixed(1) : "0.0";

  return {
    summary: {
      totalEncuestados: totalEncuestados,
      avgKnowledgeScore: avgKnowledge,
      avgLikertScore: avgLikert,
      totalExpertos: totalExpertos,
      sheetDetected: detectedSheetName,
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
 * Helper para generar respuesta JSON con cabeceras estándar
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
