/**
 * MÓDULO 2: VALIDACIÓN POR JUICIO DE EXPERTOS
 * Interfaz exclusiva para metodólogos y especialistas en salud ocupacional
 * Matriz interactiva de 40 ítems (Claridad, Pertinencia, Coherencia) y dictamen final
 */

const ExpertModule = {
  filter: "all", // all | part2 | part3 | with_obs
  evaluations: {}, // { 1: { claridad: true, pertinencia: true, coherencia: true, observaciones: "" }, ... }
  expertData: {
    nombresApellidos: "",
    cedula: "",
    telefono: "",
    profesion: "",
    especialidadGrado: "",
    institucion: "",
    cargo: "",
    experienciaAnos: null
  },
  dictamenFinal: "",
  comentarioGeneral: "",

  init() {
    this.initDefaultEvaluations();
    this.renderMatrix();
    this.bindEvents();
    this.updateLiveStats();
  },

  initDefaultEvaluations() {
    EXPERT_EVALUATION_ITEMS.forEach(it => {
      if (!this.evaluations[it.id]) {
        this.evaluations[it.id] = {
          claridad: true,
          pertinencia: true,
          coherencia: true,
          observaciones: ""
        };
      }
    });
  },

  bindEvents() {
    // Escuchar dictamen final
    const dictamenRadios = document.querySelectorAll('input[name="expert_dictamen"]');
    dictamenRadios.forEach(r => {
      r.addEventListener("change", (e) => {
        this.dictamenFinal = e.target.value;
      });
    });
  },

  setFilter(filterName) {
    this.filter = filterName;
    
    // Actualizar estilo botones de filtro
    const buttons = document.querySelectorAll(".expert-filter-btn");
    buttons.forEach(btn => {
      const active = btn.dataset.filter === filterName;
      btn.classList.toggle("bg-sky-600", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("bg-slate-800/80", !active);
      btn.classList.toggle("text-slate-300", !active);
    });

    this.renderMatrix();
  },

  markAll(value = true) {
    EXPERT_EVALUATION_ITEMS.forEach(it => {
      this.evaluations[it.id].claridad = value;
      this.evaluations[it.id].pertinencia = value;
      this.evaluations[it.id].coherencia = value;
    });

    this.renderMatrix();
    this.updateLiveStats();
    UI.showToast(value ? "Se han marcado todos los criterios como 'SÍ' (Aprobados)." : "Se han desmarcado todos los criterios.", "info");
  },

  renderMatrix() {
    const tbody = document.getElementById("expert-matrix-tbody");
    if (!tbody) return;

    let itemsToRender = EXPERT_EVALUATION_ITEMS;

    if (this.filter === "part2") {
      itemsToRender = EXPERT_EVALUATION_ITEMS.filter(it => it.id <= 20);
    } else if (this.filter === "part3") {
      itemsToRender = EXPERT_EVALUATION_ITEMS.filter(it => it.id > 20);
    } else if (this.filter === "with_obs") {
      itemsToRender = EXPERT_EVALUATION_ITEMS.filter(it => {
        const ev = this.evaluations[it.id];
        return !ev.claridad || !ev.pertinencia || !ev.coherencia || (ev.observaciones && ev.observaciones.trim() !== "");
      });
    }

    if (itemsToRender.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="py-8 text-center text-slate-400 text-sm">
            No se encontraron ítems en este filtro.
          </td>
        </tr>
      `;
      return;
    }

    let currentSection = "";
    let html = "";

    itemsToRender.forEach(item => {
      const ev = this.evaluations[item.id];

      // Cabecera de sección cuando cambia
      if (item.section !== currentSection && this.filter === "all") {
        currentSection = item.section;
        html += `
          <tr class="bg-sky-50/90 border-y border-sky-200">
            <td colspan="5" class="py-2.5 px-4 text-xs font-bold text-sky-900 tracking-wider uppercase">
              ${currentSection}
            </td>
          </tr>
        `;
      }

      html += `
        <tr class="border-b border-slate-200/80 hover:bg-sky-50/50 transition-colors" id="expert-row-${item.id}">
          <!-- Ítem & Contenido -->
          <td class="py-3 px-3.5 align-top">
            <div class="flex items-start gap-2.5">
              <span class="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-sky-700 border border-slate-200 flex-shrink-0">
                ${item.id}
              </span>
              <div>
                <span class="text-xs sm:text-sm font-semibold text-slate-800 block">${item.content}</span>
                <span class="text-[10px] text-slate-500">${item.section}</span>
              </div>
            </div>
          </td>

          <!-- Claridad (Sí/No) -->
          <td class="py-3 px-2 text-center align-middle">
            <div class="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
              <button type="button" 
                      class="px-2.5 py-1 text-xs rounded-md font-bold transition-all ${ev.claridad ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}"
                      onclick="ExpertModule.setCriteria(${item.id}, 'claridad', true)">
                SÍ
              </button>
              <button type="button" 
                      class="px-2.5 py-1 text-xs rounded-md font-bold transition-all ${!ev.claridad ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}"
                      onclick="ExpertModule.setCriteria(${item.id}, 'claridad', false)">
                NO
              </button>
            </div>
          </td>

          <!-- Pertinencia (Sí/No) -->
          <td class="py-3 px-2 text-center align-middle">
            <div class="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
              <button type="button" 
                      class="px-2.5 py-1 text-xs rounded-md font-bold transition-all ${ev.pertinencia ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}"
                      onclick="ExpertModule.setCriteria(${item.id}, 'pertinencia', true)">
                SÍ
              </button>
              <button type="button" 
                      class="px-2.5 py-1 text-xs rounded-md font-bold transition-all ${!ev.pertinencia ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}"
                      onclick="ExpertModule.setCriteria(${item.id}, 'pertinencia', false)">
                NO
              </button>
            </div>
          </td>

          <!-- Coherencia (Sí/No) -->
          <td class="py-3 px-2 text-center align-middle">
            <div class="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
              <button type="button" 
                      class="px-2.5 py-1 text-xs rounded-md font-bold transition-all ${ev.coherencia ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}"
                      onclick="ExpertModule.setCriteria(${item.id}, 'coherencia', true)">
                SÍ
              </button>
              <button type="button" 
                      class="px-2.5 py-1 text-xs rounded-md font-bold transition-all ${!ev.coherencia ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}"
                      onclick="ExpertModule.setCriteria(${item.id}, 'coherencia', false)">
                NO
              </button>
            </div>
          </td>

          <!-- Observaciones / Sugerencias de Mejora -->
          <td class="py-3 px-3 align-middle">
            <input type="text" 
                   value="${ev.observaciones || ''}"
                   placeholder="Sugerencia u observación técnica..."
                   class="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                   onchange="ExpertModule.setObservation(${item.id}, this.value)">
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  },

  setCriteria(itemId, criteria, value) {
    if (this.evaluations[itemId]) {
      this.evaluations[itemId][criteria] = value;
      this.renderMatrix();
      this.updateLiveStats();
    }
  },

  setObservation(itemId, text) {
    if (this.evaluations[itemId]) {
      this.evaluations[itemId].observaciones = text;
      this.updateLiveStats();
    }
  },

  updateLiveStats() {
    let countClaridad = 0;
    let countPertinencia = 0;
    let countCoherencia = 0;
    let countObs = 0;
    const total = EXPERT_EVALUATION_ITEMS.length;

    EXPERT_EVALUATION_ITEMS.forEach(it => {
      const ev = this.evaluations[it.id];
      if (ev.claridad) countClaridad++;
      if (ev.pertinencia) countPertinencia++;
      if (ev.coherencia) countCoherencia++;
      if ((ev.observaciones && ev.observaciones.trim() !== "") || !ev.claridad || !ev.pertinencia || !ev.coherencia) {
        countObs++;
      }
    });

    const porcClaridad = ((countClaridad / total) * 100).toFixed(1);
    const porcPertinencia = ((countPertinencia / total) * 100).toFixed(1);
    const porcCoherencia = ((countCoherencia / total) * 100).toFixed(1);

    const elC = document.getElementById("stat-expert-claridad");
    const elP = document.getElementById("stat-expert-pertinencia");
    const elH = document.getElementById("stat-expert-coherencia");
    const elObs = document.getElementById("badge-obs-count");

    if (elC) elC.innerText = `${porcClaridad}% (${countClaridad}/${total})`;
    if (elP) elP.innerText = `${porcPertinencia}% (${countPertinencia}/${total})`;
    if (elH) elH.innerText = `${porcCoherencia}% (${countCoherencia}/${total})`;
    if (elObs) elObs.innerText = countObs;
  },

  validateForm() {
    const nombres = document.getElementById("expert_nombres").value.trim();
    const cedula = document.getElementById("expert_cedula").value.trim();
    const telefono = document.getElementById("expert_telefono").value.trim();
    const profesion = document.getElementById("expert_profesion").value.trim();
    const grado = document.getElementById("expert_grado").value.trim();
    const institucion = document.getElementById("expert_institucion").value.trim();
    const cargo = document.getElementById("expert_cargo").value.trim();
    const experiencia = document.getElementById("expert_experiencia").value.trim();

    if (!nombres || !cedula || !telefono || !profesion || !grado || !institucion || !cargo || !experiencia) {
      UI.showToast("Debe completar todos los datos de identificación del experto(a) validador(a).", "warning");
      document.getElementById("expert-personal-card")?.scrollIntoView({ behavior: "smooth" });
      return false;
    }

    const dictamen = document.querySelector('input[name="expert_dictamen"]:checked')?.value;
    if (!dictamen) {
      UI.showToast("Debe seleccionar un Dictamen Final de Validación para los instrumentos.", "warning");
      document.getElementById("expert-verdict-card")?.scrollIntoView({ behavior: "smooth" });
      return false;
    }

    const firmaCheck = document.getElementById("expert_signature_agreement");
    if (firmaCheck && !firmaCheck.checked) {
      UI.showToast("Debe confirmar la declaración de validación académica y firma digital.", "warning");
      return false;
    }

    this.expertData = {
      nombresApellidos: nombres,
      cedula,
      telefono,
      profesion,
      especialidadGrado: grado,
      institucion,
      cargo,
      experienciaAnos: Number(experiencia)
    };
    this.dictamenFinal = dictamen;
    this.comentarioGeneral = document.getElementById("expert_comentario_general")?.value.trim() || "";

    return true;
  },

  async submitExpertValidation() {
    if (!this.validateForm()) return;

    const btnSubmit = document.getElementById("btn-submit-expert");
    const originalText = btnSubmit ? btnSubmit.innerHTML : "Enviar Validación";

    try {
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Enviando Dictamen...
        `;
      }

      // Consolidar matriz para payload
      const matrixPayload = EXPERT_EVALUATION_ITEMS.map(it => {
        const ev = this.evaluations[it.id];
        return {
          id: it.id,
          section: it.section,
          content: it.content,
          claridad: ev.claridad,
          pertinencia: ev.pertinencia,
          coherencia: ev.coherencia,
          observaciones: ev.observaciones
        };
      });

      let cC = 0, cP = 0, cCoh = 0;
      matrixPayload.forEach(p => {
        if (p.claridad) cC++;
        if (p.pertinencia) cP++;
        if (p.coherencia) cCoh++;
      });
      const total = matrixPayload.length;

      const payload = {
        action: "submit_expert_validation",
        expertData: this.expertData,
        dictamenFinal: this.dictamenFinal,
        comentarioGeneral: this.comentarioGeneral,
        fechaEvaluacion: new Date().toLocaleDateString("es-VE", { year: "numeric", month: "2-digit", day: "2-digit" }),
        validationStats: {
          claridadSi: cC,
          porcClaridad: ((cC / total) * 100).toFixed(1) + "%",
          pertinenciaSi: cP,
          porcPertinencia: ((cP / total) * 100).toFixed(1) + "%",
          coherenciaSi: cCoh,
          porcCoherencia: ((cCoh / total) * 100).toFixed(1) + "%"
        },
        matrixEvaluations: matrixPayload
      };

      const gasUrl = UI.getGasUrl();

      if (!gasUrl) {
        await new Promise(r => setTimeout(r, 1200));
        const simId = "EXP-2026-SIM" + Math.floor(Math.random() * 899 + 100);
        this.showSuccessModal(simId, true);
        return;
      }

      // Envío al servidor central (Doble canal: directo + proxy serverless)
      let success = false;
      let res = null;

      try {
        const response = await fetch(gasUrl, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });
        res = await response.json();
        if (res && res.status === "success") {
          success = true;
        }
      } catch (errDirect) {
        console.warn("Fallo envío directo de validación, probando proxy serverless:", errDirect.message);
      }

      if (!success) {
        try {
          const proxyRes = await fetch("/api/proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (proxyRes.ok) {
            res = await proxyRes.json();
            if (res && res.status === "success") {
              success = true;
            }
          }
        } catch (errProxy) {
          console.warn("Fallo envío vía proxy serverless:", errProxy.message);
        }
      }

      if (success && res) {
        this.showSuccessModal(res.expertId || "EXP-REGISTRADO", false);
      } else {
        throw new Error((res && res.message) || "Error procesando en el servidor.");
      }

    } catch (err) {
      console.error("Error al registrar validación:", err);
      UI.showToast("No se pudo conectar a la base de datos institucional. Verifique el endpoint del servidor.", "error");
      const confirmDemo = confirm("¿Desea asentar el dictamen del experto en modo local/demostración académica?");
      if (confirmDemo) {
        const simId = "EXP-OFFLINE-" + Math.floor(Math.random() * 899 + 100);
        this.showSuccessModal(simId, true);
      }
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
      }
    }
  },

  showSuccessModal(expertId, isDemo = false) {
    const modal = document.getElementById("expert-success-modal");
    const codeEl = document.getElementById("expert-success-code");
    const dictEl = document.getElementById("expert-success-dictamen");
    const nameEl = document.getElementById("expert-success-name");

    if (codeEl) codeEl.innerText = expertId;
    if (dictEl) dictEl.innerText = this.dictamenFinal;
    if (nameEl) nameEl.innerText = this.expertData.nombresApellidos;

    if (modal) modal.classList.remove("hidden");
  },

  closeSuccessModal() {
    const modal = document.getElementById("expert-success-modal");
    if (modal) modal.classList.add("hidden");
    window.location.reload();
  }
};
