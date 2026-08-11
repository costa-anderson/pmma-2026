// ==========================================================================
// 🧠 QG PMMA 2026 - Central de Inteligência de Estudos (V2 Enxuta)
// ==========================================================================

const EXAM_DATE = new Date("2026-10-11T08:00:00");
const TAF_TARGETS = {
    pullups: 4,
    meio_sugado: 25,
    abdominal: 35,
    running: 2400
};

// Estado Global
let state = {
    crono: [],
    edital: [],
    treinos: [],
    taf_semanal: [],
    simulados: []
};

// Referência aos gráficos Chart.js para destruição/recriação
let chartSubjects = null;
let chartSimulados = null;
let chartTaf = null;

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initTabs();
    startCountdown();
    loadData();
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
            if (!tabId) return; // Permite links comuns funcionarem (ex: simulados)
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
                initRevisaoTab();
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
        desempenho: { t: "Desempenho Geral", d: "Evolução e registros de testes físicos do TAF e Simulados." },
        revisao: { t: "Revisão Semanal", d: "Revise os temas de cada semana com questões personalizadas do banco de dados." }
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

// 📦 Carregamento de Dados (Local Storage ou JSON)
async function loadData() {
    const localData = localStorage.getItem("pmma_data_v2");
    if (localData) {
        try {
            state = JSON.parse(localData);
            if (!state.erros_questoes) state.erros_questoes = [];
            if (!state.respondidas_questoes) state.respondidas_questoes = [];
            console.log("Dados carregados do localStorage.");
            appDataReady();
            return;
        } catch (e) {
            console.error("Erro ao ler dados do localStorage. Recorrendo ao JSON.", e);
        }
    }
    
    // Fallback: Busca JSON gerado pela planilha
    try {
        const response = await fetch("pmma_data_export.json");
        if (response.ok) {
            state = await response.json();
            if (!state.erros_questoes) state.erros_questoes = [];
            if (!state.respondidas_questoes) state.respondidas_questoes = [];
            saveDataLocal();
            console.log("Dados carregados do arquivo pmma_data_export.json.");
        } else {
            console.warn("Arquivo pmma_data_export.json não encontrado. Iniciando estado vazio.");
        }
    } catch (err) {
        console.error("Erro ao carregar dados do JSON:", err);
    }
    appDataReady();
}

function saveDataLocal() {
    localStorage.setItem("pmma_data_v2", JSON.stringify(state));
    pushErrorsToSheets();
    pushRespondidasToSheets();
}

function appDataReady() {
    populateCronoFilterSemanas();
    populateEditalFilterSubjects();
    renderDashboard();
    checkPendingSimulados();
    window.addEventListener('focus', checkPendingSimulados);
    
    // Configura os listeners do modal da Planilha
    initSheetsConfigListeners();
    
    // Tenta sincronização na inicialização e foco
    if (SHEET_WEBAPP_URL) {
        syncDataOnline();
        window.addEventListener('focus', syncDataOnline);
    } else {
        updateSyncText("Modo Local (Offline)", "offline");
    }
}

// 🗓️ Obter Data de Hoje no formato DD/MM/YYYY
function getTodayString() {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}/${m}/${y}`;
}

// 📈 RENDER DA DASHBOARD
function renderDashboard() {
    document.getElementById("today-date-badge").textContent = getTodayString();
    
    // 1. Estatísticas Rápidas
    // Total horas estudadas
    let totalMinutes = state.crono.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    document.getElementById("val-total-hours").textContent = `${hrs}h ${mins}m`;
    
    // Tópicos concluídos
    let studiedCount = state.crono.filter(c => c.studied).length;
    document.getElementById("val-total-sessions").textContent = `${studiedCount} tópicos concluídos`;
    
    // Acerto de questões
    let totalQuestions = state.crono.reduce((acc, curr) => acc + (curr.questions || 0), 0);
    let totalCorrect = state.crono.reduce((acc, curr) => acc + (curr.correct || 0), 0);
    let accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0.0;
    
    document.getElementById("val-accuracy").textContent = `${accuracy.toFixed(1)}%`;
    document.getElementById("val-total-questions").textContent = `${totalQuestions} feitas / ${totalCorrect} acertos`;
    
    // Progresso do edital
    let totalEdital = state.edital.length;
    let studiedEdital = state.edital.filter(e => e.studied).length;
    let editalPct = totalEdital > 0 ? (studiedEdital / totalEdital) * 100 : 0.0;
    
    document.getElementById("val-edital-pct").textContent = `${editalPct.toFixed(1)}%`;
    document.getElementById("val-edital-ratio").textContent = `${studiedEdital} de ${totalEdital} tópicos`;
    
    // TAF Status
    renderTafStatusDashboard();
    
    // 2. Estudos de Hoje
    renderTodayList();
    
    // 3. Gráficos
    renderCharts();
}

function renderTafStatusDashboard() {
    const valTafStatus = document.getElementById("val-taf-status");
    const valTafTrend = document.getElementById("val-taf-trend");
    
    if (state.taf_semanal.length === 0) {
        valTafStatus.textContent = "Sem Dados";
        valTafStatus.style.color = "var(--text-muted)";
        valTafTrend.textContent = "Nenhum teste registrado";
        return;
    }
    
    // Pega o último teste
    // Ordena por data (dd/mm/yyyy) para pegar o mais recente
    const sortedTaf = [...state.taf_semanal].sort((a, b) => parseDate(b.date) - parseDate(a.date));
    const lastTaf = sortedTaf[0];
    
    // Checa aprovação
    let pullPass = lastTaf.pullups >= TAF_TARGETS.pullups;
    let sugadoPass = lastTaf.meio_sugado >= TAF_TARGETS.meio_sugado;
    let abdPass = lastTaf.abdominal >= TAF_TARGETS.abdominal;
    let runPass = lastTaf.running >= TAF_TARGETS.running;
    
    let passCount = (pullPass ? 1 : 0) + (sugadoPass ? 1 : 0) + (abdPass ? 1 : 0) + (runPass ? 1 : 0);
    
    valTafStatus.textContent = `${passCount}/4 Metas`;
    
    if (passCount === 4) {
        valTafStatus.style.color = "var(--success)";
        valTafTrend.textContent = `Aprovado no teste de ${lastTaf.date}`;
    } else {
        valTafStatus.style.color = "var(--warning)";
        let pendentes = [];
        if (!pullPass) pendentes.push("Barra");
        if (!sugadoPass) pendentes.push("Sugado");
        if (!abdPass) pendentes.push("Abdo.");
        if (!runPass) pendentes.push("Corrida");
        valTafTrend.textContent = `Pendente: ${pendentes.join(", ")}`;
    }
}

function parseDate(dateStr) {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function renderTodayList() {
    const container = document.getElementById("today-studies-list");
    container.innerHTML = "";
    
    const today = getTodayString();
    const todayItems = state.crono.filter(c => c.date === today);
    
    if (todayItems.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 2rem 0; color: var(--text-muted);">
            <i class="fa-solid fa-mug-hot" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; color: var(--accent);"></i>
            Nenhuma tarefa de estudo programada para hoje.
        </div>`;
        return;
    }
    
    todayItems.forEach(item => {
        const itemIdx = state.crono.indexOf(item);
        const itemEl = document.createElement("div");
        itemEl.className = "today-item";
        
        let badgesHtml = "";
        if (item.hot) badgesHtml += `<span class="badge hot"><i class="fa-solid fa-fire"></i> Quente</span> `;
        if (item.probability === "Alta") badgesHtml += `<span class="badge priority-alta">Alta Probabilidade</span> `;
        if (item.studied) badgesHtml += `<span class="badge studied-yes"><i class="fa-solid fa-check"></i> Estudado</span>`;
        
        itemEl.innerHTML = `
            <div class="today-meta">
                <span class="today-subject">${item.subject}</span>
                <span class="today-topic">${item.topic}</span>
                <div class="today-details">
                    <span><i class="fa-solid fa-graduation-cap"></i> ${item.type}</span>
                    ${item.duration > 0 ? `<span><i class="fa-solid fa-clock"></i> ${item.duration} min</span>` : ""}
                    ${item.questions > 0 ? `<span><i class="fa-solid fa-circle-question"></i> ${item.questions} Q / ${item.correct} A</span>` : ""}
                </div>
                <div style="margin-top: 0.4rem;">${badgesHtml}</div>
            </div>
            <div class="today-actions">
                <button class="btn btn-circle btn-success" onclick="openStudyLogModal(${itemIdx}, 'crono')" title="Registrar Estudo">
                    <i class="fa-solid ${item.studied ? 'fa-pen' : 'fa-check'}"></i>
                </button>
            </div>
        `;
        container.appendChild(itemEl);
    });
}

