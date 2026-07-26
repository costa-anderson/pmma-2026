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
            e.preventDefault();
            const tabId = item.getAttribute("data-tab");
            
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
        desempenho: { t: "Desempenho Geral", d: "Evolução e registros de testes físicos do TAF e Simulados." }
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
            console.log("Dados carregados do localStorage.");
            appDataReady();
            return;
        } catch (e) {
            console.error("Erro ao ler dados do localStorage. Recorrendo ao JSON.", e);
        }
    }
    
    // Fallback: Busca JSON gerado pela planilha
    try {
        const response = await fetch("pmma_data_export_2.json");
        if (response.ok) {
            state = await response.json();
            saveDataLocal();
            console.log("Dados carregados do arquivo pmma_data_export_2.json.");
        } else {
            console.warn("Arquivo pmma_data_export_2.json não encontrado. Iniciando estado vazio.");
        }
    } catch (err) {
        console.error("Erro ao carregar dados do JSON:", err);
    }
    appDataReady();
}

function saveDataLocal() {
    localStorage.setItem("pmma_data_v2", JSON.stringify(state));
}

function appDataReady() {
    populateCronoFilterSemanas();
    populateEditalFilterSubjects();
    renderDashboard();
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
