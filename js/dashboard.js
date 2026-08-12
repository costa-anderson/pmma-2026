// ==========================================================================
// 📈 Dashboard Module — Controle do Painel Tático (QG PMMA)
// ==========================================================================

let chartSubjects = null;
let chartSimulados = null;
let chartTaf = null;

// Renderização geral da Dashboard
function renderDashboard() {
    document.getElementById("today-date-badge").textContent = getTodayString();
    
    // 1. Estatísticas Rápidas
    // Total horas estudadas
    let totalMinutes = 0;
    if (state.historico_estudos && state.historico_estudos.length > 0) {
        totalMinutes = state.historico_estudos.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    } else {
        totalMinutes = state.crono.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    }
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    document.getElementById("val-total-hours").textContent = `${hrs}h ${mins}m`;
    
    // Tópicos concluídos
    let studiedCount = state.crono.filter(c => c.studied).length;
    document.getElementById("val-total-sessions").textContent = `${studiedCount} tópicos concluídos`;
    
    // Acerto de questões
    let totalQuestions = 0;
    let totalCorrect = 0;
    if (state.historico_estudos && state.historico_estudos.length > 0) {
        totalQuestions = state.historico_estudos.reduce((acc, curr) => acc + (curr.questions || 0), 0);
        totalCorrect = state.historico_estudos.reduce((acc, curr) => acc + (curr.correct || 0), 0);
    } else {
        totalQuestions = state.crono.reduce((acc, curr) => acc + (curr.questions || 0), 0);
        totalCorrect = state.crono.reduce((acc, curr) => acc + (curr.correct || 0), 0);
    }
    let accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0.0;
    
    document.getElementById("val-accuracy").textContent = `${accuracy.toFixed(1)}%`;
    document.getElementById("val-total-questions").textContent = `${totalQuestions} feitas / ${totalCorrect} acertos`;
    
    // Progresso do edital
    let totalEdital = state.edital.length;
    let studiedEdital = state.edital.filter(e => e.studied).length;
    let editalPct = totalEdital > 0 ? (studiedEdital / totalEdital) * 100 : 0.0;
    
    document.getElementById("val-edital-pct").textContent = `${editalPct.toFixed(1)}%`;
    document.getElementById("val-edital-ratio").textContent = `${studiedEdital} de ${totalEdital} tópicos`;
    
    // Progresso de Temas Quentes (🔥)
    renderHotTopicsProgress();

    // TAF Status
    renderTafStatusDashboard();
    
    // 2. Estudos de Hoje
    renderTodayList();
    
    // 3. Gráficos
    renderCharts();
}

// Renderiza a métrica de cobertura de temas quentes
function renderHotTopicsProgress() {
    const hotTotal = state.edital.filter(e => e.hot).length;
    const hotStudied = state.edital.filter(e => e.hot && e.studied).length;
    const pct = hotTotal > 0 ? (hotStudied / hotTotal) * 100 : 0.0;
    
    const container = document.getElementById("hot-topics-card-prog");
    if (container) {
        container.innerHTML = `
            <div class="metric-card-header">
                <div class="metric-card-title">Temas Quentes (🔥)</div>
                <div class="metric-card-icon" style="color: #FF5A5F;"><i class="fa-solid fa-fire"></i></div>
            </div>
            <div class="metric-value" style="color: #FF5A5F;">${pct.toFixed(1)}%</div>
            <div class="metric-trend" style="color: var(--text-muted);">${hotStudied} de ${hotTotal} temas quentes cobertos</div>
        `;
    }
}

function renderTafStatusDashboard() {
    const valTafStatus = document.getElementById("val-taf-status");
    const valTafTrend = document.getElementById("val-taf-trend");
    
    if (!state.taf_semanal || state.taf_semanal.length === 0) {
        valTafStatus.textContent = "Sem Dados";
        valTafStatus.style.color = "var(--text-muted)";
        valTafTrend.textContent = "Nenhum teste registrado";
        return;
    }
    
    const sortedTaf = [...state.taf_semanal].sort((a, b) => parseDate(b.date) - parseDate(a.date));
    const lastTaf = sortedTaf[0];
    
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

function getTodayString() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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

function renderCharts() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDark ? "#94A3B8" : "#475569";
    
    // Chart 1: Progresso do Edital por Matéria
    const canvasSubjects = document.getElementById("chart-subjects-progress");
    if (canvasSubjects) {
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
                        pointBackgroundColor: '#10B981'
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