// 🗓️ RENDER DO CRONOGRAMA
function populateCronoFilterSemanas() {
    const select = document.getElementById("filter-crono-week");
    select.innerHTML = '<option value="todas">Todas as Semanas</option>';
    
    // Obter semanas exclusivas
    const semanas = [...new Set(state.crono.map(c => c.semana))].filter(Boolean);
    
    // Ordenar semanas numericamente se possível
    semanas.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, "")) || 0;
        const numB = parseInt(b.replace(/\D/g, "")) || 0;
        return numA - numB;
    });
    
    semanas.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        select.appendChild(opt);
    });
}

function renderCronograma() {
    const container = document.getElementById("crono-weeks-list");
    container.innerHTML = "";
    
    const searchQuery = document.getElementById("search-crono").value.toLowerCase();
    const filterStatus = document.getElementById("filter-crono-status").value;
    const filterWeek = document.getElementById("filter-crono-week").value;
    
    // Agrupa crono por semana
    const cronoByWeek = {};
    state.crono.forEach((item, index) => {
        // Aplica filtros
        const matchesSearch = item.topic.toLowerCase().includes(searchQuery) || item.subject.toLowerCase().includes(searchQuery);
        const matchesStatus = filterStatus === "todos" || 
            (filterStatus === "concluido" && item.studied) || 
            (filterStatus === "pendente" && !item.studied);
        const matchesWeek = filterWeek === "todas" || item.semana === filterWeek;
        
        if (matchesSearch && matchesStatus && matchesWeek) {
            if (!cronoByWeek[item.semana]) {
                cronoByWeek[item.semana] = [];
            }
            cronoByWeek[item.semana].push({ item, index });
        }
    });
    
    const sortedWeeks = Object.keys(cronoByWeek).sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, "")) || 0;
        const numB = parseInt(b.replace(/\D/g, "")) || 0;
        return numA - numB;
    });
    
    if (sortedWeeks.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Nenhum tema encontrado nos filtros selecionados.</p>`;
        return;
    }
    
    sortedWeeks.forEach(semana => {
        const weekItems = cronoByWeek[semana];
        const totalItems = weekItems.length;
        const completedItems = weekItems.filter(w => w.item.studied).length;
        const pct = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
        
        const weekSec = document.createElement("div");
        weekSec.className = "week-section open"; // Inicia aberta por padrão
        
        weekSec.innerHTML = `
            <div class="week-header" onclick="toggleWeekSection(this)">
                <h4><i class="fa-solid fa-chevron-right"></i> ${semana}</h4>
                <div class="week-progress">
                    <span>${completedItems}/${totalItems} concluidos (${pct.toFixed(0)}%)</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            </div>
            <div class="week-body">
                <!-- Itens serão adicionados aqui -->
            </div>
        `;
        
        const weekBody = weekSec.querySelector(".week-body");
        
        weekItems.forEach(({ item, index }) => {
            const itemEl = document.createElement("div");
            itemEl.className = "today-item";
            if (item.studied) {
                itemEl.style.borderLeft = "4px solid var(--success)";
            }
            
            let badgesHtml = "";
            if (item.hot) badgesHtml += `<span class="badge hot"><i class="fa-solid fa-fire"></i> Quente</span> `;
            if (item.probability === "Alta") badgesHtml += `<span class="badge priority-alta">Alta Relevância</span> `;
            
            itemEl.innerHTML = `
                <div class="today-meta">
                    <span class="today-subject" style="font-size: 0.7rem;">${item.date} · ${item.dia} · ${item.subject}</span>
                    <span class="today-topic" style="font-size: 0.85rem;">${item.topic}</span>
                    <div class="today-details">
                        <span><i class="fa-solid fa-circle-nodes"></i> ${item.type}</span>
                        ${item.duration > 0 ? `<span><i class="fa-solid fa-clock"></i> ${item.duration} min</span>` : ""}
                        ${item.questions > 0 ? `<span><i class="fa-solid fa-circle-question"></i> ${item.questions} Q / ${item.correct} A (${(item.accuracy*100).toFixed(0)}%)</span>` : ""}
                    </div>
                    <div style="margin-top: 0.3rem;">${badgesHtml}</div>
                </div>
                <div class="today-actions">
                    <button class="btn btn-circle btn-success" onclick="openStudyLogModal(${index}, 'crono')">
                        <i class="fa-solid ${item.studied ? 'fa-pen' : 'fa-check'}"></i>
                    </button>
                </div>
            `;
            weekBody.appendChild(itemEl);
        });
        
        container.appendChild(weekSec);
    });
}

function toggleWeekSection(headerEl) {
    const section = headerEl.parentElement;
    section.classList.toggle("open");
}

// 📑 RENDER DO CONTROLE DO EDITAL
function populateEditalFilterSubjects() {
    const select = document.getElementById("filter-edital-subject");
    select.innerHTML = '<option value="todos">Todas as Matérias</option>';
    
    const subjects = [...new Set(state.edital.map(e => e.subject))].filter(Boolean);
    subjects.sort().forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        select.appendChild(opt);
    });
}

function renderEdital() {
    const body = document.getElementById("edital-table-body");
    body.innerHTML = "";
    
    const searchQuery = document.getElementById("search-edital").value.toLowerCase();
    const filterSubject = document.getElementById("filter-edital-subject").value;
    const filterStatus = document.getElementById("filter-edital-status").value;
    
    const filtered = state.edital.filter((item, index) => {
        const matchesSearch = item.topic.toLowerCase().includes(searchQuery) || item.subject.toLowerCase().includes(searchQuery);
        const matchesSubject = filterSubject === "todos" || item.subject === filterSubject;
        const matchesStatus = filterStatus === "todos" || 
            (filterStatus === "estudado" && item.studied) || 
            (filterStatus === "pendente" && !item.studied);
            
        return matchesSearch && matchesSubject && matchesStatus;
    });
    
    if (filtered.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum tópico encontrado.</td></tr>`;
        return;
    }
    
    filtered.forEach(item => {
        const globalIdx = state.edital.indexOf(item);
        const tr = document.createElement("tr");
        
        tr.innerHTML = `
            <td><strong>${item.subject}</strong></td>
            <td>${item.topic}</td>
            <td><span class="badge ${item.probability === 'Alta' ? 'priority-alta' : ''}">${item.probability}</span></td>
            <td>${item.hot ? '<span class="badge hot"><i class="fa-solid fa-fire"></i> Quente</span>' : '<span style="color:var(--text-muted)">-</span>'}</td>
            <td>
                <span style="color: ${item.studied ? 'var(--success)' : 'var(--text-muted)'}; font-weight: 600;">
                    <i class="fa-solid ${item.studied ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${item.studied ? 'Estudado' : 'Pendente'}
                </span>
            </td>
            <td>
                <button class="btn btn-circle" onclick="openStudyLogModal(${globalIdx}, 'edital')" title="Registrar/Editar Estudo">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </td>
        `;
        body.appendChild(tr);
    });
}

// 📊 RENDER DA ABA DE DESEMPENHO (TAF & SIMULADOS)
function renderDesempenho() {
    renderSimuladosTable();
    renderTafTable();
    renderCharts();
}

function renderSimuladosTable() {
    const body = document.getElementById("simulados-table-body");
    body.innerHTML = "";
    
    const sorted = [...state.simulados].sort((a, b) => b.number - a.number); // Mais recentes primeiro
    
    if (sorted.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum simulado cadastrado.</td></tr>`;
        return;
    }
    
    sorted.forEach(s => {
        const tr = document.createElement("tr");
        const totalQ = s.p1_questions + s.p2_questions;
        const totalC = s.p1_correct + s.p2_correct;
        const acc = totalQ > 0 ? (totalC / totalQ) * 100 : 0;
        
        tr.innerHTML = `
            <td><strong>Simulado ${s.number}</strong></td>
            <td>${s.date}</td>
            <td>${s.p1_correct}/${s.p1_questions}</td>
            <td>${s.p2_correct}/${s.p2_questions}</td>
            <td><strong style="color: var(--accent);">${s.score}</strong> <span style="font-size:0.75rem; color:var(--text-secondary)">(${acc.toFixed(0)}%)</span></td>
            <td>${s.duration || "-"}</td>
        `;
        body.appendChild(tr);
    });
}

function renderTafTable() {
    const body = document.getElementById("taf-table-body");
    body.innerHTML = "";
    
    const sorted = [...state.taf_semanal].sort((a, b) => parseDate(b.date) - parseDate(a.date));
    
    if (sorted.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum teste TAF cadastrado.</td></tr>`;
        return;
    }
    
    sorted.forEach(t => {
        const tr = document.createElement("tr");
        
        // Validação das metas individuais
        const pullPass = t.pullups >= TAF_TARGETS.pullups;
        const sugadoPass = t.meio_sugado >= TAF_TARGETS.meio_sugado;
        const abdPass = t.abdominal >= TAF_TARGETS.abdominal;
        const runPass = t.running >= TAF_TARGETS.running;
        
        const overallPass = pullPass && sugadoPass && abdPass && runPass;
        
        tr.innerHTML = `
            <td><strong>${t.date}</strong></td>
            <td style="color: ${pullPass ? 'var(--success)' : 'var(--danger)'}">${t.pullups} reps</td>
            <td style="color: ${sugadoPass ? 'var(--success)' : 'var(--danger)'}">${t.meio_sugado} reps</td>
            <td style="color: ${abdPass ? 'var(--success)' : 'var(--danger)'}">${t.abdominal} reps</td>
            <td style="color: ${runPass ? 'var(--success)' : 'var(--danger)'}">${t.running}m</td>
            <td>
                <span class="badge" style="background: ${overallPass ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; color: ${overallPass ? 'var(--success)' : 'var(--danger)'}; border-color: ${overallPass ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}">
                    ${overallPass ? 'Aprovado' : 'Pendente'}
                </span>
            </td>
        `;
        body.appendChild(tr);
    });
}

