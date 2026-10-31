/**
 * MÓDULO 3: DASHBOARD ESTADÍSTICO (ANALÍTICA EN TIEMPO REAL)
 * Consume datos JSON devueltos por doGet del servidor central y renderiza con Chart.js
 * Incluye dataset simulado representativo para pruebas académicas inmediatas.
 */

const DashboardModule = {
  charts: {},
  isDemoMode: false,
  cachedData: null,

  // Dataset de simulación académica realista basado en la población de gerentes/supervisores del HCUAMP
  demoData: {
    summary: {
      totalEncuestados: 48,
      avgKnowledgeScore: "11.65",
      avgLikertScore: "3.92",
      totalExpertos: 3,
      lastUpdated: new Date().toISOString()
    },
    knowledge: {
      levels: {
        Bajo: 18,
        Medio: 22,
        Alto: 8
      },
      dimAverages: {
        dimA: "3.10", // Delegados (sobre 5)
        dimB: "3.25", // CSSL (sobre 5)
        dimC: "2.65", // SSST (sobre 5)
        dimD: "2.65"  // PSST (sobre 5)
      }
    },
    likert: {
      levels: {
        "Baja necesidad": 4,
        "Moderada necesidad": 12,
        "Alta necesidad": 32
      },
      dimAverages: {
        dimA: "3.75", // Delegados
        dimB: "3.88", // CSSL
        dimC: "4.15", // SSST
        dimD: "4.28"  // PSST (Mayor necesidad formativa en formatos y normas NT-04-2023)
      }
    },
    sociodemographic: {
      cargos: {
        "Supervisor(a) Clínico": 18,
        "Supervisor(a) Administrativo": 14,
        "Analista de Gestión Humana": 6,
        "Jefe(a) de Oficina / Departamento": 8,
        "Director(a) / Subdirector(a)": 2
      },
      nivelInstruccion: {
        "TSU en Administración/Afines": 8,
        "Licenciado/a en Administración": 16,
        "Licenciado/a en otra área": 12,
        "Especialista": 9,
        "Magíster / Doctor": 3
      },
      sexo: {
        Femenino: 33,
        Masculino: 15
      },
      formacionSST: {
        "Sí": 14,
        "No": 34
      },
      tiposFormacion: {
        "Capacitación Interna Institucional": 6,
        "Curso/Taller dictado por INPSASEL": 4,
        "Curso Privado / Consultora": 3,
        "Curso Universitario / Postgrado": 1
      }
    },
    experts: {
      total: 3,
      dictamenes: {
        "Aprobado sin modificaciones": 2,
        "Aprobado con observaciones": 1,
        "No Aprobado": 0
      },
      criterios: {
        claridad: "96.7",
        pertinencia: "100.0",
        coherencia: "98.3"
      }
    }
  },

  async init() {
    this.setupChartDefaults();
    await this.loadDashboardData();
  },

  setupChartDefaults() {
    if (typeof Chart === "undefined") return;

    // Estilos globales de Chart.js para armonizar con la paleta clara Glassmorphism
    Chart.defaults.color = "#475569"; // Slate-600
    Chart.defaults.font.family = "Outfit, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15, 23, 42, 0.92)";
    Chart.defaults.plugins.tooltip.titleColor = "#ffffff";
    Chart.defaults.plugins.tooltip.bodyColor = "#e2e8f0";
    Chart.defaults.plugins.tooltip.borderColor = "rgba(255, 255, 255, 0.15)";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
  },

  async loadDashboardData() {
    const gasUrl = UI.getGasUrl();
    const statusBadge = document.getElementById("dashboard-source-badge");

    if (statusBadge) {
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span> Consultando Base de Datos...`;
      statusBadge.className = "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200";
    }

    let loadedData = null;

    // 1. Intentar conexión directa al endpoint central configurado
    if (gasUrl) {
      try {
        const response = await fetch(`${gasUrl}?action=get_dashboard`, {
          method: "GET",
          mode: "cors"
        });
        if (response.ok) {
          const res = await response.json();
          if (res && res.status === "success" && res.data) {
            loadedData = res.data;
          }
        }
      } catch (errDirect) {
        console.warn("Fallo conexión directa al endpoint central:", errDirect.message);
      }
    }

    // 2. Si falla la conexión directa (ej: restricciones CORS o red), intentar a través del proxy serverless (/api/proxy)
    if (!loadedData) {
      try {
        const proxyResponse = await fetch(`/api/proxy?action=get_dashboard`, {
          method: "GET"
        });
        if (proxyResponse.ok) {
          const resProxy = await proxyResponse.json();
          if (resProxy && resProxy.status === "success" && resProxy.data) {
            loadedData = resProxy.data;
          }
        }
      } catch (errProxy) {
        console.warn("Fallo conexión vía proxy serverless:", errProxy.message);
      }
    }

    // 3. Renderizar datos en vivo o activar contingencia demostrativa
    if (loadedData) {
      this.isDemoMode = false;
      this.cachedData = loadedData;
      if (statusBadge) {
        statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span> Base de Datos Conectada (En Vivo)`;
        statusBadge.className = "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200";
      }
      this.renderAll(loadedData);
    } else {
      this.isDemoMode = true;
      if (statusBadge) {
        statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> Modo Demostración (Simulado)`;
        statusBadge.className = "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200";
      }
      this.renderAll(this.demoData);
    }
  },

  renderAll(data) {
    this.renderKPIs(data);
    this.renderKnowledgeChart(data.knowledge);
    this.renderKnowledgeDimsChart(data.knowledge);
    this.renderLikertRadarChart(data.likert);
    this.renderCargosChart(data.sociodemographic);
    this.renderFormacionChart(data.sociodemographic);
    this.renderExpertsMetrics(data.experts);
  },

  renderKPIs(data) {
    const summary = data.summary || {};
    const totalEncEl = document.getElementById("kpi-total-encuestados");
    const avgKnowEl = document.getElementById("kpi-avg-knowledge");
    const knowBadgeEl = document.getElementById("kpi-knowledge-badge");
    const avgLikertEl = document.getElementById("kpi-avg-likert");
    const likertBadgeEl = document.getElementById("kpi-likert-badge");
    const totalExpEl = document.getElementById("kpi-total-expertos");

    if (totalEncEl) totalEncEl.innerText = summary.totalEncuestados || 0;
    
    if (avgKnowEl) {
      avgKnowEl.innerText = `${summary.avgKnowledgeScore || 0} / 20`;
      const catK = SCORING.getKnowledgeCategory(Number(summary.avgKnowledgeScore || 0));
      if (knowBadgeEl) {
        knowBadgeEl.className = `px-2 py-0.5 rounded-full text-xs font-semibold border ${catK.badgeClass}`;
        knowBadgeEl.innerText = catK.level;
      }
    }

    if (avgLikertEl) {
      avgLikertEl.innerText = `${summary.avgLikertScore || 0} / 5.0`;
      const catL = SCORING.getLikertCategory(Number(summary.avgLikertScore || 0));
      if (likertBadgeEl) {
        likertBadgeEl.className = `px-2 py-0.5 rounded-full text-xs font-semibold border ${catL.badgeClass}`;
        likertBadgeEl.innerText = catL.level;
      }
    }

    if (totalExpEl) totalExpEl.innerText = `${summary.totalExpertos || 0} Validados`;
  },

  // 1. Gráfico de Barras: Distribución de Niveles de Conocimiento
  renderKnowledgeChart(knowledgeData) {
    const ctx = document.getElementById("chart-knowledge-levels");
    if (!ctx) return;

    if (this.charts.knowledge) this.charts.knowledge.destroy();

    const levels = knowledgeData.levels || { Bajo: 0, Medio: 0, Alto: 0 };
    const total = (levels.Bajo || 0) + (levels.Medio || 0) + (levels.Alto || 0);

    this.charts.knowledge = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Bajo (0 - 10 pts)", "Medio (11 - 15 pts)", "Alto (16 - 20 pts)"],
        datasets: [{
          label: "N° de Personal Gerencial / Supervisor",
          data: [levels.Bajo || 0, levels.Medio || 0, levels.Alto || 0],
          backgroundColor: [
            "rgba(239, 68, 68, 0.75)",   // Red
            "rgba(245, 158, 11, 0.75)",  // Amber
            "rgba(16, 185, 129, 0.75)"   // Emerald
          ],
          borderColor: [
            "#ef4444",
            "#f59e0b",
            "#10b981"
          ],
          borderWidth: 1.5,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const val = context.raw;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return `Proporción: ${pct}% de la muestra`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0, 0, 0, 0.06)" },
            ticks: { precision: 0 }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  },

  // 2. Gráfico de Barras: Puntuación Media de Conocimiento por Dimensión
  renderKnowledgeDimsChart(knowledgeData) {
    const ctx = document.getElementById("chart-knowledge-dims");
    if (!ctx) return;

    if (this.charts.knowledgeDims) this.charts.knowledgeDims.destroy();

    const dims = knowledgeData.dimAverages || { dimA: 0, dimB: 0, dimC: 0, dimD: 0 };

    this.charts.knowledgeDims = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Dim A: Delegados",
          "Dim B: Comité (CSSL)",
          "Dim C: Servicio (SSST)",
          "Dim D: Programa (PSST)"
        ],
        datasets: [{
          label: "Promedio Obtenido (Escala 0 a 5 pts)",
          data: [dims.dimA, dims.dimB, dims.dimC, dims.dimD],
          backgroundColor: "rgba(14, 165, 233, 0.7)", // Sky blue
          borderColor: "#0284c7",
          borderWidth: 1.5,
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y', // Barras horizontales
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 5,
            grid: { color: "rgba(0, 0, 0, 0.06)" }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });
  },

  // 3. Gráfico Radar: Necesidades de Formación por Dimensión (Escala Likert 1 a 5)
  renderLikertRadarChart(likertData) {
    const ctx = document.getElementById("chart-likert-radar");
    if (!ctx) return;

    if (this.charts.likertRadar) this.charts.likertRadar.destroy();

    const dims = likertData.dimAverages || { dimA: 0, dimB: 0, dimC: 0, dimD: 0 };

    this.charts.likertRadar = new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          ["Dim A: Delegados", "de Prevención"],
          ["Dim B: Comité de", "Seguridad (CSSL)"],
          ["Dim C: Servicio de", "SST (SSST)"],
          ["Dim D: Programa", "de SST (PSST)"]
        ],
        datasets: [
          {
            label: "Nivel de Necesidad Percibida (1 a 5)",
            data: [dims.dimA, dims.dimB, dims.dimC, dims.dimD],
            backgroundColor: "rgba(13, 148, 136, 0.25)", // Teal translucent
            borderColor: "#0d9488",
            pointBackgroundColor: "#0f766e",
            pointBorderColor: "#ffffff",
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#0f766e",
            borderWidth: 2.5,
            pointRadius: 4.5
          },
          {
            label: "Umbral Alta Necesidad (3.51)",
            data: [3.51, 3.51, 3.51, 3.51],
            borderColor: "rgba(225, 29, 72, 0.8)", // Rose
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 12, font: { size: 11, family: "Plus Jakarta Sans" } }
          }
        },
        scales: {
          r: {
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
              backdropColor: "transparent",
              color: "#64748b"
            },
            grid: { color: "rgba(0, 0, 0, 0.08)" },
            angleLines: { color: "rgba(0, 0, 0, 0.08)" },
            pointLabels: {
              font: { size: 11.5, weight: "bold", family: "Outfit" },
              color: "#0f172a"
            }
          }
        }
      }
    });
  },

  // 4. Gráfico Doughnut: Cargos desempeñados en el HCUAMP
  renderCargosChart(socioData) {
    const ctx = document.getElementById("chart-socio-cargos");
    if (!ctx) return;

    if (this.charts.cargos) this.charts.cargos.destroy();

    const cargos = (socioData && socioData.cargos) ? socioData.cargos : {};
    let labels = Object.keys(cargos);
    let dataVals = Object.values(cargos);

    let colors = [
      "#0284c7", // Sky
      "#6366f1", // Indigo
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#ec4899"  // Pink
    ];

    if (labels.length === 0) {
      labels = ["Sin encuestas registradas aún"];
      dataVals = [1];
      colors = ["#e2e8f0"];
    }

    this.charts.cargos = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: dataVals,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: "#ffffff",
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 10, font: { size: 11 } }
          }
        },
        cutout: "65%"
      }
    });
  },

  // 5. Gráfico de Barras: Formación Previa en SST
  renderFormacionChart(socioData) {
    const ctx = document.getElementById("chart-socio-formacion");
    if (!ctx) return;

    if (this.charts.formacion) this.charts.formacion.destroy();

    const form = (socioData && socioData.formacionSST) ? socioData.formacionSST : { "Sí": 0, "No": 0 };
    const siVal = form["Sí"] || 0;
    const noVal = form["No"] || 0;
    const total = siVal + noVal;

    let labels = [
      `Sí ha recibido formación (${siVal})`,
      `No ha recibido formación (${noVal})`
    ];
    let dataVals = [siVal, noVal];
    let bgColors = [
      "rgba(2, 132, 199, 0.85)",  // Sky
      "rgba(244, 63, 94, 0.85)"   // Rose
    ];

    if (total === 0) {
      labels = ["Sin encuestas registradas aún"];
      dataVals = [1];
      bgColors = ["#e2e8f0"];
    }

    this.charts.formacion = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: dataVals,
          backgroundColor: bgColors,
          borderColor: "#ffffff",
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 10, font: { size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                if (total === 0) return " 0 registros";
                const val = context.raw;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return ` ${val} personas (${pct}%)`;
              }
            }
          }
        }
      }
    });
  },

  // 6. Métricas y Dictámenes del Juicio de Expertos
  renderExpertsMetrics(expertData) {
    if (!expertData) return;

    const elClaridad = document.getElementById("dash-expert-claridad");
    const elPertinencia = document.getElementById("dash-expert-pertinencia");
    const elCoherencia = document.getElementById("dash-expert-coherencia");

    const crit = expertData.criterios || {};
    const totalExp = expertData.total || 0;

    if (elClaridad) elClaridad.innerText = totalExp > 0 ? `${crit.claridad}%` : "100% (Esperando)";
    if (elPertinencia) elPertinencia.innerText = totalExp > 0 ? `${crit.pertinencia}%` : "100% (Esperando)";
    if (elCoherencia) elCoherencia.innerText = totalExp > 0 ? `${crit.coherencia}%` : "100% (Esperando)";

    // Gráfico de Dictámenes
    const ctx = document.getElementById("chart-expert-dictamenes");
    if (!ctx) return;

    if (this.charts.dictamenes) this.charts.dictamenes.destroy();

    const dict = expertData.dictamenes || {};
    const d1 = dict["Aprobado sin modificaciones"] || 0;
    const d2 = dict["Aprobado con observaciones"] || 0;
    const d3 = dict["No Aprobado"] || 0;
    const totalDict = d1 + d2 + d3;

    let labels = [
      "Aprobado sin modificaciones",
      "Aprobado con observaciones",
      "No Aprobado"
    ];
    let dataVals = [d1, d2, d3];
    let colors = [
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#ef4444"  // Rose
    ];

    if (totalDict === 0) {
      labels = ["En espera de validaciones"];
      dataVals = [1];
      colors = ["#e2e8f0"];
    }

    this.charts.dictamenes = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: dataVals,
          backgroundColor: colors,
          borderColor: "#ffffff",
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 10, font: { size: 10 } }
          }
        },
        cutout: "60%"
      }
    });
  },
        cutout: "60%"
      }
    });
  },

  refresh() {
    UI.showToast("Actualizando datos del dashboard...", "info");
    this.loadDashboardData();
  },

  toggleDemoMode() {
    if (this.isDemoMode && this.cachedData) {
      this.isDemoMode = false;
      this.renderAll(this.cachedData);
      UI.showToast("Mostrando datos en vivo desde la Base de Datos Institucional.", "success");
    } else {
      this.isDemoMode = true;
      this.renderAll(this.demoData);
      UI.showToast("Mostrando dataset simulado representativo.", "info");
    }
  }
};
