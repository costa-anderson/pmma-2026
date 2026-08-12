// ==========================================================================
// 🧠 QG PMMA 2026 - Central de Inteligência de Estudos (Orquestrador)
// ==========================================================================

const EXAM_DATE = new Date("2026-10-11T08:00:00");
const TAF_TARGETS = {
    pullups: 4,
    meio_sugado: 25,
    abdominal: 35,
    running: 2400
};

// Inicialização
document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    initTabs();
    startCountdown();
    
    // Carrega dados da planilha local via API do Python
    const success = await loadData();
    if (success) {
        appDataReady();
    } else {
        alert("Erro: Não foi possível obter dados do servidor Python. Verifique se o servidor está rodando.");
    }
    
    initEventListeners();
});

// 🌗 Controle do Tema
function initTheme() {
    const savedTheme = localStorage.getItem("qg-theme-v2") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    document.getElementById("theme-toggle-btn").addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("qg-theme-v2", newTheme);
        renderCharts(); // Recria os gráficos com as cores corretas
    });
}

// 🧭 Navegação SPA
function initTabs() {
    const menuItems = document.querySelectorAll(".menu-item");
    const panes = document.querySelectorAll(".tab-pane");
    
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            const tabId = item.getAttribute("data-tab");
            if (!tabId) return; // Permite links externos comuns funcionarem
            e.preventDefault();
            
            // Remove active de todos
            menuItems.forEach(m => m.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));
            
            // Ativa o selecionado
            item.classList.add("active");
            document.getElementById(`tab-${tabId}`).classList.add("active");
            
            // Atualiza cabeçalho
            updateHeaderTitle(tabId);
            
            // Recarrega visualizações específicas
            if (tabId === "dashboard") {
                renderDashboard();
            } else if (tabId === "cronograma") {
                renderCronograma();
            } else if (tabId === "edital") {
                renderEdital();
            } else if (tabId === "desempenho") {
                renderDesempenho();
            } else if (tabId === "revisao") {
                initSrsTab();
            }
        });
    });
}

function updateHeaderTitle(tabId) {
    const titleEl = document.getElementById("current-tab-title");
    const descEl = document.getElementById("current-tab-desc");
    
    const titles = {
        dashboard: { t: "Painel Tático", d: "Visão geral do seu progresso, metas e estatísticas de estudos." },
        cronograma: { t: "Cronograma de Estudos", d: "Planejamento diário inteligente de matérias e temas." },
        edital: { t: "Controle do Edital", d: "Mapeamento e acompanhamento de tópicos fechados do edital." },
        desempenho: { t: "Desempenho Geral", d: "Evolução e registros de testes físicos do TAF e Simulados externos." },
        revisao: { t: "Revisão Inteligente (SRS)", d: "Acompanhe e registre a revisão dos Temas Quentes (🔥) nos prazos corretos." }
    };
    
    if (titles[tabId]) {
        titleEl.textContent = titles[tabId].t;
        descEl.textContent = titles[tabId].d;
    }
}