// 📈 CARREGAR E RENDERIZAR GRÁFICOS (CHART.JS)
function renderCharts() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDark ? "#94A3B8" : "#475569";
    
    // Chart 1: Progresso do Edital por Matéria
    const canvasSubjects = document.getElementById("chart-subjects-progress");
    if (canvasSubjects) {
        // Agrupar tópicos por matéria
        const subjectStats = {};
        state.edital.forEach(item => {
            if (!subjectStats[item.subject]) {
                subjectStats[item.subject] = { total: 0, studied: 0 };
            }
            subjectStats[item.subject].total++;
            if (item.studied) {
                subjectStats[item.subject].studied++;
            }
        });
        
        const labels = Object.keys(subjectStats);
        const dataPcts = labels.map(s => {
            const stats = subjectStats[s];
            return stats.total > 0 ? (stats.studied / stats.total) * 100 : 0;
        });
        
        if (chartSubjects) chartSubjects.destroy();
        
        chartSubjects = new Chart(canvasSubjects, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '% Estudado',
                    data: dataPcts,
                    backgroundColor: 'rgba(56, 189, 248, 0.65)',
                    borderColor: '#38BDF8',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const sub = context.label;
                                const stats = subjectStats[sub];
                                return `${context.parsed.x.toFixed(0)}% (${stats.studied}/${stats.total} tópicos)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        max: 100,
                        grid: { color: gridColor },
                        ticks: { color: textColor, callback: value => value + "%" }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    }

    // Chart 2: Evolução dos Simulados
    const canvasSimulados = document.getElementById("chart-simulados-progress");
    if (canvasSimulados) {
        const sortedSims = [...state.simulados].sort((a, b) => a.number - b.number);
        const labels = sortedSims.map(s => `Simulado ${s.number}`);
        const scores = sortedSims.map(s => s.score);
        
        if (chartSimulados) chartSimulados.destroy();
        
        chartSimulados = new Chart(canvasSimulados, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nota Final (0-120)',
                    data: scores,
                    borderColor: '#38BDF8',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    fill: true,
                    tension: 0.2,
                    borderWidth: 2,
                    pointBackgroundColor: '#38BDF8',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        min: 0,
                        max: 120,
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    }

    // Chart 3: Evolução TAF (Corrida de 12 min)
    const canvasTaf = document.getElementById("chart-taf-progress");
    if (canvasTaf) {
        const sortedTaf = [...state.taf_semanal].sort((a, b) => parseDate(a.date) - parseDate(b.date));
        const labels = sortedTaf.map(t => t.date);
        const runningDistance = sortedTaf.map(t => t.running);
        
        if (chartTaf) chartTaf.destroy();
        
        chartTaf = new Chart(canvasTaf, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Corrida (metros)',
                        data: runningDistance,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        fill: true,
                        tension: 0.1,
                        borderWidth: 2,
                        pointBackgroundColor: '#10B981',
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    }
}

// 🎛️ GERENCIADOR DOS MODAIS
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
    
    // Simulado
    document.getElementById("btn-quick-simulado").addEventListener("click", () => openModal("modal-log-simulado"));
    document.getElementById("btn-add-simulado-perf").addEventListener("click", () => openModal("modal-log-simulado"));
    document.getElementById("close-modal-simulado").addEventListener("click", () => closeModal("modal-log-simulado"));
    document.getElementById("btn-cancel-simulado").addEventListener("click", () => closeModal("modal-log-simulado"));
    document.getElementById("form-simulado-log").addEventListener("submit", handleSimuladoFormSubmit);

    // TAF
    document.getElementById("btn-quick-taf").addEventListener("click", () => openModal("modal-log-taf"));
    document.getElementById("btn-add-taf-perf").addEventListener("click", () => openModal("modal-log-taf"));
    document.getElementById("close-modal-taf").addEventListener("click", () => closeModal("modal-log-taf"));
    document.getElementById("btn-cancel-taf").addEventListener("click", () => closeModal("modal-log-taf"));
    document.getElementById("form-taf-log").addEventListener("submit", handleTafFormSubmit);

    // Registro rápido de estudo a partir da dashboard
    document.getElementById("btn-quick-study").addEventListener("click", () => {
        // Pega o primeiro item pendente do edital para registrar
        const firstPending = state.edital.find(e => !e.studied);
        if (firstPending) {
            const idx = state.edital.indexOf(firstPending);
            openStudyLogModal(idx, 'edital');
        } else {
            alert("Parabéns! Você já fechou todo o edital.");
        }
    });
}

function openModal(id) {
    document.getElementById(id).classList.add("active");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("active");
}

// 🖊️ Abertura preenchida para log de estudo
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

function handleStudyFormSubmit(e) {
    e.preventDefault();
    const index = parseInt(document.getElementById("form-study-index").value);
    const source = document.getElementById("form-study-source").value;
    
    const completed = document.getElementById("form-study-completed").value === "sim";
    const duration = parseInt(document.getElementById("form-study-duration").value) || 0;
    const questionsDone = document.getElementById("form-study-questions-done").value === "sim";
    const questions = questionsDone ? (parseInt(document.getElementById("form-study-questions").value) || 0) : 0;
    const correct = questionsDone ? (parseInt(document.getElementById("form-study-correct").value) || 0) : 0;
    const notes = document.getElementById("form-study-notes").value;
    const accuracy = questions > 0 ? (correct / questions) : 0.0;

    if (source === "crono") {
        // Atualiza cronograma
        const item = state.crono[index];
        item.studied = completed;
        item.duration = duration;
        item.questions = questions;
        item.correct = correct;
        item.accuracy = accuracy;
        item.notes = notes;
        
        // Tenta sincronizar também com o Controle do Edital
        const editalTopic = state.edital.find(e => e.subject === item.subject && e.topic === item.topic);
        if (editalTopic) {
            editalTopic.studied = completed;
        }
    } else {
        // Atualiza Controle de Edital
        const item = state.edital[index];
        item.studied = completed;
        item.notes = notes;
        
        // Sincroniza de volta com todas as ocorrências do Cronograma
        state.crono.forEach(c => {
            if (c.subject === item.subject && c.topic === item.topic) {
                c.studied = completed;
                c.duration = duration;
                c.questions = questions;
                c.correct = correct;
                c.accuracy = accuracy;
                c.notes = notes;
            }
        });
    }
    
    // Sincronização online
    if (SHEET_WEBAPP_URL) {
        const item = source === "crono" ? state.crono[index] : state.edital[index];
        if (source === "crono") {
            postToSheets("updateCrono", {
                semana: item.semana,
                day: item.day,
                subject: item.subject,
                topic: item.topic,
                studied: completed,
                duration: duration,
                questions: questions,
                correct: correct
            });
        }
        postToSheets("toggleEdital", {
            subject: item.subject,
            topic: item.topic,
            studied: completed
        });
        postToSheets("addStudy", {
            date: getTodayString(),
            subject: item.subject,
            topic: item.topic,
            type: "Estudo",
            duration: duration,
            questions: questions,
            correct: correct,
            errors: Math.max(0, questions - correct),
            notes: notes
        });
    }
    
    saveDataLocal();
    closeModal("modal-log-study");
    
    // Atualiza aba ativa
    const activeTab = document.querySelector(".menu-item.active").getAttribute("data-tab");
    if (activeTab === "dashboard") renderDashboard();
    else if (activeTab === "cronograma") renderCronograma();
    else if (activeTab === "edital") renderEdital();
}

function handleSimuladoFormSubmit(e) {
    e.preventDefault();
    
    const newSim = {
        number: parseInt(document.getElementById("form-sim-num").value),
        date: formatDateInput(document.getElementById("form-sim-date").value),
        p1_questions: parseInt(document.getElementById("form-sim-p1-q").value) || 0,
        p1_correct: parseInt(document.getElementById("form-sim-p1-c").value) || 0,
        p2_questions: parseInt(document.getElementById("form-sim-p2-q").value) || 0,
        p2_correct: parseInt(document.getElementById("form-sim-p2-c").value) || 0,
        score: parseFloat(document.getElementById("form-sim-score").value) || 0.0,
        duration: document.getElementById("form-sim-duration").value,
        notes: ""
    };
    
    // Evitar número duplicado de simulado
    state.simulados = state.simulados.filter(s => s.number !== newSim.number);
    state.simulados.push(newSim);
    
    // Sincronização online
    if (SHEET_WEBAPP_URL) {
        postToSheets("addSimulado", {
            number: newSim.number,
            date: newSim.date,
            p1_questions: newSim.p1_questions,
            p1_correct: newSim.p1_correct,
            p2_questions: newSim.p2_questions,
            p2_correct: newSim.p2_correct,
            score: newSim.score,
            duration: newSim.duration,
            notes: newSim.notes
        });
    }
    
    saveDataLocal();
    closeModal("modal-log-simulado");
    
    document.getElementById("form-simulado-log").reset();
    
    const activeTab = document.querySelector(".menu-item.active").getAttribute("data-tab");
    if (activeTab === "dashboard") renderDashboard();
    else if (activeTab === "desempenho") renderDesempenho();
}

function handleTafFormSubmit(e) {
    e.preventDefault();
    
    const newTaf = {
        date: formatDateInput(document.getElementById("form-taf-date").value),
        pullups: parseInt(document.getElementById("form-taf-pullups").value) || 0,
        meio_sugado: parseInt(document.getElementById("form-taf-sugado").value) || 0,
        abdominal: parseInt(document.getElementById("form-taf-abdominal").value) || 0,
        running: parseInt(document.getElementById("form-taf-running").value) || 0,
        status: "",
        notes: ""
    };
    
    // Checa aprovação
    const pullPass = newTaf.pullups >= TAF_TARGETS.pullups;
    const sugadoPass = newTaf.meio_sugado >= TAF_TARGETS.meio_sugado;
    const abdPass = newTaf.abdominal >= TAF_TARGETS.abdominal;
    const runPass = newTaf.running >= TAF_TARGETS.running;
    newTaf.status = (pullPass && sugadoPass && abdPass && runPass) ? "Aprovado" : "Pendente";
    
    // Evitar data duplicada
    state.taf_semanal = state.taf_semanal.filter(t => t.date !== newTaf.date);
    state.taf_semanal.push(newTaf);
    
    // Sincronização online
    if (SHEET_WEBAPP_URL) {
        postToSheets("addTAF", {
            date: newTaf.date,
            pullups: newTaf.pullups,
            meio_sugado: newTaf.meio_sugado,
            abdominal: newTaf.abdominal,
            running: newTaf.running
        });
    }
    
    saveDataLocal();
    closeModal("modal-log-taf");
    
    document.getElementById("form-taf-log").reset();
    
    const activeTab = document.querySelector(".menu-item.active").getAttribute("data-tab");
    if (activeTab === "dashboard") renderDashboard();
    else if (activeTab === "desempenho") renderDesempenho();
}

function formatDateInput(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-"); // YYYY-MM-DD
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// ==========================================================================
// 📚 LÓGICA DA ABA DE REVISÃO SEMANAL & CADERNO DE ERROS (QG V2)
// ==========================================================================

let bancoQuestoes = [];
let bancoQuestoesLoaded = false;
let revisaoState = {
    questions: [],
    currentIndex: 0,
    mode: "estudo",
    answers: [],
    timer: null,
    seconds: 0,
    paused: false,
    selectedWeek: "",
    selectedTopics: []
};

// Inicialização da aba de Revisão Semanal
function initRevisaoTab() {
    // 1. Mostrar a tela de configuração por padrão
    showRevisaoScreen("setup");
    
    // 2. Verificar se há simulado pausado
    checkPausedRevisao();

    // 3. Configurar listeners dos botões de controle
    document.getElementById("revisao-select-all-btn").onclick = () => toggleAllRevisaoCheckboxes(true);
    document.getElementById("revisao-clear-all-btn").onclick = () => toggleAllRevisaoCheckboxes(false);
    document.getElementById("revisao-start-btn").onclick = () => startRevisao(false);
    document.getElementById("revisao-resume-btn").onclick = () => startRevisao(true);
    document.getElementById("revisao-quiz-pause-btn").onclick = revisaoPauseAndSave;
    document.getElementById("revisao-btn-certo").onclick = () => revisaoAnswer("c");
    document.getElementById("revisao-btn-errado").onclick = () => revisaoAnswer("e");
    document.getElementById("revisao-btn-next").onclick = revisaoNextQuestion;
    document.getElementById("revisao-btn-abort").onclick = () => {
        if (confirm("Deseja mesmo descartar os resultados deste simulado? Eles não serão salvos.")) {
            showRevisaoScreen("setup");
            checkPausedRevisao();
        }
    };
    document.getElementById("revisao-btn-save-results").onclick = revisaoSaveResults;
    
    // 4. Configurar listener de mudança de semana
    const weekSelect = document.getElementById("revisao-week-select");
    weekSelect.onchange = (e) => {
        populateRevisaoTopics(e.target.value);
    };

    // 5. Carregar banco de questões se ainda não foi carregado
    if (!bancoQuestoesLoaded) {
        loadBancoQuestoes();
    } else {
        populateRevisaoWeeks();
    }
}

// Carregar o banco de questões de forma assíncrona
async function loadBancoQuestoes() {
    const container = document.getElementById("revisao-topics-container");
    const originalHtml = container.innerHTML;
    
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--accent);">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
            <p>Carregando banco de dados de questões (7.008 itens)...</p>
        </div>
    `;
    
    try {
        const response = await fetch("banco_questoes.json");
        if (response.ok) {
            bancoQuestoes = await response.json();
            bancoQuestoesLoaded = true;
            console.log(`Carregado banco com ${bancoQuestoes.length} questões.`);
            container.innerHTML = originalHtml;
            populateRevisaoWeeks();
        } else {
            container.innerHTML = `<p style="color: var(--danger);">Erro ao carregar o banco de questões (JSON não encontrado).</p>`;
        }
    } catch (err) {
        console.error("Erro ao carregar banco de questões:", err);
        container.innerHTML = `<p style="color: var(--danger);">Erro na conexão ao carregar o banco de questões.</p>`;
    }
}

// Preencher o select de semanas
function populateRevisaoWeeks() {
    const select = document.getElementById("revisao-week-select");
    select.innerHTML = '<option value="">Selecione uma semana...</option>';
    
    // Extrai semanas únicas do cronograma
    const weeks = [...new Set(state.crono.map(c => c.semana))].filter(Boolean);
    
    // Ordenar semanas numericamente
    weeks.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, "")) || 0;
        const numB = parseInt(b.replace(/\D/g, "")) || 0;
        return numA - numB;
    });
    
    weeks.forEach(w => {
        const opt = document.createElement("option");
        opt.value = w;
        opt.textContent = w;
        select.appendChild(opt);
    });
}

