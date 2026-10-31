/**
 * MÓDULO 1: RECOLECCIÓN DE DATOS (ENCUESTA AL PERSONAL)
 * Manejo de pasos, validación en cliente, cálculo de baremos e integración con API GAS
 */

const SurveyModule = {
  currentStep: 1,
  totalSteps: 5,
  state: {
    consentAccepted: false,
    sociodemographic: {
      edad: null,
      sexo: "",
      nivelInstruccion: "",
      cargo: "",
      experienciaAnos: null,
      condicionLaboral: "",
      supervisadosAprox: null,
      formacionPrevia: "",
      tipoFormacion: "",
      miembroCSSL: "",
      participoElecciones: "",
      turno: ""
    },
    knowledgeAnswers: {}, // { P01: 'A', P02: 'C', ... }
    knowledgeScores: {
      totalScore: 0,
      level: "Bajo",
      dimA: 0,
      dimB: 0,
      dimC: 0,
      dimD: 0
    },
    likertAnswers: {}, // { L21: 4, L22: 5, ... }
    likertStats: {
      dimA: 0,
      dimB: 0,
      dimC: 0,
      dimD: 0,
      overallMean: 0,
      level: "Baja necesidad"
    }
  },

  init() {
    this.renderKnowledgeQuestions();
    this.renderLikertQuestions();
    this.bindEvents();
    this.loadDraft();
    this.updateStepUI();
  },

  bindEvents() {
    // Checkbox consentimiento
    const consentCb = document.getElementById("consent-checkbox");
    if (consentCb) {
      consentCb.addEventListener("change", (e) => {
        this.state.consentAccepted = e.target.checked;
        const btnNext = document.getElementById("btn-step1-next");
        if (btnNext) {
          btnNext.disabled = !e.target.checked;
          btnNext.classList.toggle("opacity-50", !e.target.checked);
          btnNext.classList.toggle("cursor-not-allowed", !e.target.checked);
        }
      });
    }

    // Condicional Formación SST (Pregunta 8 -> Pregunta 9)
    const radiosFormacion = document.querySelectorAll('input[name="socio_formacion"]');
    const containerTipoFormacion = document.getElementById("socio-tipo-formacion-group");
    radiosFormacion.forEach(r => {
      r.addEventListener("change", (e) => {
        const value = e.target.value;
        this.state.sociodemographic.formacionPrevia = value;
        if (containerTipoFormacion) {
          if (value === "Sí") {
            containerTipoFormacion.classList.remove("hidden");
          } else {
            containerTipoFormacion.classList.add("hidden");
            this.state.sociodemographic.tipoFormacion = "N/A";
            const checkedTipo = document.querySelector('input[name="socio_tipo_formacion"]:checked');
            if (checkedTipo) checkedTipo.checked = false;
          }
        }
      });
    });

    // Guardado automático en draft al interactuar
    window.addEventListener("beforeunload", () => {
      this.saveDraft();
    });
  },

  renderKnowledgeQuestions() {
    const container = document.getElementById("knowledge-questions-list");
    if (!container) return;

    let currentDimension = "";
    let html = "";

    // Diccionario de tooltips informativos por dimensión
    const dimensionTooltips = {
      A: "Los Delegados de Prevención son representantes electos de los trabajadores encargados de la consulta y fiscalización de condiciones de trabajo (Art. 41 LOPCYMAT).",
      B: "El Comité de Seguridad y Salud Laboral (CSSL) es un órgano paritario y colegiado para la consulta y control de políticas de SST (Art. 46 LOPCYMAT).",
      C: "El Servicio de Seguridad y Salud en el Trabajo (SSST) es una estructura técnica multidisciplinaria de carácter obligatorio para el hospital (Art. 39 LOPCYMAT).",
      D: "El Programa de Seguridad y Salud en el Trabajo (PSST) es el instrumento técnico obligatorio elaborado según Norma Técnica NT-01-2008 de INPSASEL."
    };

    KNOWLEDGE_QUESTIONS.forEach((q, idx) => {
      if (q.dimension !== currentDimension) {
        currentDimension = q.dimension;
        const tip = dimensionTooltips[q.dimension] || "";
        html += `
          <div class="pt-6 pb-2 border-b border-slate-200 mb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs border border-sky-200 shadow-sm">
                  Dim ${q.dimension}
                </span>
                <h4 class="text-base font-bold text-slate-900">${q.dimensionName}</h4>
              </div>
              <span class="tooltip-trigger">
                <span class="help-icon" title="Información técnica">?</span>
                <span class="tooltip-bubble">${tip}</span>
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Componente técnico y legal sobre la gestión institucional en el HCUAMP.</p>
          </div>
        `;
      }

      html += `
        <div class="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-4 shadow-sm hover:border-sky-400 hover:shadow-md transition-all duration-200" id="q-card-${q.id}">
          <div class="flex items-start gap-3">
            <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-50 text-sky-700 border border-sky-200 flex-shrink-0">
              #${q.id}
            </span>
            <div class="flex-1">
              <p class="text-sm sm:text-base font-semibold text-slate-800 leading-snug">${q.question}</p>
              
              <div class="grid grid-cols-1 gap-2.5 mt-3.5">
                ${q.options.map(opt => `
                  <label class="flex items-center p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-sky-50 hover:border-sky-300 cursor-pointer transition-all option-label group">
                    <input type="radio" 
                           name="k_question_${q.id}" 
                           value="${opt.key}" 
                           class="w-4 h-4 text-sky-600 bg-white border-slate-300 focus:ring-sky-500"
                           onchange="SurveyModule.onKnowledgeAnswer(${q.id}, '${opt.key}')">
                    <span class="ml-3 text-xs sm:text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                      <strong class="text-sky-600 mr-1 font-bold">${opt.key})</strong> ${opt.text}
                    </span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  renderLikertQuestions() {
    const container = document.getElementById("likert-questions-list");
    if (!container) return;

    let currentDimension = "";
    let html = "";

    const likertTooltips = {
      A: "Evaluación de la necesidad formativa en torno a la actuación, elección y límites legales de los Delegados de Prevención.",
      B: "Evaluación de la necesidad formativa respecto al funcionamiento del Comité paritario (CSSL) y redacción técnica de actas.",
      C: "Evaluación sobre infraestructura, perfiles multidisciplinarios y vigilancia epidemiológica hospitalaria del SSST.",
      D: "Evaluación de necesidades sobre análisis de procesos peligrosos, planes de contingencia y llenado de formatos NT-04-2023."
    };

    LIKERT_ITEMS.forEach((item) => {
      if (item.dimension !== currentDimension) {
        currentDimension = item.dimension;
        const tip = likertTooltips[item.dimension] || "";
        html += `
          <div class="pt-6 pb-2 border-b border-slate-200 mb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-200 shadow-sm">
                  Dim ${item.dimension}
                </span>
                <h4 class="text-base font-bold text-slate-900">${item.dimensionName}</h4>
              </div>
              <span class="tooltip-trigger">
                <span class="help-icon" title="Criterio de la dimensión">?</span>
                <span class="tooltip-bubble">${tip}</span>
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Califique la prioridad de formación percibida para el desempeño gerencial en esta área.</p>
          </div>
        `;
      }

      html += `
        <div class="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-4 shadow-sm hover:border-teal-400 hover:shadow-md transition-all duration-200" id="l-card-${item.id}">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-start gap-3 flex-1">
              <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex-shrink-0">
                Ítem ${item.id}
              </span>
              <p class="text-sm font-semibold text-slate-800 leading-snug">${item.text}</p>
            </div>

            <!-- Radio scale 1 to 5 -->
            <div class="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
              ${LIKERT_OPTIONS.map(opt => `
                <label class="flex flex-col items-center cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition-all group text-center" title="${opt.label}">
                  <input type="radio" 
                         name="l_item_${item.id}" 
                         value="${opt.value}" 
                         class="w-4 h-4 text-teal-600 bg-white border-slate-300 focus:ring-teal-500"
                         onchange="SurveyModule.onLikertAnswer(${item.id}, ${opt.value})">
                  <span class="text-xs font-bold text-slate-700 group-hover:text-teal-700 mt-1">${opt.value}</span>
                  <span class="text-[9px] text-slate-500 hidden sm:inline-block max-w-[55px] leading-tight truncate">${opt.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  onKnowledgeAnswer(questionId, selectedKey) {
    const formattedId = "P" + String(questionId).padStart(2, "0");
    this.state.knowledgeAnswers[formattedId] = selectedKey;

    // Recalcular puntuación en tiempo real
    this.computeKnowledgeScore();
    this.updateKnowledgeSummaryBar();
  },

  computeKnowledgeScore() {
    let total = 0;
    let dimScores = { A: 0, B: 0, C: 0, D: 0 };

    KNOWLEDGE_QUESTIONS.forEach(q => {
      const formattedId = "P" + String(q.id).padStart(2, "0");
      const answer = this.state.knowledgeAnswers[formattedId];
      if (answer && answer === q.correctAnswer) {
        total += 1;
        dimScores[q.dimension] += 1;
      }
    });

    const category = SCORING.getKnowledgeCategory(total);

    this.state.knowledgeScores = {
      totalScore: total,
      level: category.level,
      dimA: dimScores.A,
      dimB: dimScores.B,
      dimC: dimScores.C,
      dimD: dimScores.D
    };
  },

  updateKnowledgeSummaryBar() {
    const count = Object.keys(this.state.knowledgeAnswers).length;
    const countEl = document.getElementById("k-answered-count");
    const scoreEl = document.getElementById("k-live-score");
    const badgeEl = document.getElementById("k-live-badge");

    if (countEl) countEl.innerText = `${count} / ${KNOWLEDGE_QUESTIONS.length}`;
    if (scoreEl) scoreEl.innerText = `${this.state.knowledgeScores.totalScore} pts`;
    if (badgeEl) {
      const cat = SCORING.getKnowledgeCategory(this.state.knowledgeScores.totalScore);
      badgeEl.className = `px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cat.badgeClass}`;
      badgeEl.innerText = cat.level;
    }
  },

  onLikertAnswer(itemId, value) {
    const formattedId = "L" + String(itemId).padStart(2, "0");
    this.state.likertAnswers[formattedId] = Number(value);

    // Recalcular medias en tiempo real
    this.computeLikertStats();
    this.updateLikertSummaryBar();
  },

  computeLikertStats() {
    const dims = { A: [], B: [], C: [], D: [] };
    const allVals = [];

    LIKERT_ITEMS.forEach(it => {
      const formattedId = "L" + String(it.id).padStart(2, "0");
      const val = this.state.likertAnswers[formattedId];
      if (val !== undefined) {
        dims[it.dimension].push(val);
        allVals.push(val);
      }
    });

    const calcMean = (arr) => arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 0;

    const meanA = calcMean(dims.A);
    const meanB = calcMean(dims.B);
    const meanC = calcMean(dims.C);
    const meanD = calcMean(dims.D);
    const overallMean = calcMean(allVals);

    const category = SCORING.getLikertCategory(overallMean);

    this.state.likertStats = {
      dimA: Number(meanA),
      dimB: Number(meanB),
      dimC: Number(meanC),
      dimD: Number(meanD),
      overallMean: Number(overallMean),
      level: category.level
    };
  },

  updateLikertSummaryBar() {
    const count = Object.keys(this.state.likertAnswers).length;
    const countEl = document.getElementById("l-answered-count");
    const meanEl = document.getElementById("l-live-mean");
    const badgeEl = document.getElementById("l-live-badge");

    if (countEl) countEl.innerText = `${count} / ${LIKERT_ITEMS.length}`;
    if (meanEl) meanEl.innerText = `${this.state.likertStats.overallMean.toFixed(2)} / 5.00`;
    if (badgeEl) {
      const cat = SCORING.getLikertCategory(this.state.likertStats.overallMean);
      badgeEl.className = `px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cat.badgeClass}`;
      badgeEl.innerText = cat.level;
    }
  },

  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;

    // Validación antes de avanzar
    if (stepNumber > this.currentStep) {
      const isValid = this.validateCurrentStep();
      if (!isValid) return;
    }

    this.currentStep = stepNumber;
    this.updateStepUI();

    if (this.currentStep === 5) {
      this.renderReviewSummary();
    }

    // Scroll suave a la cabecera del módulo
    const header = document.getElementById("survey-module-container");
    if (header) {
      header.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  validateCurrentStep() {
    if (this.currentStep === 1) {
      if (!this.state.consentAccepted) {
        UI.showToast("Debe aceptar el Consentimiento Informado para participar en la investigación.", "warning");
        return false;
      }
      return true;
    }

    if (this.currentStep === 2) {
      // Recolectar campos sociodemográficos
      const edad = document.getElementById("socio_edad").value;
      const sexo = document.querySelector('input[name="socio_sexo"]:checked')?.value;
      const instruccion = document.getElementById("socio_instruccion").value;
      const cargo = document.getElementById("socio_cargo").value;
      const experiencia = document.getElementById("socio_experiencia").value;
      const condicion = document.querySelector('input[name="socio_condicion"]:checked')?.value;
      const supervisados = document.getElementById("socio_supervisados").value;
      const formacion = document.querySelector('input[name="socio_formacion"]:checked')?.value;
      const miembroCSSL = document.querySelector('input[name="socio_cssl"]:checked')?.value;
      const elecciones = document.querySelector('input[name="socio_elecciones"]:checked')?.value;
      const turno = document.querySelector('input[name="socio_turno"]:checked')?.value;

      let tipoFormacion = "N/A";
      if (formacion === "Sí") {
        tipoFormacion = document.querySelector('input[name="socio_tipo_formacion"]:checked')?.value;
        if (!tipoFormacion) {
          UI.showToast("Por favor especifique el tipo de formación recibida.", "warning");
          return false;
        }
      }

      if (!edad || !sexo || !instruccion || !cargo || !experiencia || !condicion || !supervisados || !formacion || !miembroCSSL || !elecciones || !turno) {
        UI.showToast("Por favor complete todos los campos sociodemográficos obligatorios.", "warning");
        return false;
      }

      if (Number(edad) < 18 || Number(edad) > 85) {
        UI.showToast("Por favor ingrese una edad válida.", "warning");
        return false;
      }

      this.state.sociodemographic = {
        edad: Number(edad),
        sexo,
        nivelInstruccion: instruccion,
        cargo,
        experienciaAnos: Number(experiencia),
        condicionLaboral: condicion,
        supervisadosAprox: Number(supervisados),
        formacionPrevia: formacion,
        tipoFormacion,
        miembroCSSL,
        participoElecciones: elecciones,
        turno
      };

      return true;
    }

    if (this.currentStep === 3) {
      const answeredCount = Object.keys(this.state.knowledgeAnswers).length;
      if (answeredCount < KNOWLEDGE_QUESTIONS.length) {
        UI.showToast(`Ha respondido ${answeredCount} de las ${KNOWLEDGE_QUESTIONS.length} preguntas del test de conocimiento. Debe completarlas todas.`, "warning");
        return false;
      }
      return true;
    }

    if (this.currentStep === 4) {
      const answeredCount = Object.keys(this.state.likertAnswers).length;
      if (answeredCount < LIKERT_ITEMS.length) {
        UI.showToast(`Ha calificado ${answeredCount} de los ${LIKERT_ITEMS.length} ítems de la escala de necesidades. Debe completarlos todos.`, "warning");
        return false;
      }
      return true;
    }

    return true;
  },

  updateStepUI() {
    // Ocultar todos los paneles de paso
    for (let i = 1; i <= this.totalSteps; i++) {
      const panel = document.getElementById(`survey-step-${i}`);
      const stepIndicator = document.getElementById(`step-indicator-${i}`);
      if (panel) {
        panel.classList.toggle("hidden", i !== this.currentStep);
      }
      if (stepIndicator) {
        if (i < this.currentStep) {
          stepIndicator.className = "flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs ring-4 ring-emerald-100 shadow-sm";
          stepIndicator.innerHTML = "✓";
        } else if (i === this.currentStep) {
          stepIndicator.className = "flex items-center justify-center w-8 h-8 rounded-full bg-sky-600 text-white font-bold text-xs ring-4 ring-sky-100 shadow-sm";
          stepIndicator.innerHTML = String(i);
        } else {
          stepIndicator.className = "flex items-center justify-center w-8 h-8 rounded-full bg-white text-slate-500 font-bold text-xs border border-slate-300 shadow-sm";
          stepIndicator.innerHTML = String(i);
        }
      }
    }

    // Actualizar barra de progreso visual
    const progressBar = document.getElementById("survey-progress-bar");
    if (progressBar) {
      const percent = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
      progressBar.style.width = `${percent}%`;
    }
  },

  renderReviewSummary() {
    const container = document.getElementById("survey-summary-review");
    if (!container) return;

    const socio = this.state.sociodemographic;
    const kScore = this.state.knowledgeScores;
    const lStats = this.state.likertStats;
    const kCat = SCORING.getKnowledgeCategory(kScore.totalScore);
    const lCat = SCORING.getLikertCategory(lStats.overallMean);

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <!-- Ficha Sociodemográfica -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 class="text-xs font-bold tracking-wider text-slate-600 uppercase mb-3.5 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Datos Sociodemográficos y Laborales
          </h4>
          <dl class="space-y-2.5 text-xs sm:text-sm">
            <div class="flex justify-between border-b border-slate-100 pb-1.5"><dt class="text-slate-500">Cargo HCUAMP:</dt><dd class="font-semibold text-slate-800">${socio.cargo}</dd></div>
            <div class="flex justify-between border-b border-slate-100 pb-1.5"><dt class="text-slate-500">Edad y Sexo:</dt><dd class="font-semibold text-slate-800">${socio.edad} años | ${socio.sexo}</dd></div>
            <div class="flex justify-between border-b border-slate-100 pb-1.5"><dt class="text-slate-500">Nivel Instrucción:</dt><dd class="font-semibold text-slate-800">${socio.nivelInstruccion}</dd></div>
            <div class="flex justify-between border-b border-slate-100 pb-1.5"><dt class="text-slate-500">Experiencia Supervisión:</dt><dd class="font-semibold text-slate-800">${socio.experienciaAnos} años</dd></div>
            <div class="flex justify-between border-b border-slate-100 pb-1.5"><dt class="text-slate-500">Condición Laboral:</dt><dd class="font-semibold text-slate-800">${socio.condicionLaboral}</dd></div>
            <div class="flex justify-between border-b border-slate-100 pb-1.5"><dt class="text-slate-500">Personal a cargo:</dt><dd class="font-semibold text-slate-800">~${socio.supervisadosAprox} personas</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Capacitación SST previa:</dt><dd class="font-semibold text-slate-800">${socio.formacionPrevia} ${socio.tipoFormacion !== 'N/A' ? `(${socio.tipoFormacion})` : ''}</dd></div>
          </dl>
        </div>

        <!-- Ficha de Diagnóstico Obtenido -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 class="text-xs font-bold tracking-wider text-slate-600 uppercase mb-3.5 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Diagnóstico Cuantitativo Obtenido
            </h4>
            
            <!-- Diagnóstico de Conocimiento -->
            <div class="p-3.5 bg-sky-50/70 rounded-xl border border-sky-100 mb-3">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs text-slate-700 font-semibold">Nivel de Conocimiento (LOPCYMAT):</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border ${kCat.badgeClass}">${kCat.level}</span>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-extrabold text-slate-900">${kScore.totalScore}</span>
                <span class="text-xs text-slate-500">de 20 puntos posibles</span>
              </div>
              <div class="grid grid-cols-4 gap-1.5 text-[11px] text-slate-600 mt-2.5 text-center font-medium">
                <div class="bg-white p-1 rounded border border-slate-200">Dim A: ${kScore.dimA}/5</div>
                <div class="bg-white p-1 rounded border border-slate-200">Dim B: ${kScore.dimB}/5</div>
                <div class="bg-white p-1 rounded border border-slate-200">Dim C: ${kScore.dimC}/5</div>
                <div class="bg-white p-1 rounded border border-slate-200">Dim D: ${kScore.dimD}/5</div>
              </div>
            </div>

            <!-- Diagnóstico de Necesidades -->
            <div class="p-3.5 bg-teal-50/70 rounded-xl border border-teal-100">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs text-slate-700 font-semibold">Necesidades de Formación (Likert):</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border ${lCat.badgeClass}">${lCat.level}</span>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-extrabold text-slate-900">${lStats.overallMean.toFixed(2)}</span>
                <span class="text-xs text-slate-500">media global (escala 1-5)</span>
              </div>
              <div class="grid grid-cols-4 gap-1.5 text-[11px] text-slate-600 mt-2.5 text-center font-medium">
                <div class="bg-white p-1 rounded border border-slate-200">Dim A: ${lStats.dimA.toFixed(1)}</div>
                <div class="bg-white p-1 rounded border border-slate-200">Dim B: ${lStats.dimB.toFixed(1)}</div>
                <div class="bg-white p-1 rounded border border-slate-200">Dim C: ${lStats.dimC.toFixed(1)}</div>
                <div class="bg-white p-1 rounded border border-slate-200">Dim D: ${lStats.dimD.toFixed(1)}</div>
              </div>
            </div>
          </div>

          <p class="text-[11px] text-slate-500 italic mt-3 text-center">
            Investigadora: <strong>Lcda. María Pargas</strong> • Al confirmar, sus datos serán registrados confidencialmente en el repositorio institucional.
          </p>
        </div>
      </div>
    `;
  },

  async submitSurvey() {
    const btnSubmit = document.getElementById("btn-submit-survey");
    const originalText = btnSubmit ? btnSubmit.innerHTML : "Enviar";

    try {
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Guardando en Base de Datos...
        `;
      }

      const payload = {
        action: "submit_survey",
        consentAccepted: this.state.consentAccepted,
        sociodemographic: this.state.sociodemographic,
        knowledgeAnswers: this.state.knowledgeAnswers,
        knowledgeScore: this.state.knowledgeScores,
        likertAnswers: this.state.likertAnswers,
        likertStats: this.state.likertStats
      };

      const gasUrl = UI.getGasUrl();

      // Si la URL del servidor no está configurada, mostramos simulación exitosa
      if (!gasUrl) {
        await new Promise(r => setTimeout(r, 1200)); // Simula latencia de red
        const simulatedId = "ENC-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-SIM" + Math.floor(Math.random() * 900 + 100);
        this.showSuccessModal(simulatedId, true);
        this.clearDraft();
        return;
      }

      // Envío al servidor de aplicaciones
      const response = await fetch(gasUrl, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === "success") {
        this.showSuccessModal(result.idRegistro || "REGISTRADO", false);
        this.clearDraft();
      } else {
        throw new Error(result.message || "Error procesando la solicitud en el servidor.");
      }

    } catch (err) {
      console.error("Error al enviar encuesta:", err);
      UI.showToast("Error de conexión al enviar. Verifique su conexión o endpoint del servidor.", "error");
      const confirmDemo = confirm("No se pudo conectar con el servidor central. ¿Desea registrar el comprobante localmente como demostración académica?");
      if (confirmDemo) {
        const simulatedId = "ENC-OFFLINE-" + Math.floor(Math.random() * 9000 + 1000);
        this.showSuccessModal(simulatedId, true);
      }
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
      }
    }
  },

  showSuccessModal(idRegistro, isDemo = false) {
    const modal = document.getElementById("success-modal");
    const codeEl = document.getElementById("success-record-code");
    const messageEl = document.getElementById("success-modal-message");

    if (codeEl) codeEl.innerText = idRegistro;
    if (messageEl) {
      if (isDemo) {
        messageEl.innerText = "¡Instrumento completado exitosamente! (Modo Demostración Local: configure la URL del Servidor Central en Ajustes para sincronización remota).";
      } else {
        messageEl.innerText = "¡Instrumento registrado y consolidado exitosamente en la base de datos institucional de investigación del HCUAMP!";
      }
    }

    if (modal) {
      modal.classList.remove("hidden");
    }
  },

  closeSuccessModal() {
    const modal = document.getElementById("success-modal");
    if (modal) modal.classList.add("hidden");
    // Reiniciar encuesta
    window.location.reload();
  },

  saveDraft() {
    try {
      localStorage.setItem(APP_CONFIG.storageKeySurveyDraft, JSON.stringify(this.state));
    } catch (e) {
      // Ignorar errores de storage
    }
  },

  loadDraft() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.storageKeySurveyDraft);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.consentAccepted) {
          this.state = parsed;
          const consentCb = document.getElementById("consent-checkbox");
          if (consentCb) {
            consentCb.checked = true;
            consentCb.dispatchEvent(new Event("change"));
          }
          // Restaurar respuestas en UI
          this.restoreFormFields();
        }
      }
    } catch (e) {
      console.warn("No se pudo cargar el borrador:", e);
    }
  },

  restoreFormFields() {
    // Sociodemográfico
    const s = this.state.sociodemographic;
    if (s.edad) document.getElementById("socio_edad").value = s.edad;
    if (s.experienciaAnos) document.getElementById("socio_experiencia").value = s.experienciaAnos;
    if (s.supervisadosAprox) document.getElementById("socio_supervisados").value = s.supervisadosAprox;
    if (s.nivelInstruccion) document.getElementById("socio_instruccion").value = s.nivelInstruccion;
    if (s.cargo) document.getElementById("socio_cargo").value = s.cargo;

    if (s.sexo) {
      const r = document.querySelector(`input[name="socio_sexo"][value="${s.sexo}"]`);
      if (r) r.checked = true;
    }
    if (s.condicionLaboral) {
      const r = document.querySelector(`input[name="socio_condicion"][value="${s.condicionLaboral}"]`);
      if (r) r.checked = true;
    }
    if (s.formacionPrevia) {
      const r = document.querySelector(`input[name="socio_formacion"][value="${s.formacionPrevia}"]`);
      if (r) {
        r.checked = true;
        r.dispatchEvent(new Event("change"));
      }
    }
    if (s.tipoFormacion && s.tipoFormacion !== "N/A") {
      const r = document.querySelector(`input[name="socio_tipo_formacion"][value="${s.tipoFormacion}"]`);
      if (r) r.checked = true;
    }
    if (s.miembroCSSL) {
      const r = document.querySelector(`input[name="socio_cssl"][value="${s.miembroCSSL}"]`);
      if (r) r.checked = true;
    }
    if (s.participoElecciones) {
      const r = document.querySelector(`input[name="socio_elecciones"][value="${s.participoElecciones}"]`);
      if (r) r.checked = true;
    }
    if (s.turno) {
      const r = document.querySelector(`input[name="socio_turno"][value="${s.turno}"]`);
      if (r) r.checked = true;
    }

    // Knowledge answers
    Object.keys(this.state.knowledgeAnswers).forEach(key => {
      const qId = parseInt(key.replace("P", ""), 10);
      const val = this.state.knowledgeAnswers[key];
      const radio = document.querySelector(`input[name="k_question_${qId}"][value="${val}"]`);
      if (radio) radio.checked = true;
    });
    this.computeKnowledgeScore();
    this.updateKnowledgeSummaryBar();

    // Likert answers
    Object.keys(this.state.likertAnswers).forEach(key => {
      const itemId = parseInt(key.replace("L", ""), 10);
      const val = this.state.likertAnswers[key];
      const radio = document.querySelector(`input[name="l_item_${itemId}"][value="${val}"]`);
      if (radio) radio.checked = true;
    });
    this.computeLikertStats();
    this.updateLikertSummaryBar();
  },

  clearDraft() {
    try {
      localStorage.removeItem(APP_CONFIG.storageKeySurveyDraft);
    } catch (e) {}
  }
};