// ⏰ Contador Regressivo da Prova
function startCountdown() {
    const timerEl = document.getElementById("countdown-timer");
    
    function update() {
        const now = new Date();
        const diff = EXAM_DATE - now;
        
        if (diff <= 0) {
            timerEl.textContent = "A prova está acontecendo ou já passou!";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        timerEl.textContent = `${days}d ${hours}h ${minutes}m até a prova`;
    }
    
    update();
    setInterval(update, 60000);
}

// Dados prontos, popular filtros e renderizar
function appDataReady() {
    populateCronoFilterSemanas();
    populateEditalFilterSubjects();
    
    // Renderiza a tab inicial ativa
    const activeTab = document.querySelector(".menu-item.active").getAttribute("data-tab");
    if (activeTab === "dashboard") {
        renderDashboard();
    } else if (activeTab === "cronograma") {
        renderCronograma();
    } else if (activeTab === "edital") {
        renderEdital();
    } else if (activeTab === "desempenho") {
        renderDesempenho();
    } else if (activeTab === "revisao") {
        initSrsTab();
    }
}

// 🎛️ GERENCIADOR DOS EVENTOS & MODAIS
function initEventListeners() {
    // 1. Inputs de busca/filtros com redespacho
    document.getElementById("search-crono").addEventListener("input", renderCronograma);
    document.getElementById("filter-crono-status").addEventListener("change", renderCronograma);
    document.getElementById("filter-crono-week").addEventListener("change", renderCronograma);
    
    document.getElementById("search-edital").addEventListener("input", renderEdital);
    document.getElementById("filter-edital-subject").addEventListener("change", renderEdital);
    document.getElementById("filter-edital-status").addEventListener("change", renderEdital);

    // 2. Ações de Modais
    // Estudo
    document.getElementById("close-modal-study").addEventListener("click", () => closeModal("modal-log-study"));
    document.getElementById("btn-cancel-study").addEventListener("click", () => closeModal("modal-log-study"));
    document.getElementById("form-study-log").addEventListener("submit", handleStudyFormSubmit);
    
    // Simulado Geral
    const openSimModal = () => {
        document.getElementById("form-sim-date").value = new Date().toISOString().split('T')[0];
        document.getElementById("form-simulado-log").reset();
        
        // Habilita o campo de número do simulado
        const simNumInput = document.getElementById("form-sim-num");
        if (simNumInput) {
            simNumInput.readOnly = false;
        }
        
        // Restaura o título do modal
        const h3 = document.querySelector("#modal-log-simulado h3");
        if (h3) h3.innerHTML = `<i class="fa-solid fa-scroll"></i> Registrar Simulado Geral`;
        
        openModal("modal-log-simulado");
    };
    document.getElementById("btn-quick-simulado").addEventListener("click", openSimModal);
    document.getElementById("btn-add-simulado-perf").addEventListener("click", openSimModal);
    document.getElementById("close-modal-simulado").addEventListener("click", () => closeModal("modal-log-simulado"));
    document.getElementById("btn-cancel-simulado").addEventListener("click", () => closeModal("modal-log-simulado"));
    document.getElementById("form-simulado-log").addEventListener("submit", handleSimuladoFormSubmit);

    // Desempenho por Tema (Lote)
    const openSimLoteModal = () => {
        document.getElementById("form-sim-lote-date").value = new Date().toISOString().split('T')[0];
        document.getElementById("form-simulado-lote-log").reset();
        document.getElementById("sim-lote-topics-container").innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; margin: 2rem 0;">Selecione uma semana acima.</p>';
        populateSimuladoLoteWeeks();
        openModal("modal-log-simulado-lote");
    };
    document.getElementById("btn-quick-simulado-lote").addEventListener("click", openSimLoteModal);
    const addSimLoteBtn = document.getElementById("btn-add-simulado-lote-perf");
    if (addSimLoteBtn) {
        addSimLoteBtn.addEventListener("click", openSimLoteModal);
    }
    document.getElementById("close-modal-simulado-lote").addEventListener("click", () => closeModal("modal-log-simulado-lote"));
    document.getElementById("btn-cancel-simulado-lote").addEventListener("click", () => closeModal("modal-log-simulado-lote"));
    document.getElementById("form-simulado-lote-log").addEventListener("submit", handleSimuladoLoteFormSubmit);

    // TAF
    document.getElementById("btn-quick-taf").addEventListener("click", () => openModal("modal-log-taf"));
    document.getElementById("btn-add-taf-perf").addEventListener("click", () => openModal("modal-log-taf"));
    document.getElementById("close-modal-taf").addEventListener("click", () => closeModal("modal-log-taf"));
    document.getElementById("btn-cancel-taf").addEventListener("click", () => closeModal("modal-log-taf"));
    document.getElementById("form-taf-log").addEventListener("submit", handleTafFormSubmit);

    // SRS
    document.getElementById("form-srs-log").addEventListener("submit", handleSrsFormSubmit);

    // Registro rápido de estudo a partir da dashboard
    document.getElementById("btn-quick-study").addEventListener("click", () => {
        const firstPending = state.edital.find(e => !e.studied);
        if (firstPending) {
            const idx = state.edital.indexOf(firstPending);
            openStudyLogModal(idx, 'edital');
        } else {
            alert("Parabéns! Você já fechou todo o edital.");
        }
    });
    
    // Configurações do Google Sheets não são mais necessárias no rodapé do celular
    // Mas vamos desabilitar para evitar erros
    const gearBtn = document.getElementById("btn-config-sheets");
    if (gearBtn) {
        gearBtn.style.display = "none";
    }
}

// Auxiliares de modal
window.openModal = function(id) {
    document.getElementById(id).classList.add("active");
};

window.closeModal = function(id) {
    document.getElementById(id).classList.remove("active");
};

// 🖊&nbsp;Abertura preenchida para log de estudo
window.openStudyLogModal = function(index, source) {
    document.getElementById("form-study-index").value = index;
    document.getElementById("form-study-source").value = source;
    
    let item = null;
    if (source === "crono") {
        item = state.crono[index];
    } else {
        item = state.edital[index];
    }
    
    document.getElementById("form-study-subject").value = item.subject;
    document.getElementById("form-study-topic").value = item.topic;
    document.getElementById("form-study-completed").value = item.studied ? "sim" : "nao";
    document.getElementById("form-study-duration").value = item.duration || 0;
    
    // Questões
    document.getElementById("form-study-questions-done").value = (item.questions && item.questions > 0) ? "sim" : "nao";
    document.getElementById("form-study-questions").value = item.questions || 0;
    document.getElementById("form-study-correct").value = item.correct || 0;
    document.getElementById("form-study-notes").value = item.notes || "";
    
    openModal("modal-log-study");
};

// 💾 SUBMITS DE FORMULÁRIO

async function handleStudyFormSubmit(e) {
    e.preventDefault();
    const index = parseInt(document.getElementById("form-study-index").value);
    const source = document.getElementById("form-study-source").value;
    
    const completed = document.getElementById("form-study-completed").value === "sim";
    const duration = parseInt(document.getElementById("form-study-duration").value) || 0;
    const questionsDone = document.getElementById("form-study-questions-done").value === "sim";
    const questions = questionsDone ? (parseInt(document.getElementById("form-study-questions").value) || 0) : 0;
    const correct = questionsDone ? (parseInt(document.getElementById("form-study-correct").value) || 0) : 0;
    const notes = document.getElementById("form-study-notes").value;
    
    const item = source === "crono" ? state.crono[index] : state.edital[index];
    
    const studyData = {
        date: getTodayString(),
        subject: item.subject,
        topic: item.topic,
        type: source === "crono" ? item.type : "Teoria + Questões",
        duration: duration,
        questions: questions,
        correct: correct,
        notes: notes
    };
    
    updateSyncText("Salvando estudo no Excel...", "synching");
    const success = await apiRegisterStudy(studyData);
    if (success) {
        closeModal("modal-log-study");
        appDataReady();
    }
}

async function handleSimuladoFormSubmit(e) {
    e.preventDefault();
    
    const dateInput = document.getElementById("form-sim-date").value;
    const formattedDate = formatDateInput(dateInput);
    
    const simData = {
        number: parseInt(document.getElementById("form-sim-num").value),
        date: formattedDate,
        p1_questions: parseInt(document.getElementById("form-sim-p1-q").value) || 0,
        p1_correct: parseInt(document.getElementById("form-sim-p1-c").value) || 0,
        p2_questions: parseInt(document.getElementById("form-sim-p2-q").value) || 0,
        p2_correct: parseInt(document.getElementById("form-sim-p2-c").value) || 0,
        score: parseFloat(document.getElementById("form-sim-score").value) || 0.0,
        duration: document.getElementById("form-sim-duration").value,
        notes: ""
    };
    
    updateSyncText("Salvando simulado no Excel...", "synching");
    const success = await apiRegisterSimulado(simData);
    if (success) {
        closeModal("modal-log-simulado");
        document.getElementById("form-simulado-log").reset();
        appDataReady();
    }
}

async function handleTafFormSubmit(e) {
    e.preventDefault();
    
    const dateInput = document.getElementById("form-taf-date").value;
    const formattedDate = formatDateInput(dateInput);
    
    const tafData = {
        date: formattedDate,
        pullups: parseInt(document.getElementById("form-taf-pullups").value) || 0,
        meio_sugado: parseInt(document.getElementById("form-taf-sugado").value) || 0,
        abdominal: parseInt(document.getElementById("form-taf-abdominal").value) || 0,
        running: parseInt(document.getElementById("form-taf-running").value) || 0,
        notes: ""
    };
    
    updateSyncText("Salvando TAF no Excel...", "synching");
    const success = await apiRegisterTaf(tafData);
    if (success) {
        closeModal("modal-log-taf");
        document.getElementById("form-taf-log").reset();
        appDataReady();
    }
}

// Utilitários de formatação de data
window.formatDateInput = function(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-"); // YYYY-MM-DD
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};