// Preencher os tópicos da semana selecionada
function populateRevisaoTopics(semana) {
    const container = document.getElementById("revisao-topics-list");
    const setupMsg = document.getElementById("revisao-topics-container").querySelector("p");
    
    if (!semana) {
        container.innerHTML = "";
        if (setupMsg) setupMsg.style.display = "block";
        return;
    }
    
    if (setupMsg) setupMsg.style.display = "none";
    container.innerHTML = "";
    
    // Extrai os tópicos agendados para a semana selecionada no cronograma
    const weekItems = state.crono.filter(c => c.semana === semana && c.subject !== "TAF (Físico)" && c.subject !== "DESCANSO" && c.subject !== "REVISÃO SEMANAL");
    
    if (weekItems.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tema de estudo agendado para esta semana.</p>`;
        return;
    }
    
    // Remove duplicatas de matérias/tópicos na semana
    const uniqueTopics = [];
    const seen = new Set();
    weekItems.forEach(item => {
        const key = `${item.subject}|||${item.topic}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueTopics.push({ subject: item.subject, topic: item.topic });
        }
    });

    // Helpers de normalização para o contador de questões
    const cleanText = (text) => {
        if (!text) return "";
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const getKeywords = (text) => {
        const cleaned = cleanText(text);
        const words = cleaned.match(/[a-z0-9]{3,}/g) || [];
        const stops = new Set(["para", "como", "mais", "seus", "suas", "pela", "pelo", "esse", "essa", "esta", "este", "sobre", "uma", "com", "dos", "das"]);
        return words.filter(w => !stops.has(w));
    };

    // Renderiza a lista de tópicos com checkboxes e badges de contagem de questões
    uniqueTopics.forEach((t, i) => {
        // Conta quantas questões existem no banco para este tema específico usando keyword overlap
        let count = 0;
        if (bancoQuestoesLoaded) {
            const tSubjClean = cleanText(t.subject);
            const tKeywords = getKeywords(t.topic);
            
            count = bancoQuestoes.filter(q => {
                const qSubj = cleanText(q.subject);
                let subjectMatches = qSubj === tSubjClean;
                // Remapeia se for informática/legislação
                if ((tSubjClean.includes("legisla") || tSubjClean.includes("informa")) && qSubj === "legislacao institucional") {
                    subjectMatches = true;
                }
                if ((tSubjClean.includes("legisla") || tSubjClean.includes("informa")) && qSubj === "noções de informática") {
                    subjectMatches = true;
                }
                
                if (subjectMatches) {
                    const qTextClean = cleanText(q.statement + " " + (q.topic || ""));
                    const qWords = new Set(qTextClean.match(/[a-z0-9]{3,}/g) || []);
                    const overlap = tKeywords.filter(w => qWords.has(w));
                    return overlap.length >= 1;
                }
                return false;
            }).length;
        }

        const itemEl = document.createElement("div");
        itemEl.className = "revisao-checklist-item";
        itemEl.innerHTML = `
            <input type="checkbox" id="topic-chk-${i}" data-subject="${t.subject}" data-topic="${t.topic}" checked>
            <div class="revisao-checklist-item-details" onclick="document.getElementById('topic-chk-${i}').click(); event.stopPropagation();">
                <span class="revisao-checklist-item-title">${t.topic}</span>
                <span class="revisao-checklist-item-subject">${t.subject}</span>
            </div>
            <div class="revisao-checklist-item-qty" style="display: flex; align-items: center; gap: 6px;">
                <label style="font-size: 0.75rem; color: var(--text-muted);">Qtd:</label>
                <input type="number" id="topic-qty-${i}" class="revisao-topic-qty-input" min="0" max="${count}" value="${Math.min(count, 5)}" style="width: 50px; background: rgba(0,0,0,0.3); border: 1px solid rgba(216,176,76,0.3); color: white; border-radius: 6px; padding: 4px; text-align: center; font-size: 0.85rem;" onclick="event.stopPropagation();">
                <span class="revisao-checklist-item-badge">de ${count}</span>
            </div>
        `;
        
        // Listener para evitar que o clique no checkbox cause dupla ação se clicado no elemento pai
        itemEl.querySelector('input').onclick = (e) => e.stopPropagation();
        
        container.appendChild(itemEl);
    });
}

// Alternar todos os tópicos
function toggleAllRevisaoCheckboxes(checked) {
    const list = document.getElementById("revisao-topics-list");
    const checkboxes = list.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(chk => chk.checked = checked);
}

// Verificar se há revisão pausada localmente
function checkPausedRevisao() {
    const paused = localStorage.getItem("pmma_paused_revisao");
    const card = document.getElementById("revisao-resume-card");
    
    if (paused) {
        try {
            const data = JSON.parse(paused);
            document.getElementById("revisao-resume-info").textContent = `Você possui uma revisão pausada de ${data.questions.length} questões (${data.currentIndex + 1}ª questão, com ${Math.floor(data.seconds / 60)}m ${data.seconds % 60}s).`;
            card.style.display = "block";
        } catch (e) {
            localStorage.removeItem("pmma_paused_revisao");
            card.style.display = "none";
        }
    } else {
        card.style.display = "none";
    }
}

// Alternar telas de revisão
function showRevisaoScreen(screen) {
    document.querySelectorAll(".revisao-screen").forEach(s => s.style.display = "none");
    document.getElementById(`revisao-${screen}-screen`).style.display = "block";
}

// Iniciar ou retomar a revisão
function startRevisao(resumeFromPaused) {
    if (resumeFromPaused) {
        const pausedData = localStorage.getItem("pmma_paused_revisao");
        if (pausedData) {
            try {
                revisaoState = JSON.parse(pausedData);
                revisaoState.paused = false;
                showRevisaoScreen("quiz");
                renderRevisaoQuestion();
                revisaoStartTimer();
                return;
            } catch (e) {
                console.error("Erro ao carregar dados pausados:", e);
                localStorage.removeItem("pmma_paused_revisao");
            }
        }
    }
    
    // Novo Simulado
    const selectedWeek = document.getElementById("revisao-week-select").value;
    if (!selectedWeek) {
        alert("Por favor, selecione uma semana do cronograma.");
        return;
    }
    
    const checkboxes = document.getElementById("revisao-topics-list").querySelectorAll("input[type='checkbox']");
    const selectedTopics = [];
    const finalQuestions = [];
    
    // Helpers de normalização e filtragem
    const cleanText = (text) => {
        if (!text) return "";
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const getKeywords = (text) => {
        const cleaned = cleanText(text);
        const words = cleaned.match(/[a-z0-9]{3,}/g) || [];
        const stops = new Set(["para", "como", "mais", "seus", "suas", "pela", "pelo", "esse", "essa", "esta", "este", "sobre", "uma", "com", "dos", "das"]);
        return words.filter(w => !stops.has(w));
    };

    const cebraspeOnly = document.getElementById("revisao-cebraspe-only").checked;
    const errorsOnly = document.getElementById("revisao-errors-only").checked;
    const excludeAnswered = document.getElementById("revisao-exclude-answered").checked;
    const errIds = new Set(state.erros_questoes || []);
    const answeredIds = new Set(state.respondidas_questoes || []);

    checkboxes.forEach((chk, i) => {
        if (!chk.checked) return;
        
        const subj = chk.getAttribute("data-subject");
        const topic = chk.getAttribute("data-topic");
        const qty = parseInt(document.getElementById(`topic-qty-${i}`).value) || 0;
        
        if (qty === 0) return;
        
        selectedTopics.push({ subject: subj, topic: topic });
        
        // Filtra questões do banco para ESTE tópico específico
        let topicPool = bancoQuestoes.filter(q => {
            const qSubj = cleanText(q.subject);
            const tSubjClean = cleanText(subj);
            let subjectMatches = qSubj === tSubjClean;
            if ((tSubjClean.includes("legisla") || tSubjClean.includes("informa")) && qSubj === "legislacao institucional") {
                subjectMatches = true;
            }
            if ((tSubjClean.includes("legisla") || tSubjClean.includes("informa")) && qSubj === "noções de informática") {
                subjectMatches = true;
            }
            
            if (subjectMatches) {
                const qTextClean = cleanText(q.statement + " " + (q.topic || ""));
                const qWords = new Set(qTextClean.match(/[a-z0-9]{3,}/g) || []);
                const tKeywords = getKeywords(topic);
                const overlap = tKeywords.filter(w => qWords.has(w));
                return overlap.length >= 1;
            }
            return false;
        });
        
        // Aplica os filtros gerais de Cebraspe e Erros
        if (cebraspeOnly) {
            topicPool = topicPool.filter(q => {
                const isLeg = q.id.startsWith("Q-LEG");
                const isCespeInfo = q.info && (q.info.toUpperCase().includes("CESPE") || q.info.toUpperCase().includes("CEBRASPE"));
                const isCespeComment = q.comment && (q.comment.toUpperCase().includes("CESPE") || q.comment.toUpperCase().includes("CEBRASPE"));
                return isLeg || isCespeInfo || isCespeComment;
            });
        }
        
        if (errorsOnly) {
            topicPool = topicPool.filter(q => errIds.has(q.id));
        }
        
        if (excludeAnswered) {
            topicPool = topicPool.filter(q => !answeredIds.has(q.id));
        }
        
        // Randomiza e fatia na quantidade selecionada
        const shuffledTopicPool = topicPool.sort(() => 0.5 - Math.random());
        const selectedForTopic = shuffledTopicPool.slice(0, qty);
        
        // Junta na lista geral de questões sem duplicar
        selectedForTopic.forEach(q => {
            if (!finalQuestions.some(existing => existing.id === q.id)) {
                finalQuestions.push(q);
            }
        });
    });
    
    if (selectedTopics.length === 0) {
        alert("Por favor, marque pelo menos um tema de revisão e defina uma quantidade maior que zero.");
        return;
    }
    
    if (finalQuestions.length === 0) {
        alert("Nenhuma questão foi encontrada no banco com as opções e quantidades selecionadas. Tente alterar as quantidades ou desmarcar a opção 'Apenas CEBRASPE' / 'Focar em Questões Erradas'.");
        return;
    }
    
    // Configurar estado
    revisaoState = {
        questions: finalQuestions.sort(() => 0.5 - Math.random()), // Mistura final das matérias selecionadas
        currentIndex: 0,
        mode: document.getElementById("revisao-mode-select").value,
        answers: new Array(finalQuestions.length).fill(null),
        timer: null,
        seconds: 0,
        paused: false,
        selectedWeek: selectedWeek,
        selectedTopics: selectedTopics
    };
    
    // Ir para tela de execução
    showRevisaoScreen("quiz");
    renderRevisaoQuestion();
    revisaoStartTimer();
}

// Iniciar cronômetro do quiz
function revisaoStartTimer() {
    if (revisaoState.timer) clearInterval(revisaoState.timer);
    
    const timerEl = document.getElementById("revisao-quiz-timer");
    revisaoState.timer = setInterval(() => {
        if (!revisaoState.paused) {
            revisaoState.seconds++;
            const mins = String(Math.floor(revisaoState.seconds / 60)).padStart(2, '0');
            const secs = String(revisaoState.seconds % 60).padStart(2, '0');
            timerEl.textContent = `${mins}:${secs}`;
        }
    }, 1000);
}

// Renderizar questão atual no quiz
function renderRevisaoQuestion() {
    const q = revisaoState.questions[revisaoState.currentIndex];
    
    // Atualizar indicador de progresso
    document.getElementById("revisao-quiz-progress").textContent = `Questão ${revisaoState.currentIndex + 1} de ${revisaoState.questions.length}`;
    
    // Ocultar metadados e gabarito comentados
    document.getElementById("revisao-quiz-meta").style.display = "none";
    document.getElementById("revisao-quiz-feedback").style.display = "none";
    document.getElementById("revisao-quiz-nav").style.display = "none";
    
    // Habilitar botões Certo/Errado
    document.getElementById("revisao-quiz-actions").style.display = "grid";
    document.getElementById("revisao-btn-certo").disabled = false;
    document.getElementById("revisao-btn-errado").disabled = false;
    
    // Atualizar matéria no topo
    document.getElementById("revisao-quiz-subject-header").textContent = q.subject;
    
    // Renderizar Texto associado se houver (procura por "Texto para" ou delimitadores)
    const textAssociatedBox = document.getElementById("revisao-quiz-text-associated");
    
    // Algumas questões têm enunciados complexos. Se encontrarmos tags de imagem ou quebras de texto que indicam texto base, organizamos
    let stmt = q.statement;
    let textAssociated = "";
    
    // Se o enunciado contiver uma situação hipotética identificada
    if (stmt.toLowerCase().includes("situação hipotética:")) {
        const parts = stmt.split(/situação hipotética:/i);
        textAssociated = `<strong>Situação Hipotética:</strong> ${parts[1].split(/assertiva:|assertivas:|julgue o item:|acerca desse assunto/i)[0].trim()}`;
        
        // Reconstrói a assertiva
        const assertivaParts = stmt.split(/assertiva:|assertivas:|julgue o item:/i);
        stmt = assertivaParts.length > 1 ? `<strong>Assertiva:</strong> ${assertivaParts[1].trim()}` : stmt;
    }
    
    if (textAssociated) {
        textAssociatedBox.innerHTML = textAssociated;
        textAssociatedBox.style.display = "block";
    } else {
        textAssociatedBox.style.display = "none";
    }
    
    // Renderizar o enunciado
    document.getElementById("revisao-quiz-statement").innerHTML = stmt;
    
    // Se já respondeu (caso de retomada ou navegação)
    const savedAnswer = revisaoState.answers[revisaoState.currentIndex];
    if (savedAnswer) {
        showRevisaoFeedback(savedAnswer.choice);
    }
}

// Processar a resposta do usuário
function revisaoAnswer(userChoice) {
    const q = revisaoState.questions[revisaoState.currentIndex];
    const isCorrect = userChoice === q.answer;
    
    const ansRecord = {
        choice: userChoice,
        ok: isCorrect
    };
    
    revisaoState.answers[revisaoState.currentIndex] = ansRecord;
    
    // Registra a questão como respondida
    if (!state.respondidas_questoes.includes(q.id)) {
        state.respondidas_questoes.push(q.id);
    }
    
    // Gerenciador do Caderno de Erros baseado nos IDs das questões
    if (!isCorrect) {
        // Adiciona à lista de erros se já não estiver lá
        if (!state.erros_questoes.includes(q.id)) {
            state.erros_questoes.push(q.id);
        }
    } else {
        // Remove da lista de erros ao acertar
        state.erros_questoes = state.erros_questoes.filter(id => id !== q.id);
    }
    saveDataLocal(); // Salva estado de erros e respondidas do usuário
    
    // Desabilitar botões
    document.getElementById("revisao-btn-certo").disabled = true;
    document.getElementById("revisao-btn-errado").disabled = true;
    
    if (revisaoState.mode === "estudo") {
        showRevisaoFeedback(userChoice);
    } else {
        // No Modo Simulado: avança automaticamente ou finaliza sem dar pistas
        setTimeout(() => {
            revisaoNextQuestion();
        }, 300);
    }
}

// Exibir o feedback no Modo Estudo
function showRevisaoFeedback(userChoice) {
    const q = revisaoState.questions[revisaoState.currentIndex];
    const isCorrect = userChoice === q.answer;
    
    // Preencher metadados revelados
    const metaContainer = document.getElementById("revisao-quiz-meta");
    metaContainer.innerHTML = `
        <span class="revisao-meta-tag accent"><i class="fa-solid fa-tag"></i> ${q.topic || 'Geral'}</span>
        ${q.document ? `<span class="revisao-meta-tag"><i class="fa-solid fa-file-lines"></i> ${q.document}</span>` : ''}
        ${q.info ? `<span class="revisao-meta-tag"><i class="fa-solid fa-building"></i> ${q.info}</span>` : ''}
    `;
    metaContainer.style.display = "flex";
    
    // Configurar card de feedback
    const feedbackPanel = document.getElementById("revisao-quiz-feedback");
    const statusEl = document.getElementById("revisao-feedback-status");
    const answerEl = document.getElementById("revisao-feedback-answer");
    const commentEl = document.getElementById("revisao-feedback-comment");
    const trapBox = document.getElementById("revisao-feedback-trap");
    const trapTextEl = document.getElementById("revisao-feedback-trap-text");
    
    feedbackPanel.className = "revisao-feedback-panel " + (isCorrect ? "correct" : "wrong");
    statusEl.innerHTML = isCorrect ? '✅ Você Acertou! <i class="fa-solid fa-circle-check"></i>' : '❌ Você Errou! <i class="fa-solid fa-circle-xmark"></i>';
    answerEl.textContent = q.answer === "c" ? "Certo" : "Errado";
    commentEl.innerHTML = q.comment || "Sem comentários adicionais cadastrados.";
    
    // Lógica para detectar pegadinhas de forma inteligente no comentário
    const keywordsTrap = ["cuidado", "pegadinha", "atencao", "alerta", "restr", "unico", "exclusiv", "sempre", "nunca", "apenas"];
    const normalizedComment = commentEl.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    let isTrapDetected = keywordsTrap.some(kw => normalizedComment.includes(kw));
    
    if (isTrapDetected) {
        let sentenceTrap = "Cuidado com termos restritivos (único, exclusivamente, apenas) ou negações. A banca costuma usá-los para invalidar assertivas.";
        
        // Tenta isolar a frase específica do comentário que fala sobre cuidado/pegadinha
        const sentences = q.comment.split(/[.!?]/);
        const matchSentence = sentences.find(s => {
            const normalizedSentence = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return keywordsTrap.some(kw => normalizedSentence.includes(kw));
        });
        
        if (matchSentence && matchSentence.trim().length > 10) {
            sentenceTrap = matchSentence.trim() + ".";
        }
        
        trapTextEl.textContent = sentenceTrap;
        trapBox.style.display = "block";
    } else {
        trapBox.style.display = "none";
    }
    
    feedbackPanel.style.display = "block";
    
    // Ocultar botões Certo/Errado e mostrar Avançar
    document.getElementById("revisao-quiz-actions").style.display = "none";
    document.getElementById("revisao-quiz-nav").style.display = "flex";
}

// Avançar ou terminar o quiz
function revisaoNextQuestion() {
    if (revisaoState.currentIndex < revisaoState.questions.length - 1) {
        revisaoState.currentIndex++;
        
        // Salvar estado intermediário da revisão para retomar depois
        localStorage.setItem("pmma_paused_revisao", JSON.stringify(revisaoState));
        
        renderRevisaoQuestion();
    } else {
        revisaoShowResults();
    }
}

// Pausar e Salvar estado no localStorage
function revisaoPauseAndSave() {
    if (revisaoState.timer) clearInterval(revisaoState.timer);
    revisaoState.paused = true;
    
    localStorage.setItem("pmma_paused_revisao", JSON.stringify(revisaoState));
    
    alert("Simulado de revisão pausado com sucesso! Você poderá retomá-lo a qualquer momento nesta aba.");
    showRevisaoScreen("setup");
    checkPausedRevisao();
}

// Exibir tela de resultados
function revisaoShowResults() {
    if (revisaoState.timer) clearInterval(revisaoState.timer);
    
    // Remove o estado de pausa porque foi concluído
    localStorage.removeItem("pmma_paused_revisao");
    
    showRevisaoScreen("result");
    
    // Cálculos
    const total = revisaoState.questions.length;
    const correct = revisaoState.answers.filter(ans => ans && ans.ok).length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    
    const mins = String(Math.floor(revisaoState.seconds / 60)).padStart(2, '0');
    const secs = String(revisaoState.seconds % 60).padStart(2, '0');
    const timeStr = `${mins}:${secs}`;
    
    // Atualizar HTML
    document.getElementById("revisao-res-total").textContent = total;
    document.getElementById("revisao-res-correct").textContent = correct;
    document.getElementById("revisao-res-accuracy").textContent = `${accuracy.toFixed(1)}%`;
    document.getElementById("revisao-res-time").textContent = timeStr;
    
    // Configurações de checkbox padrão
    document.getElementById("revisao-save-crono").checked = true;
    document.getElementById("revisao-save-simulado").checked = accuracy >= 50; // Recomenda salvar no histórico se obteve nota razoável
    
    // Renderizar revisão de questões de prova detalhada
    const reviewList = document.getElementById("revisao-review-list");
    reviewList.innerHTML = "";
    
    revisaoState.questions.forEach((q, idx) => {
        const ans = revisaoState.answers[idx];
        const isCorrect = ans && ans.ok;
        
        const reviewItem = document.createElement("div");
        reviewItem.className = `revisao-review-item ${isCorrect ? 'correct' : 'wrong'}`;
        
        // Verifica se há pegadinha
        const keywordsTrap = ["cuidado", "pegadinha", "atencao", "alerta", "restr", "unico", "exclusiv", "sempre", "nunca", "apenas"];
        const normalizedComment = (q.comment || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let isTrapDetected = keywordsTrap.some(kw => normalizedComment.includes(kw));
        
        reviewItem.innerHTML = `
            <div class="revisao-review-item-header">
                <span>Matéria: ${q.subject} · Assunto: ${q.topic || 'Geral'}</span>
                <span style="font-weight: 700; color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}">
                    ${isCorrect ? 'Acertou' : 'Errou'} (Sua resposta: ${ans ? (ans.choice === 'c' ? 'Certo' : 'Errado') : 'Sem resposta'})
                </span>
            </div>
            <div class="revisao-review-item-statement">
                ${q.statement}
            </div>
            <div class="revisao-review-item-explanation">
                <strong>Gabarito Oficial:</strong> <span style="text-transform: uppercase; font-weight: 700;">${q.answer === 'c' ? 'Certo' : 'Errado'}</span><br>
                <strong>Comentário:</strong> ${q.comment || 'Sem comentários.'}
                
                ${isTrapDetected ? `
                    <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(245, 158, 11, 0.05); border-left: 2px solid var(--warning); border-radius: 4px; color: #FFE08A; font-size: 0.85rem;">
                        <strong>⚠️ Atenção à Pegadinha Cebraspe presente neste tema!</strong>
                    </div>
                ` : ''}
            </div>
        `;
        reviewList.appendChild(reviewItem);
    });
}

// Gravar resultados e atualizar estatísticas
function revisaoSaveResults() {
    const total = revisaoState.questions.length;
    const correct = revisaoState.answers.filter(ans => ans && ans.ok).length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    
    const saveCrono = document.getElementById("revisao-save-crono").checked;
    const saveSimulado = document.getElementById("revisao-save-simulado").checked;
    
    // 1. Gravar progresso de estudos no Cronograma
    if (saveCrono) {
        // Encontra os temas correspondentes no cronograma e atualiza
        revisaoState.selectedTopics.forEach(t => {
            state.crono.forEach(c => {
                if (c.semana === revisaoState.selectedWeek && c.subject === t.subject && c.topic === t.topic) {
                    c.studied = true;
                    // Divide o tempo total e os acertos de forma proporcional/acumulada
                    const minutesFraction = Math.max(1, Math.round((revisaoState.seconds / 60) / revisaoState.selectedTopics.length));
                    const questionsFraction = Math.max(1, Math.round(total / revisaoState.selectedTopics.length));
                    const correctFraction = Math.round(correct / revisaoState.selectedTopics.length);
                    
                    c.duration = (c.duration || 0) + minutesFraction;
                    c.questions = (c.questions || 0) + questionsFraction;
                    c.correct = (c.correct || 0) + correctFraction;
                    c.accuracy = c.questions > 0 ? (c.correct / c.questions) : 0;
                }
            });
        });
    }
    
    // 2. Gravar no Histórico de Simulados
    if (saveSimulado) {
        const simNum = state.simulados.length + 1;
        const mins = String(Math.floor(revisaoState.seconds / 60)).padStart(2, '0');
        const secs = String(revisaoState.seconds % 60).padStart(2, '0');
        
        const newSim = {
            number: simNum,
            date: getTodayString(),
            p1_questions: total,
            p1_correct: correct,
            p2_questions: 0,
            p2_correct: 0,
            score: correct - (total - correct), // Pontuação líquida (padrão Cebraspe)
            duration: `00:${mins}:${secs}`,
            notes: `Revisão Semanal (${revisaoState.selectedWeek})`
        };
        state.simulados.push(newSim);
    }
    
    // 3. Persistir dados localmente
    saveDataLocal();
    
    // 4. Re-sinalizar sucesso e voltar para setup
    alert("Resultados salvos e estatísticas de estudo atualizadas com sucesso!");
    
    showRevisaoScreen("setup");
    checkPausedRevisao();
    
    // Atualizar dados de interface gerais
    renderDashboard();
}

// Sincronização em background de simulados finalizados em abas externas
function checkPendingSimulados() {
    const pendingData = localStorage.getItem("pmma_pending_simulado_results");
    if (pendingData) {
        try {
            const results = JSON.parse(pendingData);
            if (results && results.length > 0) {
                // Efeito visual no rodapé - sincronizando
                const syncStatus = document.getElementById("sync-status");
                const syncText = document.getElementById("sync-text");
                const syncIcon = syncStatus?.querySelector("i");
                
                if (syncStatus) {
                    syncStatus.className = "sync-badge synching";
                    if (syncText) syncText.textContent = "Sincronizando Simulados...";
                    if (syncIcon) syncIcon.className = "fa-solid fa-rotate fa-spin";
                }
                
                // Processar cada simulado finalizado
                results.forEach(res => {
                    const simNum = state.simulados.length + 1;
                    const newSim = {
                        number: simNum,
                        date: res.date,
                        p1_questions: res.answered,
                        p1_correct: res.correct,
                        p2_questions: 0,
                        p2_correct: 0,
                        score: res.score,
                        duration: res.duration.startsWith("00:") ? res.duration : `00:${res.duration}`,
                        notes: `Simulado: ${res.name.split("-")[1]?.trim() || res.name}`
                    };
                    
                    // Impedir duplicados idênticos em timestamps muito próximos
                    const isDup = state.simulados.some(s => s.date === newSim.date && s.notes === newSim.notes && s.score === newSim.score);
                    if (!isDup) {
                        state.simulados.push(newSim);
                        
                        // Atualizar estatísticas da matéria no cronograma
                        const subjectName = "Legislação Institucional";
                        let searchStr = "";
                        if (res.name.toLowerCase().includes("estatuto")) {
                            searchStr = "Estatuto";
                        } else if (res.name.toLowerCase().includes("lob") || res.name.toLowerCase().includes("12896")) {
                            searchStr = "LOB";
                        } else if (res.name.toLowerCase().includes("14751") || res.name.toLowerCase().includes("orgânica")) {
                            searchStr = "Orgânica";
                        }
                        
                        if (searchStr) {
                            state.crono.forEach(c => {
                                if (c.subject === subjectName && c.topic.toLowerCase().includes(searchStr.toLowerCase())) {
                                    c.studied = true;
                                    c.questions = (c.questions || 0) + res.answered;
                                    c.correct = (c.correct || 0) + res.correct;
                                    c.accuracy = c.questions > 0 ? (c.correct / c.questions) : 0;
                                }
                            });
                        }
                        
                        // Registra as 50 questões do simulado externo como respondidas
                        let prefix = "";
                        if (res.name.toLowerCase().includes("estatuto")) prefix = "ESTATUTO";
                        else if (res.name.toLowerCase().includes("lob") || res.name.toLowerCase().includes("12896")) prefix = "LOB";
                        else if (res.name.toLowerCase().includes("14751") || res.name.toLowerCase().includes("orgânica")) prefix = "LORGANICA";
                        
                        if (prefix) {
                            for (let n = 1; n <= 50; n++) {
                                const qId = `Q-LEG-${prefix}-${String(n).padStart(4, '0')}`;
                                if (!state.respondidas_questoes.includes(qId)) {
                                    state.respondidas_questoes.push(qId);
                                }
                            }
                        }
                    }
                });
                
                // Salvar estado
                saveDataLocal();
                
                // Limpar fila
                localStorage.removeItem("pmma_pending_simulado_results");
                
                // Finalizar animação e alterar para sincronizado
                setTimeout(() => {
                    if (syncStatus) {
                        syncStatus.className = "sync-badge synced";
                        if (syncText) syncText.textContent = "Dados Sincronizados";
                        if (syncIcon) syncIcon.className = "fa-solid fa-circle-check";
                        
                        // Reverter para o padrão após 3 segundos
                        setTimeout(() => {
                            if (syncText) syncText.textContent = "Plano Ativo (V2)";
                            if (syncIcon) syncIcon.className = "fa-solid fa-file-invoice";
                        }, 3000);
                    }
                }, 1500);
                
                // Recarregar os dashboards/gráficos se o usuário estiver nas telas correspondentes
                const activeTab = document.querySelector(".menu-item.active")?.getAttribute("data-tab");
                if (activeTab === "dashboard") renderDashboard();
                else if (activeTab === "desempenho") renderDesempenho();
            }
        } catch (e) {
            console.error("Erro ao sincronizar simulados pendentes:", e);
        }
    }
}

// ==========================================================================
// ☁️ INTEGRAÇÃO ONLINE COM GOOGLE SHEETS (SINC AUTOMÁTICA PC/CELULAR)
// ==========================================================================

let SHEET_WEBAPP_URL = localStorage.getItem("pmma_webapp_url") || "";

function initSheetsConfigListeners() {
    const gearBtn = document.getElementById("btn-config-sheets");
    const modal = document.getElementById("modal-config-sheets");
    const closeBtn = document.getElementById("close-modal-sheets");
    const cancelBtn = document.getElementById("btn-cancel-sheets");
    const form = document.getElementById("form-config-sheets");
    const urlInput = document.getElementById("sheets-webapp-url");

    if (gearBtn) {
        gearBtn.onclick = () => {
            urlInput.value = SHEET_WEBAPP_URL;
            openModal("modal-config-sheets");
        };
    }

    const closeConfig = () => {
        closeModal("modal-config-sheets");
    };

    if (closeBtn) closeBtn.onclick = closeConfig;
    if (cancelBtn) cancelBtn.onclick = closeConfig;

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const newUrl = urlInput.value.trim();
            localStorage.setItem("pmma_webapp_url", newUrl);
            SHEET_WEBAPP_URL = newUrl;
            
            closeConfig();
            
            if (SHEET_WEBAPP_URL) {
                // Adiciona listeners para foco
                window.removeEventListener('focus', syncDataOnline);
                window.addEventListener('focus', syncDataOnline);
                syncDataOnline();
            } else {
                updateSyncText("Modo Local (Offline)", "offline");
                window.removeEventListener('focus', syncDataOnline);
            }
        };
    }
}

async function syncDataOnline() {
    if (!SHEET_WEBAPP_URL) {
        updateSyncText("Modo Local (Offline)", "offline");
        return;
    }
    
    updateSyncText("Sincronizando...", "synching");
    
    try {
        const response = await fetch(`${SHEET_WEBAPP_URL}?action=getData`);
        if (!response.ok) throw new Error("Erro de conexão com o Apps Script");
        const res = await response.json();
        
        if (res.status === "success") {
            const data = res.data;
            
            // 1. Cronograma
            if (data['Cronograma']) {
                state.crono = data['Cronograma'].slice(1).map(row => ({
                    semana: String(row[0]),
                    day: String(row[1]),
                    subject: String(row[2]),
                    topic: String(row[3]),
                    studied: row[4] === "Sim" || row[4] === true || row[4] === "TRUE",
                    duration: parseInt(row[5]) || 0,
                    questions: parseInt(row[6]) || 0,
                    correct: parseInt(row[7]) || 0,
                    accuracy: parseFloat(row[8]) || 0.0,
                    notes: String(row[9] || "")
                }));
            }
            
            // 2. Edital
            if (data['Controle do Edital']) {
                state.edital = data['Controle do Edital'].slice(1).map(row => ({
                    subject: String(row[0]),
                    topic: String(row[1]),
                    studied: row[2] === "Sim" || row[2] === true || row[2] === "TRUE",
                    notes: String(row[3] || "")
                }));
            }
            
            // 3. Treino TAF
            if (data['Treino do TAF']) {
                state.taf_semanal = data['Treino do TAF'].slice(1).map(row => ({
                    date: String(row[0]),
                    pullups: parseInt(row[1]) || 0,
                    meio_sugado: parseInt(row[2]) || 0,
                    abdominal: parseInt(row[3]) || 0,
                    running: parseInt(row[4]) || 0,
                    status: String(row[5] || ""),
                    notes: String(row[6] || "")
                }));
            }
            
            // 4. Simulados TAF (Mapeia para state.treinos)
            if (data['Simulados do TAF']) {
                state.treinos = data['Simulados do TAF'].slice(1).map(row => ({
                    number: parseInt(row[0]) || 0,
                    date: String(row[1]),
                    pullups: parseInt(row[2]) || 0,
                    meio_sugado: parseInt(row[3]) || 0,
                    abdominal: parseInt(row[4]) || 0,
                    running: parseInt(row[5]) || 0,
                    status: String(row[6] || ""),
                    notes: String(row[7] || "")
                }));
            }
            
            // 5. Simulados Cabecalho (Mapeia para state.simulados)
            if (data['Simulados Cabecalho']) {
                state.simulados = data['Simulados Cabecalho'].slice(1).map(row => ({
                    number: parseInt(row[0]) || 0,
                    date: String(row[1]),
                    p1_questions: parseInt(row[2]) || 0,
                    p1_correct: parseInt(row[3]) || 0,
                    p2_questions: parseInt(row[4]) || 0,
                    p2_correct: parseInt(row[5]) || 0,
                    score: parseFloat(row[6]) || 0.0,
                    duration: String(row[7] || ""),
                    notes: String(row[8] || "")
                }));
            }
            
            // 6. Caderno de Erros
            if (data['Caderno de Erros']) {
                state.erros_questoes = data['Caderno de Erros'].slice(1).map(row => String(row[0])).filter(Boolean);
            }
            
            // 7. Questões Respondidas
            if (data['Questoes Respondidas']) {
                state.respondidas_questoes = data['Questoes Respondidas'].slice(1).map(row => String(row[0])).filter(Boolean);
            }
            
            // Salva offline no localStorage local
            localStorage.setItem("pmma_data_v2", JSON.stringify(state));
            
            updateSyncText("Planilha Conectada", "synced");
            
            // Atualizar telas ativas
            const activeTab = document.querySelector(".menu-item.active")?.getAttribute("data-tab");
            if (activeTab === "dashboard") renderDashboard();
            else if (activeTab === "cronograma") renderCronograma();
            else if (activeTab === "edital") renderEdital();
            else if (activeTab === "desempenho") renderDesempenho();
        } else {
            throw new Error(res.message);
        }
    } catch (e) {
        console.error("Falha ao sincronizar com Google Sheets:", e);
        updateSyncText("Erro Sinc. (Offline)", "error");
    }
}

async function postToSheets(action, payload) {
    if (!SHEET_WEBAPP_URL) return;
    try {
        const body = JSON.stringify({
            action: action,
            ...payload
        });
        await fetch(SHEET_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });
        console.log(`Dados enviados via POST com sucesso (Ação: ${action})`);
    } catch (e) {
        console.error(`Erro ao postar para planilha (Ação: ${action}):`, e);
    }
}

async function pushErrorsToSheets() {
    if (!SHEET_WEBAPP_URL) return;
    try {
        await fetch(SHEET_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "syncErrors",
                errors: state.erros_questoes || []
            })
        });
        console.log("Caderno de erros atualizado e sincronizado na planilha.");
    } catch (e) {
        console.error("Erro ao sincronizar caderno de erros na planilha:", e);
    }
}

async function pushRespondidasToSheets() {
    if (!SHEET_WEBAPP_URL) return;
    try {
        await fetch(SHEET_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "syncRespondidas",
                answered: state.respondidas_questoes || []
            })
        });
        console.log("Questões respondidas atualizadas e sincronizadas na planilha.");
    } catch (e) {
        console.error("Erro ao sincronizar respondidas na planilha:", e);
    }
}

function updateSyncText(text, status) {
    const badge = document.getElementById("sync-status");
    const textEl = document.getElementById("sync-text");
    const icon = badge?.querySelector("i");
    
    if (!badge || !textEl || !icon) return;
    
    badge.className = `sync-badge ${status}`;
    textEl.textContent = text;
    
    if (status === "synced") {
        icon.className = "fa-solid fa-cloud-arrow-up";
    } else if (status === "synching") {
        icon.className = "fa-solid fa-rotate fa-spin";
    } else if (status === "error" || status === "offline") {
        icon.className = "fa-solid fa-circle-exclamation";
    } else {
        icon.className = "fa-solid fa-file-invoice";
    }
}

