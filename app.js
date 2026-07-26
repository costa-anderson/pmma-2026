// ==========================================================================
// QG PMMA 2026 - Lógica Frontend da Aplicação
// ==========================================================================

// Configuração Padrão do Edital & Mapeamento do Tenente (Prioridades)
const DEFAULT_SYLLABUS = [
    // LÍNGUA PORTUGUESA (Ordem Linear da Base ao Avançado)
    { subject: "Língua Portuguesa", topic: "Morfologia I - Classes de palavras variáveis (Substantivo, Adjetivo, Artigo, Numeral).", hot: false },
    { subject: "Língua Portuguesa", topic: "Morfologia II - Emprego e flexão dos Pronomes (pessoais, demonstrativos, possessivos, etc.).", hot: false },
    { subject: "Língua Portuguesa", topic: "Morfologia III - Emprego de tempos e modos verbais. Flexão e vozes verbais.", hot: false },
    { subject: "Língua Portuguesa", topic: "Conjunções (coordenativas e subordinativas) e Conectivos. Coesão textual.", hot: true, weight: "23% (Conectivos/Coesão)" },
    { subject: "Língua Portuguesa", topic: "Ortografia oficial, acentuação gráfica oficial e emprego do hífen.", hot: false },
    { subject: "Língua Portuguesa", topic: "Sintaxe da oração e do período (coordenação e subordinação).", hot: false },
    { subject: "Língua Portuguesa", topic: "Concordância verbal e nominal.", hot: true, weight: "27% (Morfossintaxe)" },
    { subject: "Língua Portuguesa", topic: "Regência verbal e nominal.", hot: true, weight: "27% (Morfossintaxe)" },
    { subject: "Língua Portuguesa", topic: "Emprego do sinal indicativo de crase.", hot: false },
    { subject: "Língua Portuguesa", topic: "Emprego dos sinais de pontuação (especialmente a vírgula).", hot: false },
    { subject: "Língua Portuguesa", topic: "Reorganização da estrutura de orações e períodos. Reescrita de textos.", hot: true, weight: "23% (Reescrita)" },
    { subject: "Língua Portuguesa", topic: "Compreensão e interpretação de textos de gêneros variados.", hot: true, weight: "35% (Interpretação)" },

    // HISTÓRIA DO BRASIL
    { subject: "História do Brasil", topic: "República Velha e estruturas oligárquicas (café, coronelismo e voto de cabresto).", hot: true, weight: "30% (República Velha)" },
    { subject: "História do Brasil", topic: "Revolução de 1930 e Era Vargas (política, economia e sociedade).", hot: true, weight: "28% (Era Vargas)" },
    { subject: "História do Brasil", topic: "Ditadura Militar e redemocratização do Brasil (golpe de 64, regressão e abertura).", hot: true, weight: "25% (Ditadura/Redemocr.)" },
    { subject: "História do Brasil", topic: "A contribuição dos índios e negros para a formação do Brasil contemporâneo.", hot: false },

    // HISTÓRIA DO MARANHÃO
    { subject: "História do Maranhão", topic: "França Equinocial, fundação de São Luís e Guaxenduba (1615).", hot: true, weight: "29% (França Equinocial)" },
    { subject: "História do Maranhão", topic: "Revolta de Beckman e Estado do Maranhão e Grão-Pará (Companhia de Comércio).", hot: true, weight: "26% (Revolta de Beckman)" },
    { subject: "História do Maranhão", topic: "Independência do Maranhão, Batalha do Jenipapo e Balaiada.", hot: true, weight: "25% (Independência/Balaiada)" },
    { subject: "História do Maranhão", topic: "Invasão holandesa (1641-1644) e Expulsão dos holandeses.", hot: false },

    // GEOGRAFIA DO BRASIL
    { subject: "Geografia do Brasil", topic: "População, urbanização e migrações internas no Brasil.", hot: true, weight: "30% (População/Urb)" },
    { subject: "Geografia do Brasil", topic: "Industrialização, economia e organização do espaço brasileiro.", hot: true, weight: "28% (Industrialização)" },
    { subject: "Geografia do Brasil", topic: "Fronteiras agrícolas, estrutura fundiária e agropecuária.", hot: true, weight: "24% (Agropecuária)" },
    { subject: "Geografia do Brasil", topic: "A rede brasileira de transportes, comunicação e energia.", hot: false },

    // GEOGRAFIA DO MARANHÃO
    { subject: "Geografia do Maranhão", topic: "Clima, relevo, hidrografia e vegetação maranhense.", hot: true, weight: "31% (Aspectos Naturais)" },
    { subject: "Geografia do Maranhão", topic: "População, povoamento e movimentos populacionais no Maranhão.", hot: true, weight: "26% (População)" },
    { subject: "Geografia do Maranhão", topic: "Agricultura, extrativismo, indústria e setor terciário no Maranhão.", hot: true, weight: "25% (Setores Econômicos)" },

    // LEGISLAÇÃO PERTINENTE À PMMA
    { subject: "Legislação pertinente à PMMA", topic: "Estatuto dos Policiais Militares do Maranhão (Lei Estadual nº 6.513/1995).", hot: true, weight: "35% (Estatuto PMMA)" },
    { subject: "Legislação pertinente à PMMA", topic: "Código Penal Militar (Decretos-Leis aplicados).", hot: true, weight: "25% (CPM)" },
    { subject: "Legislação pertinente à PMMA", topic: "Lei Orgânica Nacional das Polícias Militares (Lei Federal nº 14.751/2023).", hot: true, weight: "20% (Lei Orgânica)" },

    // LEGISLAÇÃO INSTITUCIONAL
    { subject: "Legislação Institucional", topic: "Hierarquia, disciplina, postos, graduações e precedência policial militar.", hot: true, weight: "30% (Hierarquia/Disc)" },
    { subject: "Legislação Institucional", topic: "Direitos, deveres, ética e obrigações policiais militares.", hot: true, weight: "27% (Ética/Deveres)" },
    { subject: "Legislação Institucional", topic: "Ingresso, carreira e situações do policial militar (Lei nº 12.896/2026).", hot: true, weight: "23% (Carreira/Situações)" },

    // NOÇÕES DE INFORMÁTICA
    { subject: "Noções de Informática", topic: "Internet, intranet, redes de computadores e computação em nuvem.", hot: true, weight: "29% (Redes/Nuvem)" },
    { subject: "Noções de Informática", topic: "Segurança da informação, malware (vírus/worms/pragas) e rotinas de backup.", hot: true, weight: "27% (Segurança)" },
    { subject: "Noções de Informática", topic: "Sistemas operacionais Windows e Linux, Suíte Office e BrOffice.", hot: true, weight: "25% (OS/Office)" },

    // RACIOCÍNIO LÓGICO
    { subject: "Raciocínio Lógico", topic: "Proposições simples e compostas. Tabelas-verdade, equivalências e Leis de Morgan.", hot: false },
    { subject: "Raciocínio Lógico", topic: "Lógica de argumentação, diagramas lógicos, contagem e probabilidade.", hot: false }
];

// Metas do TAF Masculino PMMA
const TAF_METAS = {
    "Barra Fixa": { target: 4, unit: "reps" },
    "Meio Sugado": { target: 25, unit: "reps" },
    "Abdominal Remador": { target: 35, unit: "reps" },
    "Corrida": { target: 2400, unit: "m" }
};

// Data oficial da prova
const EXAM_DATE = new Date("2026-10-11T08:00:00");

// Banco de Questões e Sessão do Simulator
let bancoQuestoes = [];
let activeSession = {
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    startTime: null,
    timerInterval: null,
    elapsedSeconds: 0,
    subject: ""
};

// Estado Global do Aplicativo
let state = {
    mode: "offline", // "offline" ou "synced"
    apiUrl: "",
    crono: [],
    edital: [],
    registroEstudos: [],
    simuladosCab: [],
    simuladosDet: [],
    treinoTaf: [],
    simuladosTaf: []
};

// Controle de conclusão postergada do cronograma
let pendingCronoConcludeDate = null;

// Variáveis para guardar instâncias dos Gráficos (Chart.js)
let charts = {};

// ==========================================================================
// 🚀 Inicialização do Sistema
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadConfig();
    initTabs();
    initForms();
    startCountdown();
    checkPasscode();
    
    // Inicialização do Simulator, Avulsos e Hot Topics
    loadBancoQuestoes();
    initQuestoesTab();
    initDashboardExtras();
    
    // Carrega dados iniciais (do Sheets ou localStorage)
    refreshData();
});

// Inicialização do Tema Claro/Escuro
function initTheme() {
    const savedTheme = localStorage.getItem("qg-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    document.getElementById("theme-toggle-btn").addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("qg-theme", newTheme);
        updateChartsTheme();
    });
}

// Carregar Configurações de API
function loadConfig() {
    state.apiUrl = localStorage.getItem("qg-api-url") || "";
    document.getElementById("config-api-url").value = state.apiUrl;
    
    if (state.apiUrl) {
        state.mode = "synced";
        updateSyncBadge("synced", "Nuvem Conectada");
    } else {
        state.mode = "offline";
        updateSyncBadge("offline", "Modo Offline (Demo)");
    }
}

// Gerenciamento das Abas (Navegação SPA)
function initTabs() {
    const menuItems = document.querySelectorAll(".menu-item");
    const panes = document.querySelectorAll(".tab-pane");
    
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = item.getAttribute("data-tab");
            
            // Ativa item no menu
            menuItems.forEach(mi => mi.classList.remove("active"));
            item.classList.add("active");
            
            // Ativa painel correspondente
            panes.forEach(pane => pane.classList.remove("active"));
            const targetPane = document.getElementById("tab-" + tabId);
            if (targetPane) targetPane.classList.add("active");
            
            // Atualiza Títulos
            const tabTitles = {
                dashboard: { title: "Dashboard", desc: "Visão geral do seu progresso tático e estatísticas." },
                cronograma: { title: "Cronograma de Estudos", desc: "Acompanhe o planejamento dos estudos e treinos dia a dia." },
                edital: { title: "Controle do Edital", desc: "Acompanhe a cobertura teórica e revise os tópicos mais cobrados." },
                taf: { title: "Treino do TAF", desc: "Monitore a sua evolução física para bater os índices mínimos do edital." },
                historico: { title: "Histórico Geral", desc: "Logs de todas as atividades de estudos e treinos físicos realizados." },
                erros: { title: "Caderno de Erros", desc: "Consolidado de todas as falhas mapeadas em simulados prontas para revisão." },
                config: { title: "Configurações", desc: "Gerencie a integração com o Google Sheets ou configure dados locais." }
            };
            
            if (tabTitles[tabId]) {
                document.getElementById("current-tab-title").innerText = tabTitles[tabId].title;
                document.getElementById("current-tab-desc").innerText = tabTitles[tabId].desc;
            }
            
            // Recarrega gráficos/telas se mudar para aba específica
            if (tabId === 'dashboard') {
                setTimeout(renderDashboardCharts, 100);
            } else if (tabId === 'taf') {
                setTimeout(renderTafCharts, 100);
            } else if (tabId === 'cronograma') {
                setTimeout(renderCronograma, 100);
            }
        });
    });
}

// Contador Regressivo da Prova
function startCountdown() {
    function updateClock() {
        const now = new Date();
        const diff = EXAM_DATE - now;
        
        if (diff <= 0) {
            document.getElementById("countdown-timer").innerText = "DIA DA PROVA CHEGOU!";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        document.getElementById("countdown-timer").innerText = 
            `FALTAM ${days} DIAS PARA A PROVA`;
    }
    
    updateClock();
    setInterval(updateClock, 60000);
}

// Alterar visual do crachá de sincronização
function updateSyncBadge(type, text) {
    const badge = document.getElementById("sync-status");
    const label = document.getElementById("sync-text");
    
    badge.className = "sync-badge";
    label.innerText = text;
    
    if (type === "synced") {
        badge.classList.add("synced");
        badge.querySelector("i").className = "fa-solid fa-cloud-arrow-up";
    } else if (type === "demo") {
        badge.classList.add("demo");
        badge.querySelector("i").className = "fa-solid fa-vial";
    } else {
        badge.querySelector("i").className = "fa-solid fa-circle-nodes";
    }
}

// ==========================================================================
// 📥 Carregamento e Processamento de Dados (Banco Local ou Nuvem)
// ==========================================================================
async function refreshData() {
    if (state.mode === "synced" && state.apiUrl) {
        updateSyncBadge("offline", "Sincronizando...");
        try {
            const response = await fetch(`${state.apiUrl}?action=getData`);
            const res = await response.json();
            if (res.status === "success") {
                parseSheetsData(res.data);
                updateSyncBadge("synced", "Nuvem Conectada");
                processDataAndRender();
                return;
            }
        } catch (err) {
            console.error("Erro ao sincronizar com Google Sheets, utilizando fallback local:", err);
            alert("Não foi possível conectar ao Google Sheets. Usando dados locais temporariamente.");
        }
    }
    
    // Modo Fallback Local (localStorage)
    loadLocalData();
    updateSyncBadge(state.mode === "synced" ? "offline" : "demo", state.mode === "synced" ? "Erro Sinc. (Offline)" : "Modo Offline (Demo)");
    processDataAndRender();
}

// Salva dados locais no localStorage
function saveLocalDataToStorage() {
    localStorage.setItem("qg-local-crono", JSON.stringify(state.crono));
    localStorage.setItem("qg-local-edital", JSON.stringify(state.edital));
    localStorage.setItem("qg-local-estudos", JSON.stringify(state.registroEstudos));
    localStorage.setItem("qg-local-sim-cab", JSON.stringify(state.simuladosCab));
    localStorage.setItem("qg-local-sim-det", JSON.stringify(state.simuladosDet));
    localStorage.setItem("qg-local-taf-treino", JSON.stringify(state.treinoTaf));
    localStorage.setItem("qg-local-taf-sim", JSON.stringify(state.simuladosTaf));
}

// Carregar Dados Locais
function loadLocalData() {
    state.crono = JSON.parse(localStorage.getItem("qg-local-crono")) || [];
    state.edital = JSON.parse(localStorage.getItem("qg-local-edital")) || [];
    state.registroEstudos = JSON.parse(localStorage.getItem("qg-local-estudos")) || [];
    state.simuladosCab = JSON.parse(localStorage.getItem("qg-local-sim-cab")) || [];
    state.simuladosDet = JSON.parse(localStorage.getItem("qg-local-sim-det")) || [];
    state.treinoTaf = JSON.parse(localStorage.getItem("qg-local-taf-treino")) || [];
    state.simuladosTaf = JSON.parse(localStorage.getItem("qg-local-taf-sim")) || [];
    
    // Se edital local estiver vazio, inicializa com o edital padrão
    if (state.edital.length === 0) {
        state.edital = DEFAULT_SYLLABUS.map(t => ({
            subject: t.subject,
            topic: t.topic,
            studied: false,
            questions: 0,
            correct: 0,
            revisionStatus: "Pendente"
        }));
        saveLocalDataToStorage();
    }
}

// Processa a resposta bruta do Google Sheets (formato matriz/tabelas)
function parseSheetsData(rawData) {
    // 1. Cronograma
    if (rawData['Cronograma']) {
        const rows = rawData['Cronograma'];
        state.crono = rows.slice(1).map(r => ({
            date: r[0], dia: r[1], semana: r[2], m1: r[3], a1: r[4], m2: r[5], a2: r[6], ciclo: r[7], foco: r[8], completed: r[9] === "Concluído"
        }));
    }
    
    // 2. Controle do Edital
    if (rawData['Controle do Edital']) {
        const rows = rawData['Controle do Edital'];
        state.edital = rows.slice(1).map(r => {
            if (!r[0] || !r[1]) return null; // Filtra vazios ou cabeçalhos puros de matéria
            return {
                subject: r[0],
                topic: r[1],
                studied: r[2] === "Sim",
                questions: parseInt(r[3]) || 0,
                correct: parseInt(r[4]) || 0,
                revisionStatus: r[7] || "Pendente"
            };
        }).filter(Boolean);
    }
    
    // 3. Registro de Estudos
    if (rawData['Registro de Estudos']) {
        const rows = rawData['Registro de Estudos'];
        state.registroEstudos = rows.slice(1).map(r => {
            if (!r[0] || !r[1]) return null;
            return {
                date: formatDateString(r[0]),
                subject: r[1],
                topic: r[2],
                type: r[3],
                duration: parseInt(r[4]) || 0,
                questions: parseInt(r[5]) || 0,
                correct: parseInt(r[6]) || 0,
                errors: parseInt(r[7]) || 0,
                accuracy: parseFloat(r[8]) || 0.0,
                notes: r[9] || ""
            };
        }).filter(Boolean);
    }
    
    // 4. Simulados Cabeçalho
    if (rawData['Simulados Cabecalho']) {
        state.simuladosCab = rawData['Simulados Cabecalho'].slice(1).map(r => ({
            id: r[0], name: r[1], date: formatDateString(r[2]), totalQuestions: parseInt(r[3]) || 0, totalCorrect: parseInt(r[4]) || 0
        })).filter(r => r.id);
    }
    
    // 5. Simulados Detalhes
    if (rawData['Simulados Detalhes']) {
        state.simuladosDet = rawData['Simulados Detalhes'].slice(1).map(r => ({
            simId: r[0], subject: r[1], topic: r[2], questions: parseInt(r[3]) || 0, correct: parseInt(r[4]) || 0, errors: parseInt(r[5]) || 0, notes: r[6] || "", needsReview: r[7] === "Sim"
        })).filter(r => r.simId);
    }
    
    // 6. Treino do TAF
    if (rawData['Treino de TAF'] || rawData['Treino do TAF']) {
        const rows = rawData['Treino de TAF'] || rawData['Treino do TAF'];
        state.treinoTaf = rows.slice(1).map(r => {
            if (!r[0] || !r[1]) return null;
            return {
                date: formatDateString(r[0]),
                exercise: r[1],
                result: parseFloat(r[2]) || 0,
                target: parseFloat(r[3]) || 0,
                accuracy: parseFloat(r[4]) || 0,
                status: r[5] || "",
                sets: parseInt(r[6]) || 1,
                restTime: parseInt(r[7]) || 0,
                duration: parseInt(r[8]) || 0
            };
        }).filter(Boolean);
    }
    
    // 7. Simulados do TAF
    if (rawData['Simulados do TAF']) {
        state.simuladosTaf = rawData['Simulados do TAF'].slice(1).map(r => ({
            date: formatDateString(r[0]),
            barra: parseInt(r[1]) || 0,
            sugado: parseInt(r[2]) || 0,
            abdominal: parseInt(r[3]) || 0,
            corrida: parseInt(r[4]) || 0,
            duration: parseInt(r[5]) || 0,
            status: r[6] || "",
            notes: r[7] || ""
        })).filter(r => r.date);
    }
}

// Auxiliar para formatar strings de data vindas de Sheets ou JSON
function formatDateString(val) {
    if (!val) return "";
    if (val instanceof Date || (String(val).includes("T") && !String(val).includes("/")) ) {
        const d = new Date(val);
        return d.toLocaleDateString('pt-BR');
    }
    let clean = String(val).split(" ")[0];
    let parts = [];
    if (clean.includes("-")) {
        parts = clean.split("-");
        if (parts[0].length === 4) {
            parts = [parts[2], parts[1], parts[0]];
        }
    } else if (clean.includes("/")) {
        parts = clean.split("/");
    } else {
        return clean;
    }
    
    if (parts.length === 3) {
        let day = String(parts[0]).padStart(2, "0");
        let month = String(parts[1]).padStart(2, "0");
        let year = String(parts[2]);
        if (year.length === 2) {
            year = "20" + year;
        }
        return `${day}/${month}/${year}`;
    }
    return clean;
}

// Processamento e Renderização de toda a interface
function processDataAndRender() {
    renderMetrics();
    renderTodayPlan();
    renderSpacedRevisions();
    renderCronograma();
    renderEdital();
    renderTAF();
    renderHistory();
    renderErrors();
    populateFormDropdowns();
    
    // Desenha gráficos baseados na aba aberta
    const activeTab = document.querySelector(".menu-item.active").getAttribute("data-tab");
    if (activeTab === 'dashboard') renderDashboardCharts();
    if (activeTab === 'taf') renderTafCharts();
}

// ==========================================================================
// 📈 Renderização de Métricas & Dashboard (Tela 1)
// ==========================================================================
function renderMetrics() {
    // 1. Total Horas
    let totalMinutes = 0;
    state.registroEstudos.forEach(s => totalMinutes += s.duration);
    const totalHours = totalMinutes / 60;
    document.getElementById("val-total-hours").innerText = `${totalHours.toFixed(1)}h`;
    document.getElementById("val-total-sessions").innerText = `${state.registroEstudos.length} sessões`;
    
    // 2. Acertos
    let qTotal = 0;
    let qCorrect = 0;
    
    // Conta do Registro de Estudos
    state.registroEstudos.forEach(s => {
        qTotal += s.questions;
        qCorrect += s.correct;
    });
    
    // Conta dos Simulados
    state.simuladosCab.forEach(s => {
        qTotal += s.totalQuestions;
        qCorrect += s.totalCorrect;
    });
    
    const accuracy = qTotal > 0 ? (qCorrect / qTotal * 100) : 0;
    document.getElementById("val-accuracy").innerText = `${accuracy.toFixed(1)}%`;
    document.getElementById("val-total-questions").innerText = `${qTotal} resolvidas`;
    
    // 3. Progresso do Edital
    const totalTopics = state.edital.length;
    const studiedTopics = state.edital.filter(t => t.studied).length;
    const editalPct = totalTopics > 0 ? (studiedTopics / totalTopics * 100) : 0;
    
    document.getElementById("val-edital-pct").innerText = `${editalPct.toFixed(1)}%`;
    document.getElementById("val-edital-ratio").innerText = `${studiedTopics}/${totalTopics} tópicos`;
    
    // 4. Progresso TAF Metas (Últimos treinos vs meta)
    let metCount = 0;
    const exercises = Object.keys(TAF_METAS);
    
    exercises.forEach(ex => {
        // Encontra o resultado mais recente para este exercício
        const filter = state.treinoTaf.filter(t => t.exercise === ex);
        if (filter.length > 0) {
            // Ordena por data (as datas estão no formato DD/MM/YYYY)
            const sorted = filter.sort((a, b) => parseDate(b.date) - parseDate(a.date));
            if (sorted[0].result >= TAF_METAS[ex].target) metCount++;
        }
    });
    
    document.getElementById("val-taf-status").innerText = `${metCount}/4`;
    
    // 5. Tópicos Quentes do Tenente
    let totalHot = 0;
    let studiedHot = 0;
    
    state.edital.forEach(t => {
        // Verifica se o tópico do edital corresponde a algum tópico quente mapeado
        const mapped = DEFAULT_SYLLABUS.find(s => s.subject.toLowerCase() === t.subject.toLowerCase() && s.topic.toLowerCase() === t.topic.toLowerCase());
        if (mapped && mapped.hot) {
            totalHot++;
            if (t.studied) studiedHot++;
        }
    });
    
    const hotPct = totalHot > 0 ? (studiedHot / totalHot * 100) : 0;
    document.getElementById("hot-topics-pct").innerText = `${studiedHot}/${totalHot} (${hotPct.toFixed(0)}%)`;
    document.getElementById("hot-topics-fill").style.width = `${hotPct}%`;
}

// Renderização dos estudos para hoje
function renderTodayPlan() {
    const list = document.getElementById("today-subjects-list");
    list.innerHTML = "";
    
    // Pega a data de hoje formatada em DD/MM/YYYY
    const today = new Date();
    const todayStr = today.toLocaleDateString('pt-BR');
    document.getElementById("today-date-badge").innerText = todayStr;
    
    // Busca registro de hoje no cronograma
    let todayPlan = null;
    if (state.crono.length > 0) {
        todayPlan = state.crono.find(c => {
            const cDate = c.date instanceof Date ? c.date.toLocaleDateString('pt-BR') : String(c.date).split(" ")[0];
            return formatDateString(cDate) === todayStr;
        });
    }
    
    if (todayPlan) {
        // Matéria 1
        const box1 = document.createElement("div");
        box1.className = "subject-item-box";
        box1.innerHTML = `
            <div class="subject-name">
                <span>M1: ${todayPlan.m1}</span>
                <span class="badge">${todayPlan.semana}</span>
            </div>
            <div class="subject-topic">${todayPlan.a1}</div>
        `;
        list.appendChild(box1);
        
        // Matéria 2 (se houver)
        if (todayPlan.m2 && todayPlan.m2 !== "DESCANSO" && todayPlan.m2 !== "REVISÃO SEMANAL") {
            const box2 = document.createElement("div");
            box2.className = "subject-item-box";
            box2.innerHTML = `
                <div class="subject-name">
                    <span>M2: ${todayPlan.m2}</span>
                </div>
                <div class="subject-topic">${todayPlan.a2}</div>
            `;
            list.appendChild(box2);
        } else if (todayPlan.m2) {
            const box2 = document.createElement("div");
            box2.className = "subject-item-box";
            box2.style.borderLeft = "4px solid var(--warning)";
            box2.innerHTML = `
                <div class="subject-name" style="color: var(--warning);">
                    <span>${todayPlan.m2}</span>
                </div>
                <div class="subject-topic">${todayPlan.a2}</div>
            `;
            list.appendChild(box2);
        }
        
        // Atualiza o estado do botão de conclusão do dia
        const btn = document.getElementById("btn-conclude-day");
        btn.disabled = false;
        if (todayPlan.completed) {
            btn.innerHTML = `
                <span class="text-completed"><i class="fa-solid fa-circle-check"></i> Dia Concluído!</span>
                <span class="text-hover-undo"><i class="fa-solid fa-rotate-left"></i> Desfazer Dia</span>
            `;
            btn.className = "btn btn-secondary btn-block btn-crono-completed-toggle";
            btn.setAttribute("data-action", "undo");
        } else {
            btn.innerHTML = `<i class="fa-solid fa-check-double"></i> Concluir Dia do Ciclo`;
            btn.className = "btn btn-primary btn-block";
            btn.setAttribute("data-action", "conclude");
        }
    } else {
        list.innerHTML = `
            <p class="empty-state">
                <i class="fa-solid fa-mug-hot" style="font-size: 24px; margin-bottom: 8px; display: block; color: var(--text-muted);"></i>
                Sem cronograma para hoje (${todayStr}).<br>Configure seu Google Sheets ou use dados de demonstração.
            </p>
        `;
        document.getElementById("btn-conclude-day").disabled = true;
    }
}

// Renderização dos Gráficos do Dashboard
function renderDashboardCharts() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDark ? "#9ca3af" : "#4b5563";
    
    // --- 1. GRÁFICO COBERTURA DO EDITAL (Rosca) ---
    const total = state.edital.length;
    const studied = state.edital.filter(t => t.studied).length;
    const pending = total - studied;
    
    if (charts.edital) charts.edital.destroy();
    
    const ctxEdital = document.getElementById("chart-edital-coverage").getContext("2d");
    charts.edital = new Chart(ctxEdital, {
        type: 'doughnut',
        data: {
            labels: ['Estudado', 'Pendente'],
            datasets: [{
                data: [studied, total === 0 ? 1 : pending],
                backgroundColor: [studied > 0 ? '#00e5ff' : 'rgba(0,229,255,0.05)', isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'],
                borderColor: isDark ? '#121621' : '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter', size: 11 } } }
            },
            cutout: '70%'
        }
    });
    
    // --- 2. ACERTOS E ERROS POR MATÉRIA (Barras Empilhadas) ---
    const subjectsMap = {};
    // Puxa do Registro de Estudos
    state.registroEstudos.forEach(s => {
        if (!subjectsMap[s.subject]) subjectsMap[s.subject] = { correct: 0, errors: 0 };
        subjectsMap[s.subject].correct += s.correct;
        subjectsMap[s.subject].errors += s.errors;
    });
    // Puxa do detalhe dos simulados
    state.simuladosDet.forEach(s => {
        if (!subjectsMap[s.subject]) subjectsMap[s.subject] = { correct: 0, errors: 0 };
        subjectsMap[s.subject].correct += s.correct;
        subjectsMap[s.subject].errors += s.errors;
    });
    
    const chartLabels = Object.keys(subjectsMap);
    const dataCorrect = chartLabels.map(l => subjectsMap[l].correct);
    const dataErrors = chartLabels.map(l => subjectsMap[l].errors);
    
    if (charts.accuracy) charts.accuracy.destroy();
    
    const ctxAccuracy = document.getElementById("chart-subject-accuracy").getContext("2d");
    charts.accuracy = new Chart(ctxAccuracy, {
        type: 'bar',
        data: {
            labels: chartLabels.length > 0 ? chartLabels.map(l => l.substring(0, 12) + (l.length > 12 ? '..' : '')) : ['Sem Dados'],
            datasets: [
                { label: 'Acertos', data: dataCorrect.length > 0 ? dataCorrect : [0], backgroundColor: '#10b981' },
                { label: 'Erros', data: dataErrors.length > 0 ? dataErrors : [0], backgroundColor: '#ef4444' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } },
                y: { stacked: true, grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } }
            },
            plugins: {
                legend: { position: 'bottom', labels: { color: textColor, font: { size: 11 } } }
            }
        }
    });
    
    // --- 3. FLUXO DE REVISÃO (Rosca) ---
    const revPendente = state.edital.filter(t => t.studied && t.revisionStatus === "Pendente").length;
    const revEmRevisao = state.edital.filter(t => t.studied && t.revisionStatus === "Em Revisão").length;
    const revRevisado = state.edital.filter(t => t.studied && t.revisionStatus === "Revisado").length;
    const totalEstudados = revPendente + revEmRevisao + revRevisado;
    
    if (charts.revision) charts.revision.destroy();
    
    const ctxRevision = document.getElementById("chart-revision-status").getContext("2d");
    charts.revision = new Chart(ctxRevision, {
        type: 'doughnut',
        data: {
            labels: ['Pendente Revisar', 'Em Revisão', 'Revisado'],
            datasets: [{
                data: [
                    revPendente,
                    revEmRevisao,
                    totalEstudados === 0 ? 1 : revRevisado
                ],
                backgroundColor: [
                    '#ef4444', 
                    '#f59e0b', 
                    totalEstudados > 0 ? '#10b981' : 'rgba(255,255,255,0.05)'
                ],
                borderColor: isDark ? '#121621' : '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: textColor, font: { size: 11 } } }
            },
            cutout: '70%'
        }
    });
    
    // --- 4. RADAR TAF (Radar do desempenho atual vs meta) ---
    const tafLabels = Object.keys(TAF_METAS);
    const tafCurrentData = tafLabels.map(ex => {
        const filter = state.treinoTaf.filter(t => t.exercise === ex);
        if (filter.length > 0) {
            const sorted = filter.sort((a, b) => parseDate(b.date) - parseDate(a.date));
            // Retorna percentual de aproveitamento (limitado a 150% no gráfico para não explodir a escala)
            const ratio = sorted[0].result / TAF_METAS[ex].target;
            return Math.min(ratio * 100, 150);
        }
        return 0;
    });
    
    if (charts.tafRadar) charts.tafRadar.destroy();
    
    const ctxTaf = document.getElementById("chart-taf-radar").getContext("2d");
    charts.tafRadar = new Chart(ctxTaf, {
        type: 'radar',
        data: {
            labels: tafLabels,
            datasets: [{
                label: 'Seu Rendimento (% da Meta)',
                data: tafCurrentData,
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                borderColor: '#00e5ff',
                pointBackgroundColor: '#00e5ff',
                borderWidth: 2
            }, {
                label: 'Meta Mínima (100%)',
                data: [100, 100, 100, 100],
                borderColor: 'rgba(239, 68, 68, 0.4)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: gridColor },
                    grid: { color: gridColor },
                    pointLabels: { color: textColor, font: { family: 'Outfit', size: 10, weight: '600' } },
                    ticks: { display: false },
                    min: 0,
                    max: 150
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Atualizar tema dos gráficos se mudar de tema
function updateChartsTheme() {
    setTimeout(renderDashboardCharts, 200);
}

// Helper para converter string "DD/MM/YYYY" em objeto Date
function parseDate(dateStr) {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// ==========================================================================
// 📚 Controle do Edital (Tela 2)
// ==========================================================================
function renderEdital() {
    const container = document.getElementById("edital-accordion-container");
    container.innerHTML = "";
    
    const searchVal = document.getElementById("edital-search").value.toLowerCase();
    const filterHotOnly = document.getElementById("btn-filter-hot").classList.contains("active");
    const filterPendingOnly = document.getElementById("btn-filter-pending").classList.contains("active");
    
    // Agrupa tópicos por matéria
    const subjects = {};
    
    state.edital.forEach(t => {
        // Verifica filtros de busca e tags
        const mapped = DEFAULT_SYLLABUS.find(s => s.subject.toLowerCase() === t.subject.toLowerCase() && s.topic.toLowerCase() === t.topic.toLowerCase());
        const isHot = mapped && mapped.hot;
        
        if (searchVal && !t.topic.toLowerCase().includes(searchVal) && !t.subject.toLowerCase().includes(searchVal)) return;
        if (filterHotOnly && !isHot) return;
        if (filterPendingOnly && t.studied) return;
        
        if (!subjects[t.subject]) subjects[t.subject] = [];
        subjects[t.subject].push({
            ...t,
            hot: isHot,
            weight: mapped ? mapped.weight : ""
        });
    });
    
    const subjectList = Object.keys(subjects);
    
    if (subjectList.length === 0) {
        container.innerHTML = `<p class="empty-state">Nenhum tópico corresponde aos filtros ativos.</p>`;
        return;
    }
    
    subjectList.forEach((sub, idx) => {
        const topics = subjects[sub];
        
        // Calcula progresso da matéria
        const total = topics.length;
        const studied = topics.filter(t => t.studied).length;
        const pct = total > 0 ? (studied / total * 100) : 0;
        
        const accordion = document.createElement("div");
        accordion.className = `accordion-item ${idx === 0 ? 'open' : ''}`;
        
        accordion.innerHTML = `
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <div class="accordion-title">
                    <i class="fa-solid fa-folder-open" style="color: var(--accent);"></i>
                    <h4>${sub}</h4>
                    <span class="accordion-progress-stats">${studied}/${total} estudados (${pct.toFixed(0)}%)</span>
                </div>
                <i class="fa-solid fa-chevron-down accordion-arrow"></i>
            </div>
            <div class="accordion-content">
                <div class="topic-list-wrapper">
                    <!-- Tópicos serão inseridos aqui -->
                </div>
            </div>
        `;
        
        const listWrapper = accordion.querySelector(".topic-list-wrapper");
        
        topics.forEach(t => {
            const row = document.createElement("div");
            row.className = "topic-row";
            
            // Badge do Tenente
            const hotBadgeHtml = t.hot ? `<span class="topic-badge-hot" title="Alta incidência baseada na análise do Tenente"><i class="fa-solid fa-fire"></i> ${t.weight}</span>` : "";
            
            // Calculo da porcentagem de acertos
            const qPct = t.questions > 0 ? (t.correct / t.questions * 100) : 0;
            const statsHtml = t.questions > 0 ? 
                `<span>${t.questions} Qs</span> | <span style="color: ${qPct >= 80 ? 'var(--success)' : (qPct >= 60 ? 'var(--warning)' : 'var(--danger)')};">${qPct.toFixed(0)}% Acertos</span>` : 
                `<span style="color: var(--text-muted);">Sem questões</span>`;
            
            row.innerHTML = `
                <div class="topic-left">
                    <label class="topic-checkbox-label">
                        <input type="checkbox" ${t.studied ? 'checked' : ''} onchange="handleTopicCheckToggle('${sub.replace(/'/g, "\\'")}', '${t.topic.replace(/'/g, "\\'")}', this.checked)">
                        <div>
                            <span>${t.topic}</span>
                            ${hotBadgeHtml}
                        </div>
                    </label>
                </div>
                <div class="topic-right">
                    <div class="topic-stats-micro">
                        ${statsHtml}
                    </div>
                    <select class="revision-select" onchange="handleTopicRevisionChange('${sub.replace(/'/g, "\\'")}', '${t.topic.replace(/'/g, "\\'")}', this.value)">
                        <option value="Pendente" ${t.revisionStatus === 'Pendente' ? 'selected' : ''}>Pendente Revisão</option>
                        <option value="Em Revisão" ${t.revisionStatus === 'Em Revisão' ? 'selected' : ''}>Em Revisão</option>
                        <option value="Revisado" ${t.revisionStatus === 'Revisado' ? 'selected' : ''}>Revisado</option>
                    </select>
                </div>
            `;
            
            listWrapper.appendChild(row);
        });
        
        container.appendChild(accordion);
    });
}

function toggleAccordion(header) {
    const item = header.parentElement;
    item.classList.toggle("open");
}

// Salva alteração de tópico estudado
async function handleTopicCheckToggle(subject, topic, studied) {
    // Atualiza estado local
    const t = state.edital.find(x => x.subject === subject && x.topic === topic);
    if (t) {
        t.studied = studied;
        // Se desmarcar estudado, reseta revisão para pendente
        if (!studied) t.revisionStatus = "Pendente";
    }
    
    if (state.mode === "synced" && state.apiUrl) {
        try {
            await fetch(state.apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggleEdital', subject, topic, studied })
            });
        } catch (e) {
            console.error("Erro ao sincronizar edital:", e);
        }
    } else {
        saveLocalDataToStorage();
    }
    processDataAndRender();
}

// Salva alteração no status de revisão do edital
async function handleTopicRevisionChange(subject, topic, revisionStatus) {
    const t = state.edital.find(x => x.subject === subject && x.topic === topic);
    if (t) {
        t.revisionStatus = revisionStatus;
    }
    
    if (state.mode === "synced" && state.apiUrl) {
        try {
            await fetch(state.apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggleEdital', subject, topic, revisionStatus })
            });
        } catch (e) {
            console.error("Erro ao sincronizar edital:", e);
        }
    } else {
        saveLocalDataToStorage();
    }
    processDataAndRender();
}

// Eventos de Filtro no Edital
document.getElementById("edital-search").addEventListener("input", renderEdital);
document.getElementById("btn-filter-all").addEventListener("click", () => {
    toggleFilterButton("btn-filter-all");
    renderEdital();
});
document.getElementById("btn-filter-hot").addEventListener("click", () => {
    toggleFilterButton("btn-filter-hot");
    renderEdital();
});
document.getElementById("btn-filter-pending").addEventListener("click", () => {
    toggleFilterButton("btn-filter-pending");
    renderEdital();
});

function toggleFilterButton(activeId) {
    const buttons = ["btn-filter-all", "btn-filter-hot", "btn-filter-pending"];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (id === activeId) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}

// ==========================================================================
// 🏃 Treino do TAF (Tela 3)
// ==========================================================================
function renderTAF() {
    // Configura o formulário para mostrar/esconder campos baseados no exercício
    const exerciseSelect = document.getElementById("taf-workout-exercise");
    const stdRow = document.getElementById("row-standard-workout");
    const runRow = document.getElementById("row-run-workout");
    
    function updateTAFFormFields() {
        if (exerciseSelect.value === "Corrida") {
            stdRow.classList.add("hidden");
            runRow.classList.remove("hidden");
        } else {
            stdRow.classList.remove("hidden");
            runRow.classList.add("hidden");
        }
    }
    
    exerciseSelect.removeEventListener("change", updateTAFFormFields);
    exerciseSelect.addEventListener("change", updateTAFFormFields);
    updateTAFFormFields();
}

// Renderiza os Gráficos do TAF
function renderTafCharts() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDark ? "#9ca3af" : "#4b5563";
    
    // Separa dados históricos
    const historyMap = { "Barra Fixa": [], "Meio Sugado": [], "Abdominal Remador": [], "Corrida": [] };
    state.treinoTaf.forEach(t => {
        if (historyMap[t.exercise]) {
            historyMap[t.exercise].push({
                date: parseDate(t.date),
                dateStr: t.date,
                val: t.result
            });
        }
    });
    
    // Também mescla simulados do TAF históricos
    state.simuladosTaf.forEach(s => {
        const d = parseDate(s.date);
        historyMap["Barra Fixa"].push({ date: d, dateStr: s.date, val: s.barra });
        historyMap["Meio Sugado"].push({ date: d, dateStr: s.date, val: s.sugado });
        historyMap["Abdominal Remador"].push({ date: d, dateStr: s.date, val: s.abdominal });
        historyMap["Corrida"].push({ date: d, dateStr: s.date, val: s.corrida });
    });
    
    // Ordena todos por data
    Object.keys(historyMap).forEach(ex => {
        historyMap[ex].sort((a, b) => a.date - b.date);
    });
    
    // --- 1. GRÁFICO FORÇA (Barra & Abdominal) ---
    if (charts.tafStrength) charts.tafStrength.destroy();
    
    const strengthLabels = Array.from(new Set([
        ...historyMap["Barra Fixa"].map(x => x.dateStr),
        ...historyMap["Abdominal Remador"].map(x => x.dateStr)
    ])).sort((a,b) => parseDate(a) - parseDate(b));
    
    const barraDataset = strengthLabels.map(l => {
        const find = historyMap["Barra Fixa"].find(x => x.dateStr === l);
        return find ? find.val : null;
    });
    const abdominalDataset = strengthLabels.map(l => {
        const find = historyMap["Abdominal Remador"].find(x => x.dateStr === l);
        return find ? find.val : null;
    });
    
    const ctxStrength = document.getElementById("chart-taf-strength").getContext("2d");
    charts.tafStrength = new Chart(ctxStrength, {
        type: 'line',
        data: {
            labels: strengthLabels.length > 0 ? strengthLabels : ['Sem Dados'],
            datasets: [
                { label: 'Barra Fixa (Meta: 4)', data: barraDataset.length > 0 ? barraDataset : [0], borderColor: '#00e5ff', backgroundColor: 'transparent', borderWidth: 2, tension: 0.2 },
                { label: 'Abdominal (Meta: 35)', data: abdominalDataset.length > 0 ? abdominalDataset : [0], borderColor: '#f59e0b', backgroundColor: 'transparent', borderWidth: 2, tension: 0.2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, ticks: { color: textColor } },
                y: { grid: { color: gridColor }, ticks: { color: textColor } }
            },
            plugins: { legend: { labels: { color: textColor } } }
        }
    });
    
    // --- 2. GRÁFICO CARDIO (Corrida & Meio Sugado) ---
    if (charts.tafCardio) charts.tafCardio.destroy();
    
    const cardioLabels = Array.from(new Set([
        ...historyMap["Corrida"].map(x => x.dateStr),
        ...historyMap["Meio Sugado"].map(x => x.dateStr)
    ])).sort((a,b) => parseDate(a) - parseDate(b));
    
    const corridaDataset = cardioLabels.map(l => {
        const find = historyMap["Corrida"].find(x => x.dateStr === l);
        return find ? find.val : null;
    });
    const sugadoDataset = cardioLabels.map(l => {
        const find = historyMap["Meio Sugado"].find(x => x.dateStr === l);
        return find ? find.val : null;
    });
    
    const ctxCardio = document.getElementById("chart-taf-cardio").getContext("2d");
    charts.tafCardio = new Chart(ctxCardio, {
        type: 'line',
        data: {
            labels: cardioLabels.length > 0 ? cardioLabels : ['Sem Dados'],
            datasets: [
                { label: 'Corrida (Metros - Meta: 2400)', data: corridaDataset.length > 0 ? corridaDataset : [0], borderColor: '#10b981', yAxisID: 'yRun', backgroundColor: 'transparent', borderWidth: 2 },
                { label: 'Meio Sugado (Meta: 25)', data: sugadoDataset.length > 0 ? sugadoDataset : [0], borderColor: '#ef4444', yAxisID: 'ySugado', backgroundColor: 'transparent', borderWidth: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, ticks: { color: textColor } },
                yRun: { position: 'left', grid: { color: gridColor }, ticks: { color: textColor } },
                ySugado: { position: 'right', grid: { display: false }, ticks: { color: textColor } }
            },
            plugins: { legend: { labels: { color: textColor } } }
        }
    });
}

// ==========================================================================
// 📅 Histórico de Atividades (Tela 4)
// ==========================================================================
function renderHistory() {
    const tbody = document.getElementById("history-table-body");
    tbody.innerHTML = "";
    
    const searchVal = document.getElementById("history-search").value.toLowerCase();
    const typeFilter = document.getElementById("history-filter-type").value;
    
    // Mescla todos os registros em uma única lista cronológica
    let list = [];
    
    // 1. Estudos Diários
    if (typeFilter === 'all' || typeFilter === 'estudos') {
        state.registroEstudos.forEach(s => {
            list.push({
                date: s.date,
                cat: "Estudo Diário",
                desc: `<b>${s.subject}</b> - ${s.topic}`,
                detail: `<span class="badge-study-type ${s.type.toLowerCase()}">${s.type}</span> | ${s.duration} min | ${s.correct}/${s.questions} Qs`,
                notes: s.notes,
                raw: s
            });
        });
    }
    
    // 2. Simulados Teóricos
    if (typeFilter === 'all' || typeFilter === 'simulados') {
        state.simuladosCab.forEach(c => {
            // Busca detalhes deste simulado
            const details = state.simuladosDet.filter(d => d.simId === c.id);
            const subjectsList = details.map(d => d.subject).filter((v, i, a) => a.indexOf(v) === i).join(", ");
            const pct = c.totalQuestions > 0 ? (c.totalCorrect / c.totalQuestions * 100) : 0;
            
            list.push({
                date: c.date,
                cat: "Simulado Teórico",
                desc: `<b>${c.name}</b><br><span style="font-size: 11px; color: var(--text-muted);">${subjectsList}</span>`,
                detail: `<span class="badge-study-type simulado">SIMULADO</span> | <b>${c.totalCorrect}/${c.totalQuestions}</b> (${pct.toFixed(0)}%)`,
                notes: `Simulado Geral registrado com ${details.length} disciplinas.`,
                raw: c
            });
        });
    }
    
    // 3. Treino TAF
    if (typeFilter === 'all' || typeFilter === 'taf') {
        state.treinoTaf.forEach(t => {
            let resText = t.exercise === "Corrida" ? `${t.result}m` : `${t.result} reps`;
            list.push({
                date: t.date,
                cat: "Treino TAF",
                desc: `Treino de <b>${t.exercise}</b>`,
                detail: `${resText} (Meta: ${t.target}) | <span style="font-weight:600; color: ${t.result >= t.target ? 'var(--success)' : 'var(--danger)'};">${t.status}</span>`,
                notes: `Séries: ${t.sets || 1} | Descanso: ${t.restTime || 0}s | Tempo total: ${t.duration || 0}m`,
                raw: t
            });
        });
    }
    
    // 4. Simulado TAF
    if (typeFilter === 'all' || typeFilter === 'taf-sim') {
        state.simuladosTaf.forEach(s => {
            const passed = s.status.includes("APROVADO");
            list.push({
                date: s.date,
                cat: "Simulado TAF Completo",
                desc: `<b>Avaliação Completa TAF</b>`,
                detail: `Barra: ${s.barra} | Sugado: ${s.sugado} | Abd: ${s.abdominal} | Corrida: ${s.corrida}m | <span style="font-weight:700; color: ${passed ? 'var(--success)' : 'var(--danger)'};">${s.status}</span>`,
                notes: s.notes,
                raw: s
            });
        });
    }
    
    // Filtro de Busca textual
    if (searchVal) {
        list = list.filter(item => 
            item.desc.toLowerCase().includes(searchVal) || 
            item.cat.toLowerCase().includes(searchVal) ||
            item.notes.toLowerCase().includes(searchVal) ||
            item.date.includes(searchVal)
        );
    }
    
    // Ordena por data decrescente
    list.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="center empty-state">Nenhum registro encontrado correspondente aos filtros.</td></tr>`;
        return;
    }
    
    list.forEach(item => {
        const row = document.createElement("tr");
        const catEscaped = item.cat.replace(/'/g, "\\'");
        const rawJsonStr = encodeURIComponent(JSON.stringify(item.raw));
        row.innerHTML = `
            <td><b>${item.date}</b></td>
            <td><span class="badge" style="background: var(--border-light); border-color: var(--border-light); color: var(--text-primary);">${item.cat}</span></td>
            <td>${item.desc}</td>
            <td>${item.detail}</td>
            <td style="font-size: 11px; color: var(--text-secondary); max-width: 250px;">${item.notes}</td>
            <td>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-outline btn-sm" onclick="handleEditHistory('${catEscaped}', '${rawJsonStr}')" title="Editar registro" style="padding: 4px 8px; font-size: 11px;">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="handleDeleteHistory('${catEscaped}', '${rawJsonStr}')" title="Excluir registro" style="padding: 4px 8px; font-size: 11px; border-color: rgba(239, 68, 68, 0.2); color: var(--danger);">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

document.getElementById("history-search").addEventListener("input", renderHistory);
document.getElementById("history-filter-type").addEventListener("change", renderHistory);

// ==========================================================================
// 📓 Caderno de Erros (Tela 5)
// ==========================================================================
function renderErrors() {
    const grid = document.getElementById("erros-cards-container");
    const subjectFilter = document.getElementById("erros-filter-subject");
    grid.innerHTML = "";
    
    // Atualiza filtro de matérias disponíveis
    const subjectsWithErrors = Array.from(new Set(state.simuladosDet.filter(d => d.errors > 0 && d.notes).map(d => d.subject)));
    
    // Guarda valor atual
    const currentFilterVal = subjectFilter.value;
    subjectFilter.innerHTML = `<option value="all">Todas as Matérias</option>`;
    subjectsWithErrors.forEach(sub => {
        const opt = document.createElement("option");
        opt.value = sub;
        opt.innerText = sub;
        if (sub === currentFilterVal) opt.selected = true;
        subjectFilter.appendChild(opt);
    });
    
    const searchVal = document.getElementById("erros-search").value.toLowerCase();
    const filterSubject = subjectFilter.value;
    
    // Monta lista de erros ativos (aqueles em simulados que têm anotação de erro e flag "needsReview = true")
    let errorsList = [];
    state.simuladosDet.forEach(d => {
        if (d.errors > 0 && d.notes && d.needsReview) {
            // Encontra cabeçalho do simulado correspondente
            const cab = state.simuladosCab.find(c => c.id === d.simId);
            const dateStr = cab ? cab.date : "";
            
            if (filterSubject !== 'all' && d.subject !== filterSubject) return;
            if (searchVal && !d.notes.toLowerCase().includes(searchVal) && !d.topic.toLowerCase().includes(searchVal) && !d.subject.toLowerCase().includes(searchVal)) return;
            
            errorsList.push({
                simId: d.simId,
                simName: cab ? cab.name : "Simulado Geral",
                date: dateStr,
                subject: d.subject,
                topic: d.topic,
                notes: d.notes,
                raw: d
            });
        }
    });
    
    if (errorsList.length === 0) {
        grid.innerHTML = `<p class="empty-state"><i class="fa-solid fa-square-check" style="font-size: 32px; color: var(--success); margin-bottom: 12px; display: block;"></i>Caderno de Erros limpo! Continue resolvendo simulados.</p>`;
        return;
    }
    
    errorsList.forEach(err => {
        const card = document.createElement("div");
        card.className = "erro-card";
        
        const safeKey = (err.simId + '_' + err.subject + '_' + err.topic).replace(/[^a-zA-Z0-9]/g, '_');
        card.innerHTML = `
            <div>
                <div class="erro-subject">${err.subject}</div>
                <div class="erro-topic">${err.topic}</div>
                <div class="erro-desc-container" style="position: relative; margin-top: 10px;">
                    <div class="erro-desc" id="desc-view-${safeKey}">"${err.notes}"</div>
                    <textarea id="desc-edit-${safeKey}" class="form-control" style="display: none; width: 100%; font-size: 13px; margin-top: 5px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-light); color: var(--text-primary); padding: 8px; border-radius: 8px;" rows="3">${err.notes}</textarea>
                    <div id="desc-actions-${safeKey}" style="display: none; justify-content: flex-end; gap: 8px; margin-top: 8px;">
                        <button class="btn btn-outline btn-sm" onclick="cancelEditErrorNotes('${safeKey}')" style="font-size: 11px; padding: 4px 8px;">Cancelar</button>
                        <button class="btn btn-primary btn-sm" onclick="saveEditErrorNotes('${safeKey}', '${err.simId}', '${err.subject.replace(/'/g, "\\'")}', '${err.topic.replace(/'/g, "\\'")}')" style="font-size: 11px; padding: 4px 8px;">Salvar</button>
                    </div>
                </div>
            </div>
            <div class="erro-footer">
                <span class="erro-date"><i class="fa-solid fa-calendar"></i> ${err.date} (${err.simName})</span>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-outline btn-sm" onclick="startEditErrorNotes('${safeKey}')" title="Editar anotação" style="padding: 4px 8px; font-size: 11px;">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="handleMarkErrorResolved('${err.simId}', '${err.subject.replace(/'/g, "\\'")}', '${err.topic.replace(/'/g, "\\'")}')" style="padding: 4px 8px; font-size: 11px;">
                        <i class="fa-solid fa-check"></i> Revisado
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

async function handleMarkErrorResolved(simId, subject, topic) {
    // Local update
    const find = state.simuladosDet.find(d => d.simId === simId && d.subject === subject && d.topic === topic);
    if (find) {
        find.needsReview = false;
    }
    
    if (state.mode === "synced" && state.apiUrl) {
        try {
            await fetch(state.apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggleErrorReview', simId, subject, topic, needsReview: false })
            });
        } catch (e) {
            console.error("Erro ao sincronizar caderno de erros:", e);
        }
    } else {
        saveLocalDataToStorage();
    }
    processDataAndRender();
}

document.getElementById("erros-search").addEventListener("input", renderErrors);
document.getElementById("erros-filter-subject").addEventListener("change", renderErrors);

// ==========================================================================
// ✍️ Configuração e Inicialização de Formulários & Modais
// ==========================================================================
function initForms() {
    // 1. Modal Registro Estudo
    const studySubSelect = document.getElementById("study-subject");
    const studyTopSelect = document.getElementById("study-topic");
    
    // (As matérias serão populadas dinamicamente via populateFormDropdowns após o carregamento dos dados)
    
    // Atualiza tópicos ao mudar matéria
    studySubSelect.addEventListener("change", () => {
        const selSub = studySubSelect.value;
        studyTopSelect.innerHTML = `<option value="">Escolha o assunto...</option>`;
        if (selSub) {
            const filteredTopics = state.edital.filter(t => t.subject === selSub);
            filteredTopics.forEach(t => {
                const opt = document.createElement("option");
                opt.value = t.topic;
                opt.innerText = t.topic;
                studyTopSelect.appendChild(opt);
            });
        }
    });
    
    // Visualização da taxa de acertos em tempo real no formulário
    const qInput = document.getElementById("study-questions");
    const cInput = document.getElementById("study-correct");
    const preview = document.getElementById("study-accuracy-preview");
    
    function updateAccuracyPreview() {
        const q = parseInt(qInput.value) || 0;
        const c = parseInt(cInput.value) || 0;
        if (q > 0) {
            const pct = (c / q * 100);
            preview.value = `${pct.toFixed(0)}%`;
            if (pct >= 80) preview.style.color = "var(--success)";
            else if (pct >= 60) preview.style.color = "var(--warning)";
            else preview.style.color = "var(--danger)";
        } else {
            preview.value = "0%";
            preview.style.color = "inherit";
        }
    }
    qInput.addEventListener("input", updateAccuracyPreview);
    cInput.addEventListener("input", updateAccuracyPreview);
    
    // Envio do formulário de Estudo
    document.getElementById("form-add-study").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const dateRaw = document.getElementById("study-date").value;
        const dateParts = dateRaw.split("-");
        const dateFormatted = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        
        const newStudy = {
            date: dateFormatted,
            subject: studySubSelect.value,
            topic: studyTopSelect.value,
            type: document.getElementById("study-type").value,
            duration: parseInt(document.getElementById("study-duration").value),
            questions: parseInt(qInput.value) || 0,
            correct: parseInt(cInput.value) || 0,
            errors: Math.max(0, (parseInt(qInput.value) || 0) - (parseInt(cInput.value) || 0)),
            notes: document.getElementById("study-notes").value
        };
        newStudy.accuracy = newStudy.questions > 0 ? (newStudy.correct / newStudy.questions) : 0.0;
        
        // Salva
        if (state.mode === "synced" && state.apiUrl) {
            try {
                await fetch(state.apiUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'addStudy', ...newStudy })
                });
                
                // Atualiza estatísticas do edital
                await fetch(state.apiUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'toggleEdital', 
                        subject: newStudy.subject, 
                        topic: newStudy.topic, 
                        studied: true,
                        questions: newStudy.questions,
                        correct: newStudy.correct
                    })
                });
            } catch (e) {
                console.error(e);
            }
        } else {
            state.registroEstudos.push(newStudy);
            // Atualiza edital local
            const edTopic = state.edital.find(x => x.subject === newStudy.subject && x.topic === newStudy.topic);
            if (edTopic) {
                edTopic.studied = true;
                edTopic.questions += newStudy.questions;
                edTopic.correct += newStudy.correct;
            }
            saveLocalDataToStorage();
        }
        
        // Se havia uma conclusão de cronograma vinculada a este envio, executa agora
        if (pendingCronoConcludeDate) {
            await concludeCronoDayDirectly(pendingCronoConcludeDate);
            pendingCronoConcludeDate = null;
        }
        
        closeModal('modal-study');
        document.getElementById("form-add-study").reset();
        preview.value = "0%";
        
        alert("Sessão de estudos gravada com sucesso!");
        refreshData();
    });

    // 2. Modal do Simulado Mestre-Detalhe
    const detailRowsContainer = document.getElementById("sim-detail-rows");
    
    // Função para criar uma linha dinâmica no simulado
    function createSimulateRow() {
        const row = document.createElement("tr");
        
        // Popula as matérias
        let options = `<option value="">Escolha a matéria...</option>`;
        subjectsList.forEach(sub => {
            options += `<option value="${sub}">${sub}</option>`;
        });
        
        row.innerHTML = `
            <td>
                <select class="sim-row-subject" required style="width: 100%;">
                    ${options}
                </select>
            </td>
            <td>
                <select class="sim-row-topic" required style="width: 100%;">
                    <option value="">Selecione a matéria</option>
                </select>
            </td>
            <td>
                <input type="number" class="sim-row-questions" required min="1" style="width: 100%;" placeholder="Qtd">
            </td>
            <td>
                <input type="number" class="sim-row-correct" required min="0" style="width: 100%;" placeholder="Acertos">
            </td>
            <td>
                <input type="text" class="sim-row-notes" style="width: 100%;" placeholder="O que você errou?">
            </td>
            <td style="text-align: center;">
                <input type="checkbox" class="sim-row-review" checked>
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.parentElement.remove(); recalculateSimTotals();" style="padding: 6px 10px;">&times;</button>
            </td>
        `;
        
        // Configura listener de matérias da linha
        const subSelect = row.querySelector(".sim-row-subject");
        const topSelect = row.querySelector(".sim-row-topic");
        
        subSelect.addEventListener("change", () => {
            const selSub = subSelect.value;
            topSelect.innerHTML = `<option value="">Escolha o assunto...</option>`;
            if (selSub) {
                const filteredTopics = state.edital.filter(t => t.subject === selSub);
                filteredTopics.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t.topic;
                    opt.innerText = t.topic;
                    topSelect.appendChild(opt);
                });
            }
        });
        
        // Atualiza totais na alteração de questões/acertos
        row.querySelector(".sim-row-questions").addEventListener("input", recalculateSimTotals);
        row.querySelector(".sim-row-correct").addEventListener("input", recalculateSimTotals);
        
        detailRowsContainer.appendChild(row);
    }
    
    document.getElementById("btn-add-sim-row").addEventListener("click", createSimulateRow);
    
    // Abre formulário de simulado e limpa o anterior
    document.getElementById("btn-open-simulado").addEventListener("click", () => {
        detailRowsContainer.innerHTML = "";
        document.getElementById("form-add-simulado").reset();
        document.getElementById("sim-date").value = new Date().toISOString().substring(0, 10);
        // Inicia com 2 linhas padrão
        createSimulateRow();
        createSimulateRow();
        recalculateSimTotals();
        openModal('modal-simulado');
    });
    
    // Envio do formulário de Simulado
    document.getElementById("form-add-simulado").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = document.getElementById("sim-name").value;
        const dateRaw = document.getElementById("sim-date").value;
        const dateParts = dateRaw.split("-");
        const dateFormatted = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        
        // Captura linhas de detalhes
        const rows = detailRowsContainer.querySelectorAll("tr");
        const details = [];
        let tQuestions = 0;
        let tCorrect = 0;
        
        let valid = true;
        
        rows.forEach(row => {
            const sub = row.querySelector(".sim-row-subject").value;
            const top = row.querySelector(".sim-row-topic").value;
            const questions = parseInt(row.querySelector(".sim-row-questions").value) || 0;
            const correct = parseInt(row.querySelector(".sim-row-correct").value) || 0;
            const notes = row.querySelector(".sim-row-notes").value;
            const needsReview = row.querySelector(".sim-row-review").checked;
            
            if (!sub || !top) {
                valid = false;
                return;
            }
            
            tQuestions += questions;
            tCorrect += correct;
            
            details.push({
                subject: sub,
                topic: top,
                questions,
                correct,
                errors: Math.max(0, questions - correct),
                notes,
                needsReview
            });
        });
        
        if (!valid || details.length === 0) {
            alert("Preencha todas as matérias e assuntos selecionados nas linhas do simulado.");
            return;
        }
        
        const payload = {
            name,
            date: dateFormatted,
            totalQuestions: tQuestions,
            totalCorrect: tCorrect,
            details
        };
        
        if (state.mode === "synced" && state.apiUrl) {
            try {
                // Salva Simulado
                const response = await fetch(state.apiUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'addSimulado', ...payload })
                });
                
                // Atualiza edital para cada matéria simulada
                for (let detail of details) {
                    await fetch(state.apiUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            action: 'toggleEdital', 
                            subject: detail.subject, 
                            topic: detail.topic, 
                            studied: true,
                            questions: detail.questions,
                            correct: detail.correct
                        })
                    });
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            const simId = 'SIM-' + new Date().getTime();
            state.simuladosCab.push({
                id: simId, name, date: dateFormatted, totalQuestions: tQuestions, totalCorrect: tCorrect
            });
            details.forEach(d => {
                state.simuladosDet.push({
                    simId, ...d
                });
                // Atualiza edital local
                const edTopic = state.edital.find(x => x.subject === d.subject && x.topic === d.topic);
                if (edTopic) {
                    edTopic.studied = true;
                    edTopic.questions += d.questions;
                    edTopic.correct += d.correct;
                }
            });
            saveLocalDataToStorage();
        }
        
        closeModal('modal-simulado');
        alert("Simulado Geral gravado com sucesso!");
        refreshData();
    });

    // 3. Envio do Formulário do TAF (Treino Diário)
    document.getElementById("form-taf-workout").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const ex = exerciseSelect.value;
        const dateRaw = document.getElementById("taf-workout-date").value;
        const dateParts = dateRaw.split("-");
        const dateFormatted = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        
        let result = 0;
        let sets = parseInt(document.getElementById("taf-workout-sets").value) || 1;
        
        if (ex === "Corrida") {
            result = parseFloat(document.getElementById("taf-workout-distance").value) || 0;
            sets = 1;
        } else {
            result = parseFloat(document.getElementById("taf-workout-reps").value) || 0;
        }
        
        const target = TAF_METAS[ex].target;
        
        const payload = {
            date: dateFormatted,
            exercise: ex,
            result,
            target,
            sets,
            restTime: parseInt(document.getElementById("taf-workout-rest").value) || 0,
            duration: parseInt(document.getElementById("taf-workout-duration").value) || 0
        };
        
        if (state.mode === "synced" && state.apiUrl) {
            try {
                await fetch(state.apiUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'addTAF', ...payload })
                });
            } catch (e) { console.error(e); }
        } else {
            state.treinoTaf.push({
                ...payload,
                accuracy: result / target,
                status: result >= target ? 'META ALCANÇADA' : 'ABAIXO DA META'
            });
            saveLocalDataToStorage();
        }
        
        document.getElementById("form-taf-workout").reset();
        renderTAF();
        alert("Treino TAF salvo!");
        refreshData();
    });

    // 4. Envio do Formulário do Simulado Completo TAF
    document.getElementById("form-taf-simulado").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const dateRaw = document.getElementById("taf-sim-date").value;
        const dateParts = dateRaw.split("-");
        const dateFormatted = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        
        const barra = parseInt(document.getElementById("taf-sim-barra").value) || 0;
        const sugado = parseInt(document.getElementById("taf-sim-sugado").value) || 0;
        const abdominal = parseInt(document.getElementById("taf-sim-abdominal").value) || 0;
        const corrida = parseInt(document.getElementById("taf-sim-corrida").value) || 0;
        const duration = parseInt(document.getElementById("taf-sim-duration").value) || 0;
        const notes = document.getElementById("taf-sim-notes").value;
        
        // Verifica se foi aprovado em TODOS os índices mínimos exigidos
        const passed = (barra >= TAF_METAS["Barra Fixa"].target) &&
                       (sugado >= TAF_METAS["Meio Sugado"].target) &&
                       (abdominal >= TAF_METAS["Abdominal Remador"].target) &&
                       (corrida >= TAF_METAS["Corrida"].target);
                       
        const payload = {
            date: dateFormatted,
            barra,
            sugado,
            abdominal,
            corrida,
            duration,
            passed,
            notes
        };
        
        if (state.mode === "synced" && state.apiUrl) {
            try {
                await fetch(state.apiUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'addTAFSimulado', ...payload })
                });
            } catch (e) { console.error(e); }
        } else {
            state.simuladosTaf.push({
                date: dateFormatted,
                barra,
                sugado,
                abdominal,
                corrida,
                duration,
                status: passed ? 'APROVADO NO TAF' : 'NÃO ALCANÇADO',
                notes
            });
            saveLocalDataToStorage();
        }
        
        document.getElementById("form-taf-simulado").reset();
        alert("Simulado TAF registrado com sucesso!");
        refreshData();
    });

    // 5. Configuração da API do Google Sheets
    document.getElementById("btn-save-config").addEventListener("click", () => {
        const url = document.getElementById("config-api-url").value.trim();
        if (url) {
            localStorage.setItem("qg-api-url", url);
            state.apiUrl = url;
            state.mode = "synced";
            alert("URL do Google Sheets configurada! Tentando conectar...");
            refreshData();
        } else {
            localStorage.removeItem("qg-api-url");
            state.apiUrl = "";
            state.mode = "offline";
            alert("Configuração limpa. Voltando para modo local offline.");
            refreshData();
        }
    });
    
    // Testar conexão
    document.getElementById("btn-test-connection").addEventListener("click", async () => {
        const url = document.getElementById("config-api-url").value.trim();
        if (!url) {
            alert("Insira uma URL primeiro.");
            return;
        }
        
        try {
            const res = await fetch(`${url}?action=getData`);
            const json = await res.json();
            if (json.status === "success") {
                alert("Conexão bem sucedida com o Google Planilhas!");
            } else {
                alert("Conectou, mas o script retornou erro: " + json.message);
            }
        } catch (e) {
            alert("Falha na conexão. Verifique a URL e garanta que configurou como 'Acesso para qualquer pessoa'. Erro: " + e);
        }
    });

    // Botão Concluir Dia do Ciclo
    document.getElementById("btn-conclude-day").addEventListener("click", async () => {
        const todayStr = new Date().toLocaleDateString('pt-BR');
        const btn = document.getElementById("btn-conclude-day");
        const action = btn.getAttribute("data-action");
        
        if (action === "undo") {
            await handleUnconcludeCronoDay(todayStr);
        } else {
            await handleConcludeCronoDay(todayStr);
        }
    });

    // Botões de Dados Demo / Limpar Local
    document.getElementById("btn-use-demo-data").addEventListener("click", loadDemoData);
    document.getElementById("btn-clear-local-db").addEventListener("click", () => {
        if (confirm("Tem certeza que deseja deletar todos os dados locais salvos no navegador?")) {
            localStorage.clear();
            state.mode = "offline";
            state.apiUrl = "";
            loadConfig();
            refreshData();
            alert("Dados limpos.");
        }
    });

    // Listeners do Cronograma Completo
    const cronoSearch = document.getElementById("crono-search");
    if (cronoSearch) {
        cronoSearch.addEventListener("input", renderCronograma);
        
        document.getElementById("btn-crono-all").addEventListener("click", () => {
            toggleCronoFilterButton("btn-crono-all");
            renderCronograma();
        });
        document.getElementById("btn-crono-pending").addEventListener("click", () => {
            toggleCronoFilterButton("btn-crono-pending");
            renderCronograma();
        });
        document.getElementById("btn-crono-completed").addEventListener("click", () => {
            toggleCronoFilterButton("btn-crono-completed");
            renderCronograma();
        });
    }

    document.getElementById("btn-import-local-json").addEventListener("click", () => {
        const text = document.getElementById("config-import-json").value.trim();
        if (!text) {
            alert("Cole o conteúdo do arquivo JSON primeiro!");
            return;
        }
        try {
            const data = JSON.parse(text);
            if (data.crono && data.edital && data.estudos && data.taf) {
                state.crono = data.crono;
                state.edital = data.edital;
                state.registroEstudos = data.estudos;
                state.treinoTaf = data.taf;
                state.simuladosTaf = data.taf_sim || [];
                state.simuladosCab = [];
                state.simuladosDet = [];
                
                state.mode = "offline";
                localStorage.removeItem("qg-api-url");
                state.apiUrl = "";
                document.getElementById("config-api-url").value = "";
                
                saveLocalDataToStorage();
                alert("Dados locais importados com sucesso! Sincronização offline ativada.");
                document.getElementById("config-import-json").value = "";
                refreshData();
            } else {
                alert("O JSON fornecido não contém a estrutura esperada de estudos e treinos.");
            }
        } catch (e) {
            alert("Erro ao ler o JSON: " + e.message);
        }
    });
}

// Recalcular totais no formulário de simulados dinâmicos
function recalculateSimTotals() {
    const container = document.getElementById("sim-detail-rows");
    const qInputs = container.querySelectorAll(".sim-row-questions");
    const cInputs = container.querySelectorAll(".sim-row-correct");
    
    let tQ = 0;
    let tC = 0;
    
    qInputs.forEach(input => tQ += parseInt(input.value) || 0);
    cInputs.forEach(input => tC += parseInt(input.value) || 0);
    
    document.getElementById("sim-total-questions").innerText = tQ;
    document.getElementById("sim-total-correct").innerText = tC;
    
    const pct = tQ > 0 ? (tC / tQ * 100) : 0;
    document.getElementById("sim-total-pct").innerText = `${pct.toFixed(0)}%`;
}

// Controladores de abertura de modal
function openModal(id) {
    document.getElementById(id).classList.add("active");
    if (id === 'modal-study') {
        document.getElementById("study-date").value = new Date().toISOString().substring(0, 10);
    }
}

function closeModal(id) {
    document.getElementById(id).classList.remove("active");
    if (id === 'modal-study') {
        pendingCronoConcludeDate = null;
    }
}

// Expõe funções auxiliares globalmente para uso direto no HTML inline
window.closeModal = closeModal;

// ==========================================================================
// 🧪 Geração de Dados de Demonstração (Demo Seeding)
// ==========================================================================
function loadDemoData() {
    // 1. Cronograma de Estudos (Gera 10 dias de exemplo ao redor de hoje)
    const today = new Date();
    const cronoDemo = [];
    const subjects = ["Língua Portuguesa", "História do Brasil", "História do Maranhão", "Geografia do Brasil", "Geografia do Maranhão", "Legislação Pertinente à PMMA", "Legislação Institucional", "Noções de Informática"];
    
    for (let i = -3; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);
        
        cronoDemo.push({
            date: d.toLocaleDateString('pt-BR'),
            dia: d.toLocaleTextDay(),
            semana: `Semana ${Math.max(1, Math.ceil((i+4)/7))}`,
            m1: subjects[Math.abs(i) % subjects.length],
            a1: "Tópico de demonstração do edital oficial " + (Math.abs(i) + 1),
            m2: i === 6 ? "DESCANSO" : subjects[(Math.abs(i) + 1) % subjects.length],
            a2: i === 6 ? "Recuperação muscular e descanso" : "Tópico secundário de estudos do dia",
            ciclo: "Revisão -> Teoria -> Questões",
            foco: "80% Questões / 20% Teoria",
            completed: i < 0
        });
    }
    
    // 2. Registro de Estudos (6 sessões)
    const estudosDemo = [
        { date: getPastDateString(3), subject: "Língua Portuguesa", topic: "Compreensão e interpretação de textos de gêneros variados. Reconhecimento de tipos e gêneros textuais.", type: "Questões", duration: 90, questions: 20, correct: 18, errors: 2, accuracy: 0.9, notes: "Focar em conjunções concessivas da Cebraspe que mudam o sentido." },
        { date: getPastDateString(2), subject: "Legislação Pertinente à PMMA", topic: "Decreto nº 88.777/1983 (R-200) e suas alterações - Capítulos I a III (Conceitos básicos, subordinação).", type: "Teoria", duration: 180, questions: 40, correct: 34, errors: 6, accuracy: 0.85, notes: "Decorar art. 12 sobre competência de fiscalização." },
        { date: getPastDateString(2), subject: "Geografia do Brasil", topic: "População, urbanização e migrações internas.", type: "Teoria", duration: 45, questions: 15, correct: 13, errors: 2, accuracy: 0.86, notes: "Revisar migração de transumância." },
        { date: getPastDateString(1), subject: "História do Brasil", topic: "A República Velha e as estruturas oligárquicas.", type: "Revisão", duration: 60, questions: 20, correct: 20, errors: 0, accuracy: 1.0, notes: "Política do Café com Leite dominada por SP e MG." },
        { date: getPastDateString(1), subject: "Geografia do Maranhão", topic: "Climas do Maranhão: pluviosidade e temperatura.", type: "Teoria", duration: 60, questions: 20, correct: 20, errors: 0, accuracy: 1.0, notes: "Maranhão possui clima equatorial e tropical." }
    ];
    
    // 3. Simulados
    const simCabDemo = [
        { id: "SIM-DEMO-1", name: "Simulado Semanal Cebraspe 1", date: getPastDateString(1), totalQuestions: 30, totalCorrect: 25 }
    ];
    
    const simDetDemo = [
        { simId: "SIM-DEMO-1", subject: "Língua Portuguesa", topic: "Compreensão e interpretação de textos de gêneros variados. Reconhecimento de tipos e gêneros textuais.", questions: 10, correct: 8, errors: 2, notes: "Errei identificação de texto dissertativo subjetivo.", needsReview: true },
        { simId: "SIM-DEMO-1", subject: "Noções de Informática", topic: "Noções de sistema operacional (ambientes Linux e Windows) e gerenciamento de arquivos/pastas.", questions: 10, correct: 9, errors: 1, notes: "Permissão de arquivo no Linux chmod 755 errei a conta.", needsReview: true },
        { simId: "SIM-DEMO-1", subject: "História do Maranhão", topic: "França equinocial: expedição de Daniel de La Touche.", questions: 10, correct: 8, errors: 2, notes: "Errei o ano exato da fundação do forte de São Luís.", needsReview: true }
    ];
    
    // 4. TAF Treino
    const tafDemo = [
        { date: getPastDateString(2), exercise: "Barra Fixa", result: 2, target: 4, accuracy: 0.5, status: "ABAIXO DA META", sets: 3, restTime: 90, duration: 20 },
        { date: getPastDateString(2), exercise: "Meio Sugado", result: 15, target: 25, accuracy: 0.6, status: "ABAIXO DA META", sets: 1, restTime: 0, duration: 10 },
        { date: getPastDateString(1), exercise: "Barra Fixa", result: 3, target: 4, accuracy: 0.75, status: "ABAIXO DA META", sets: 3, restTime: 90, duration: 20 },
        { date: getPastDateString(1), exercise: "Abdominal Remador", result: 36, target: 35, accuracy: 1.02, status: "META ALCANÇADA", sets: 2, restTime: 60, duration: 15 }
    ];
    
    const tafSimDemo = [
        { date: getPastDateString(0), barra: 4, sugado: 26, abdominal: 38, corrida: 2420, duration: 45, status: "APROVADO NO TAF", notes: "Consegui bater todas as metas raspando. Melhorar a barra!" }
    ];
    
    // Inicializa edital atualizado com base nos estudos demo
    const editalDemo = DEFAULT_SYLLABUS.map(t => {
        // Verifica se há sessões de estudos demo para este tópico
        let qCount = 0;
        let cCount = 0;
        let studied = false;
        
        estudosDemo.forEach(e => {
            if (e.subject === t.subject && e.topic === t.topic) {
                studied = true;
                qCount += e.questions;
                cCount += e.correct;
            }
        });
        
        simDetDemo.forEach(d => {
            if (d.subject === t.subject && d.topic === t.topic) {
                studied = true;
                qCount += d.questions;
                cCount += d.correct;
            }
        });
        
        return {
            subject: t.subject,
            topic: t.topic,
            studied,
            questions: qCount,
            correct: cCount,
            revisionStatus: studied ? "Em Revisão" : "Pendente"
        };
    });
    
    // Guarda tudo no local e atualiza state
    state.crono = cronoDemo;
    state.edital = editalDemo;
    state.registroEstudos = estudosDemo;
    state.simuladosCab = simCabDemo;
    state.simuladosDet = simDetDemo;
    state.treinoTaf = tafDemo;
    state.simuladosTaf = tafSimDemo;
    
    saveLocalDataToStorage();
    alert("Dados fictícios de demonstração carregados no navegador!");
    refreshData();
}

// Auxiliar para gerar string de data no passado
function getPastDateString(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString('pt-BR');
}

// Extensão de Date para pegar o dia da semana amigável
Date.prototype.toLocaleTextDay = function() {
    const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[this.getDay()];
};

// ==========================================================================
// 🔐 Lógica de Controle do PIN Passcode (Login)
// ==========================================================================
let typedPin = "";
let tempCreatedPin = "";
let pinStep = "verify"; // "verify", "create-1", "create-2"

function checkPasscode() {
    const savedPin = localStorage.getItem("qg-pin");
    const isAuthed = sessionStorage.getItem("qg-authenticated") === "true";
    const overlay = document.getElementById("login-overlay");
    
    if (isAuthed) {
        overlay.classList.remove("active");
        return;
    }
    
    overlay.classList.add("active");
    typedPin = "";
    updatePinDots();
    
    if (!savedPin) {
        pinStep = "create-1";
        document.getElementById("login-message").innerText = "Olá! Crie seu PIN de 4 dígitos para proteger seu QG de Estudos:";
        document.getElementById("login-hint").innerText = "Este código ficará salvo apenas no seu navegador.";
    } else {
        pinStep = "verify";
        document.getElementById("login-message").innerText = "Dispositivo Bloqueado. Digite seu PIN de acesso:";
        document.getElementById("login-hint").innerText = "Insira seu código de 4 dígitos para continuar.";
    }
}

function pressPinKey(key) {
    if (key === 'C') {
        typedPin = "";
        updatePinDots();
        return;
    }
    
    if (key === 'backspace') {
        typedPin = typedPin.slice(0, -1);
        updatePinDots();
        return;
    }
    
    if (typedPin.length < 4) {
        typedPin += key;
        updatePinDots();
    }
    
    if (typedPin.length === 4) {
        setTimeout(processPinEntry, 250);
    }
}

function updatePinDots() {
    const dots = document.querySelectorAll("#pin-dots .dot");
    dots.forEach((dot, idx) => {
        if (idx < typedPin.length) {
            dot.className = "dot filled";
        } else {
            dot.className = "dot";
        }
    });
}

function processPinEntry() {
    const savedPin = localStorage.getItem("qg-pin");
    const overlay = document.getElementById("login-overlay");
    const msg = document.getElementById("login-message");
    
    if (pinStep === "verify") {
        if (typedPin === savedPin) {
            sessionStorage.setItem("qg-authenticated", "true");
            overlay.classList.add("hidden");
            setTimeout(() => {
                overlay.classList.remove("active");
                overlay.classList.remove("hidden");
            }, 400);
        } else {
            showPinError();
            msg.innerText = "PIN incorreto! Tente novamente:";
            msg.style.color = "var(--danger)";
        }
    } else if (pinStep === "create-1") {
        tempCreatedPin = typedPin;
        typedPin = "";
        updatePinDots();
        pinStep = "create-2";
        msg.innerText = "Confirme seu PIN de 4 dígitos para gravação:";
        msg.style.color = "var(--accent)";
    } else if (pinStep === "create-2") {
        if (typedPin === tempCreatedPin) {
            localStorage.setItem("qg-pin", typedPin);
            sessionStorage.setItem("qg-authenticated", "true");
            msg.innerText = "PIN configurado com sucesso! Entrando...";
            msg.style.color = "var(--success)";
            
            setTimeout(() => {
                overlay.classList.add("hidden");
                setTimeout(() => {
                    overlay.classList.remove("active");
                    overlay.classList.remove("hidden");
                }, 400);
            }, 800);
        } else {
            showPinError();
            pinStep = "create-1";
            tempCreatedPin = "";
            msg.innerText = "Os PINs não coincidem! Digite seu novo PIN:";
            msg.style.color = "var(--danger)";
        }
    }
}

function showPinError() {
    const dots = document.querySelectorAll("#pin-dots .dot");
    dots.forEach(dot => {
        dot.className = "dot error";
    });
    typedPin = "";
    setTimeout(() => {
        updatePinDots();
    }, 600);
}

// Expõe globalmente
window.pressPinKey = pressPinKey;

// ==========================================================================
// 📅 Funções de Renderização e Ação do Cronograma
// ==========================================================================
function renderCronograma() {
    const container = document.getElementById("crono-timeline-list");
    if (!container) return;
    container.innerHTML = "";
    
    const searchVal = document.getElementById("crono-search").value.toLowerCase();
    
    // Obtém o botão de filtro ativo
    let activeFilter = "btn-crono-all";
    const activeBtn = document.querySelector(".filter-toggles button.active[id^='btn-crono-']");
    if (activeBtn) activeFilter = activeBtn.id;
    
    let filteredCrono = state.crono;
    
    // Filtros de Status
    if (activeFilter === "btn-crono-pending") {
        filteredCrono = filteredCrono.filter(c => !c.completed);
    } else if (activeFilter === "btn-crono-completed") {
        filteredCrono = filteredCrono.filter(c => c.completed);
    }
    
    // Filtro de Busca
    if (searchVal) {
        filteredCrono = filteredCrono.filter(c => 
            String(c.date).toLowerCase().includes(searchVal) ||
            c.dia.toLowerCase().includes(searchVal) ||
            c.m1.toLowerCase().includes(searchVal) ||
            c.a1.toLowerCase().includes(searchVal) ||
            (c.m2 && c.m2.toLowerCase().includes(searchVal)) ||
            (c.a2 && c.a2.toLowerCase().includes(searchVal))
        );
    }
    
    if (filteredCrono.length === 0) {
        container.innerHTML = `<p class="empty-state">Nenhum dia de estudo corresponde aos filtros.</p>`;
        return;
    }
    
    filteredCrono.forEach(c => {
        const dateStr = formatDateString(c.date);
        
        // Verifica se as matérias/assuntos são tópicos quentes
        const m1Hot = DEFAULT_SYLLABUS.find(s => s.subject.toLowerCase() === c.m1.toLowerCase() && s.topic.toLowerCase() === c.a1.toLowerCase())?.hot;
        const m2Hot = c.m2 ? DEFAULT_SYLLABUS.find(s => s.subject.toLowerCase() === c.m2.toLowerCase() && s.topic.toLowerCase() === c.a2.toLowerCase())?.hot : false;
        
        // Verifica status individual no edital
        const t1 = state.edital.find(x => x.subject === c.m1 && x.topic === c.a1);
        const t1Studied = t1 ? t1.studied : false;
        
        let m1ActionHtml = "";
        if (t1Studied) {
            m1ActionHtml = `<span style="color: var(--success); font-size: 11px; font-weight: 600; margin-left: 8px;"><i class="fa-solid fa-circle-check"></i> Estudado</span>`;
        } else {
            m1ActionHtml = `<button class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 10px; margin-left: 8px;" onclick="openStudyLogPrefilled('${dateStr}', '${c.m1.replace(/'/g, "\\'")}', '${c.a1.replace(/'/g, "\\'")}')"><i class="fa-solid fa-plus"></i> Estudar</button>`;
        }
        
        // Calcular progresso do dia baseado nos tópicos do edital
        let totalSubjects = 0;
        let studiedSubjects = 0;
        if (c.m1 && c.m1 !== "DESCANSO" && c.m1 !== "REVISÃO SEMANAL") {
            totalSubjects++;
            if (t1Studied) studiedSubjects++;
        }
        if (c.m2 && c.m2 !== "DESCANSO" && c.m2 !== "REVISÃO SEMANAL") {
            totalSubjects++;
            const t2 = state.edital.find(x => x.subject === c.m2 && x.topic === c.a2);
            if (t2 && t2.studied) studiedSubjects++;
        }
        
        let pctHtml = "";
        if (totalSubjects > 0) {
            const pct = Math.round((studiedSubjects / totalSubjects) * 100);
            if (pct === 50) {
                pctHtml = `<span class="badge" style="background: rgba(245, 158, 11, 0.12); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.25); font-size: 10px; margin-top: 6px; display: inline-block; width: max-content; padding: 2px 6px; border-radius: 4px; font-weight: 700;"><i class="fa-solid fa-star-half-stroke"></i> 50% Estudado</span>`;
            } else if (pct === 100 && !c.completed) {
                pctHtml = `<span class="badge" style="background: rgba(16, 185, 129, 0.12); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.25); font-size: 10px; margin-top: 6px; display: inline-block; width: max-content; padding: 2px 6px; border-radius: 4px; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> 100% Estudado</span>`;
            } else if (pct === 0 && !c.completed) {
                pctHtml = `<span class="badge" style="background: rgba(107, 114, 128, 0.12); color: var(--text-muted); border: 1px solid rgba(107, 114, 128, 0.25); font-size: 10px; margin-top: 6px; display: inline-block; width: max-content; padding: 2px 6px; border-radius: 4px; font-weight: 500;">Pendente</span>`;
            }
        }
        
        const card = document.createElement("div");
        card.className = `crono-card ${c.completed ? 'completed' : ''}`;
        
        // Coluna Esquerda: Informações de Tempo
        const leftHtml = `
            <div class="crono-card-left">
                <span class="crono-day-num">${c.dia.substring(0, 3)}</span>
                <span class="crono-week-num">${c.semana}</span>
                <span class="crono-date">${dateStr}</span>
                ${pctHtml}
            </div>
        `;
        
        // Coluna Meio: Matérias e Assuntos
        const m1Badge = m1Hot ? `<span class="crono-badge-hot"><i class="fa-solid fa-fire"></i> Tenente</span>` : "";
        const m2Badge = m2Hot ? `<span class="crono-badge-hot"><i class="fa-solid fa-fire"></i> Tenente</span>` : "";
        
        let middleHtml = `
            <div class="crono-card-middle">
                <div class="crono-subject-box">
                    <div class="crono-subject-header">
                        <i class="fa-solid fa-book" style="color: var(--accent);"></i>
                        <span>${c.m1}</span>
                        ${m1Badge}
                        ${m1ActionHtml}
                    </div>
                    <div class="crono-topic-text">${c.a1}</div>
                </div>
        `;
        
        if (c.m2 && c.m2 !== "DESCANSO" && c.m2 !== "REVISÃO SEMANAL") {
            const t2 = state.edital.find(x => x.subject === c.m2 && x.topic === c.a2);
            const t2Studied = t2 ? t2.studied : false;
            
            let m2ActionHtml = "";
            if (t2Studied) {
                m2ActionHtml = `<span style="color: var(--success); font-size: 11px; font-weight: 600; margin-left: 8px;"><i class="fa-solid fa-circle-check"></i> Estudado</span>`;
            } else {
                m2ActionHtml = `<button class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 10px; margin-left: 8px;" onclick="openStudyLogPrefilled('${dateStr}', '${c.m2.replace(/'/g, "\\'")}', '${c.a2.replace(/'/g, "\\'")}')"><i class="fa-solid fa-plus"></i> Estudar</button>`;
            }
            
            middleHtml += `
                <div class="crono-subject-box">
                    <div class="crono-subject-header">
                        <i class="fa-solid fa-book" style="color: var(--warning);"></i>
                        <span>${c.m2}</span>
                        ${m2Badge}
                        ${m2ActionHtml}
                    </div>
                    <div class="crono-topic-text">${c.a2}</div>
                </div>
            `;
        } else if (c.m2) {
            middleHtml += `
                <div class="crono-subject-box">
                    <div class="crono-subject-header" style="color: var(--warning);">
                        <i class="fa-solid fa-mug-hot"></i>
                        <span>${c.m2}</span>
                    </div>
                    <div class="crono-topic-text">${c.a2}</div>
                </div>
            `;
        }
        
        middleHtml += `</div>`;
        
        // Coluna Direita: Ações (Botão Reversível para desfazer conclusão errada)
        let rightHtml = "";
        if (c.completed) {
            rightHtml = `
                <div class="crono-card-right">
                    <button class="btn btn-secondary btn-sm btn-crono-completed-toggle" onclick="handleUnconcludeCronoDay('${dateStr.replace(/'/g, "\\'")}')">
                        <span class="text-completed"><i class="fa-solid fa-circle-check"></i> Concluído</span>
                        <span class="text-hover-undo"><i class="fa-solid fa-rotate-left"></i> Desfazer</span>
                    </button>
                </div>
            `;
        } else {
            rightHtml = `
                <div class="crono-card-right">
                    <button class="btn btn-primary btn-sm" onclick="handleConcludeCronoDay('${dateStr.replace(/'/g, "\\'")}')">
                        <i class="fa-solid fa-check"></i> Concluir Dia
                    </button>
                </div>
            `;
        }
        
        card.innerHTML = leftHtml + middleHtml + rightHtml;
        container.appendChild(card);
    });
}

// Abre o formulário de estudos já pré-preenchido
function openStudyLogPrefilled(dateStr, subject, topic, shouldConclude = false) {
    if (shouldConclude) {
        pendingCronoConcludeDate = dateStr;
    } else {
        pendingCronoConcludeDate = null;
    }
    
    openModal('modal-study');
    
    // Converte dateStr (DD/MM/YYYY) para YYYY-MM-DD
    const dateParts = dateStr.split("/");
    document.getElementById("study-date").value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    
    // Define a matéria e dispara o change para carregar os tópicos correspondentes
    const studySubjectSelect = document.getElementById("study-subject");
    studySubjectSelect.value = subject;
    studySubjectSelect.dispatchEvent(new Event("change"));
    
    const studyTopicSelect = document.getElementById("study-topic");
    studyTopicSelect.value = topic;
}

// Preenche matérias e tópicos nos formulários baseados no estado carregado
function populateFormDropdowns() {
    const studySubSelect = document.getElementById("study-subject");
    const studyTopSelect = document.getElementById("study-topic");
    if (!studySubSelect) return;
    
    // Salva o valor atualmente selecionado
    const currentSub = studySubSelect.value;
    const currentTop = studyTopSelect.value;
    
    const subjectsList = Array.from(new Set(state.edital.map(t => t.subject)));
    studySubSelect.innerHTML = `<option value="">Escolha a matéria...</option>`;
    subjectsList.forEach(sub => {
        const opt = document.createElement("option");
        opt.value = sub;
        opt.innerText = sub;
        studySubSelect.appendChild(opt);
    });
    
    // Restaura o valor da matéria e seus tópicos se existirem
    if (currentSub && subjectsList.includes(currentSub)) {
        studySubSelect.value = currentSub;
        studyTopSelect.innerHTML = `<option value="">Escolha o assunto...</option>`;
        const filteredTopics = state.edital.filter(t => t.subject === currentSub);
        filteredTopics.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t.topic;
            opt.innerText = t.topic;
            studyTopSelect.appendChild(opt);
        });
        
        if (currentTop && filteredTopics.some(t => t.topic === currentTop)) {
            studyTopSelect.value = currentTop;
        }
    }
}

async function handleConcludeCronoDay(dateStr) {
    const find = state.crono.find(c => formatDateString(c.date) === dateStr);
    if (!find) return;
    
    let hasM2 = find.m2 && find.m2 !== "DESCANSO" && find.m2 !== "REVISÃO SEMANAL";
    
    // Configura os botões de escolha no modal de conclusões
    const container = document.getElementById("crono-choice-buttons-container");
    if (container) {
        container.innerHTML = "";
        
        // Botão para M1
        const btnM1 = document.createElement("button");
        btnM1.className = "btn btn-primary btn-block";
        btnM1.type = "button";
        btnM1.innerHTML = `<i class="fa-solid fa-book"></i> Registrar: ${find.m1}`;
        btnM1.onclick = () => {
            closeModal('modal-crono-choices');
            openStudyLogPrefilled(dateStr, find.m1, find.a1, false);
        };
        container.appendChild(btnM1);
        
        // Botão para M2
        if (hasM2) {
            const btnM2 = document.createElement("button");
            btnM2.className = "btn btn-secondary btn-block";
            btnM2.type = "button";
            btnM2.innerHTML = `<i class="fa-solid fa-book"></i> Registrar: ${find.m2}`;
            btnM2.onclick = () => {
                closeModal('modal-crono-choices');
                openStudyLogPrefilled(dateStr, find.m2, find.a2, false);
            };
            container.appendChild(btnM2);
        }
        
        // Botão apenas concluir
        const btnOnly = document.createElement("button");
        btnOnly.className = "btn btn-outline btn-block";
        btnOnly.type = "button";
        btnOnly.innerHTML = `<i class="fa-solid fa-check"></i> Apenas Marcar Concluído`;
        btnOnly.onclick = async () => {
            closeModal('modal-crono-choices');
            await concludeCronoDayDirectly(dateStr);
        };
        container.appendChild(btnOnly);
    }
    
    openModal('modal-crono-choices');
}

async function concludeCronoDayDirectly(dateStr) {
    const find = state.crono.find(c => formatDateString(c.date) === dateStr);
    if (!find) return;
    
    find.completed = true;
    
    // Marca matéria 1 como estudada no edital
    const t1 = state.edital.find(x => x.subject === find.m1 && x.topic === find.a1);
    if (t1) t1.studied = true;
    
    // Marca matéria 2 como estudada no edital (se for matéria válida)
    let hasM2 = find.m2 && find.m2 !== "DESCANSO" && find.m2 !== "REVISÃO SEMANAL";
    if (hasM2) {
        const t2 = state.edital.find(x => x.subject === find.m2 && x.topic === find.a2);
        if (t2) t2.studied = true;
    }
    
    // Salva
    if (state.mode === "synced" && state.apiUrl) {
        try {
            await fetch(state.apiUrl, {
                method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updateCrono', date: dateStr, completed: true })
            });
            await fetch(state.apiUrl, {
                method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggleEdital', subject: find.m1, topic: find.a1, studied: true })
            });
            if (hasM2) {
                await fetch(state.apiUrl, {
                    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'toggleEdital', subject: find.m2, topic: find.a2, studied: true })
                });
            }
        } catch (e) {
            console.error("Erro ao salvar conclusão na nuvem:", e);
        }
    } else {
        saveLocalDataToStorage();
    }
    processDataAndRender();
}

async function handleUnconcludeCronoDay(dateStr) {
    const find = state.crono.find(c => formatDateString(c.date) === dateStr);
    if (!find) return;
    
    find.completed = false;
    
    // Marca matérias do dia como não estudadas no edital
    const t1 = state.edital.find(x => x.subject === find.m1 && x.topic === find.a1);
    if (t1) t1.studied = false;
    
    let hasM2 = find.m2 && find.m2 !== "DESCANSO" && find.m2 !== "REVISÃO SEMANAL";
    if (hasM2) {
        const t2 = state.edital.find(x => x.subject === find.m2 && x.topic === find.a2);
        if (t2) t2.studied = false;
    }
    
    // Salva
    if (state.mode === "synced" && state.apiUrl) {
        try {
            // 1. Atualiza cronograma no Sheets
            await fetch(state.apiUrl, {
                method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updateCrono', date: dateStr, completed: false })
            });
            
            // 2. Atualiza edital M1
            await fetch(state.apiUrl, {
                method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggleEdital', subject: find.m1, topic: find.a1, studied: false })
            });
            
            // 3. Atualiza edital M2 (se houver)
            if (hasM2) {
                await fetch(state.apiUrl, {
                    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'toggleEdital', subject: find.m2, topic: find.a2, studied: false })
                });
            }
        } catch (e) {
            console.error("Erro ao desfazer conclusão na nuvem:", e);
        }
    } else {
        saveLocalDataToStorage();
    }
    
    // Atualiza a tela
    processDataAndRender();
    alert(`Dia ${dateStr} redefinido para 'A Estudar' e tópicos do dia marcados como 'Não Estudados'.`);
}

function toggleCronoFilterButton(activeId) {
    const buttons = ["btn-crono-all", "btn-crono-pending", "btn-crono-completed"];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (id === activeId) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}

// Expõe globalmente para ações inline do HTML
window.handleConcludeCronoDay = handleConcludeCronoDay;
window.handleUnconcludeCronoDay = handleUnconcludeCronoDay;
window.openStudyLogPrefilled = openStudyLogPrefilled;
window.renderCronograma = renderCronograma;
window.concludeCronoDayDirectly = concludeCronoDayDirectly;

// ==========================================================================
// 🧠 Sistema de Simulador de Questões, Revisões Espaçadas e Extras do Dashboard
// ==========================================================================

async function loadBancoQuestoes() {
    try {
        const response = await fetch("banco_questoes.json");
        bancoQuestoes = await response.json();
        console.log(`Carregadas ${bancoQuestoes.length} questões com sucesso.`);
    } catch (err) {
        console.error("Erro ao carregar banco_questoes.json:", err);
    }
}

function initQuestoesTab() {
    const btnStart = document.getElementById("btn-start-questions");
    const btnCerto = document.getElementById("btn-answer-certo");
    const btnErrado = document.getElementById("btn-answer-errado");
    const btnNext = document.getElementById("btn-next-question");
    const btnSave = document.getElementById("btn-save-session-history");
    const btnRestart = document.getElementById("btn-restart-session");
    
    if (btnStart) btnStart.addEventListener("click", startPracticeSession);
    if (btnCerto) btnCerto.addEventListener("click", () => submitAnswer('c'));
    if (btnErrado) btnErrado.addEventListener("click", () => submitAnswer('e'));
    if (btnNext) btnNext.addEventListener("click", nextQuestion);
    if (btnSave) btnSave.addEventListener("click", saveSessionToHistory);
    if (btnRestart) btnRestart.addEventListener("click", () => {
        document.getElementById("end-session-card").style.display = "none";
        document.getElementById("placeholder-question-card").style.display = "flex";
    });
    
    const btnAddToErrors = document.getElementById("btn-add-to-errors");
    if (btnAddToErrors) {
        btnAddToErrors.addEventListener("click", async () => {
            const q = activeSession.questions[activeSession.currentIndex];
            const errRecord = {
                simId: "PRATICA_" + new Date().getTime(),
                simName: "Prática do Simulador",
                subject: q.subject,
                topic: q.topic,
                questions: 1,
                correct: 0,
                errors: 1,
                notes: `Erro no simulador: ${q.statement.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 120)}...`,
                needsReview: true
            };
            
            state.simuladosDet.push(errRecord);
            if (state.mode === "synced" && state.apiUrl) {
                try {
                    await fetch(state.apiUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'addSimulado',
                            name: "Erro do Simulador",
                            date: new Date().toLocaleDateString('pt-BR'),
                            totalQuestions: 1,
                            totalCorrect: 0,
                            details: [errRecord]
                        })
                    });
                } catch (e) {
                    console.error("Erro ao sincronizar caderno de erros:", e);
                }
            } else {
                saveLocalDataToStorage();
            }
            alert("Erro registrado no Caderno de Erros com sucesso!");
            document.getElementById("btn-add-to-errors").disabled = true;
        });
    }
}

function startPracticeSession() {
    const subFilter = document.getElementById("questoes-filter-subject").value;
    const originFilter = document.getElementById("questoes-filter-origin").value;
    const weeklyFilter = document.getElementById("questoes-filter-weekly").checked;
    const errorsFilter = document.getElementById("questoes-filter-errors-only").checked;
    const limit = parseInt(document.getElementById("questoes-filter-limit").value) || 20;
    
    // Helpers para normalização e extração de palavras-chave
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

    let filtered = bancoQuestoes;
    if (subFilter !== "all") {
        const subFilterClean = cleanText(subFilter);
        filtered = filtered.filter(q => {
            const qSubj = cleanText(q.subject);
            // Cross-mapping do dropdown
            if ((subFilterClean.includes("legisla") || subFilterClean.includes("informa")) && qSubj === "legislacao institucional") {
                return true;
            }
            return qSubj === subFilterClean;
        });
    }
    
    if (originFilter === "exam") {
        filtered = filtered.filter(q => q.document && q.document.includes("2017"));
    } else if (originFilter === "converted") {
        filtered = filtered.filter(q => !q.document || !q.document.includes("2017"));
    } else if (originFilter === "hot") {
        const hotTopics = DEFAULT_SYLLABUS.filter(t => t.hot && (subFilter === "all" || t.subject === subFilter));
        const hotTopicNames = hotTopics.map(t => t.topic.toLowerCase().trim());
        filtered = filtered.filter(q => q.topic && hotTopicNames.some(ht => q.topic.toLowerCase().trim().includes(ht) || ht.includes(q.topic.toLowerCase().trim())));
    }
    
    // Helper para verificar se uma data pertence à semana atual (segunda a domingo)
    const isDateInCurrentWeek = (dateStr) => {
        let d;
        if (dateStr.includes("/")) {
            const parts = dateStr.split("/");
            d = new Date(parts[2], parts[1] - 1, parts[0]);
        } else {
            d = new Date(dateStr);
        }
        const now = new Date();
        const currentDay = now.getDay();
        const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - distanceToMonday);
        startOfWeek.setHours(0,0,0,0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);
        
        return d >= startOfWeek && d <= endOfWeek;
    };
    
    // Coleta todos os tópicos planejados no cronograma para a semana corrente
    const weeklyCronoTopics = [];
    (state.crono || []).forEach(c => {
        if (isDateInCurrentWeek(c.date)) {
            if (c.m1 && c.m1 !== "DESCANSO" && c.m1 !== "Simulado Geral" && c.m1 !== "TAF (Físico)" && c.m1 !== "REVISÃO SEMANAL") {
                weeklyCronoTopics.push({ subject: c.m1, topic: c.a1 });
            }
            if (c.m2 && c.m2 !== "DESCANSO" && c.m2 !== "Revisão Caderno de Erros" && c.m2 !== "Simulado Geral" && c.m2 !== "TAF (Físico)" && c.m2 !== "REVISÃO SEMANAL") {
                weeklyCronoTopics.push({ subject: c.m2, topic: c.a2 });
            }
        }
    });
    
    // Coleta todos os tópicos do Caderno de Erros
    const errorTopics = (state.simuladosDet || [])
        .filter(x => x.errors > 0 || x.needsReview)
        .map(x => ({ subject: x.subject, topic: x.topic }));
    
    let finalQuestions = [];
    
    // Helper de filtragem por tópicos (via Overlap de Palavras-Chave e Cross-Mapping de Disciplinas)
    const filterByTopicsList = (questionsPool, topicsList) => {
        return questionsPool.filter(q => {
            const qSubj = cleanText(q.subject);
            const qTextClean = cleanText(q.statement + " " + (q.topic || ""));
            const qWords = new Set(qTextClean.match(/[a-z0-9]{3,}/g) || []);
            
            return topicsList.some(wt => {
                const wtSubj = cleanText(wt.subject);
                let subjectMatches = qSubj === wtSubj;
                if ((wtSubj.includes("legisla") || wtSubj.includes("informa")) && qSubj === "legislacao institucional") {
                    subjectMatches = true;
                }
                
                if (subjectMatches) {
                    const wtKeywords = getKeywords(wt.topic);
                    const overlap = wtKeywords.filter(w => qWords.has(w));
                    return overlap.length >= 1;
                }
                return false;
            });
        });
    };
    
    if (weeklyFilter && errorsFilter) {
        // Caso A: Ambos marcados (Foco nos assuntos do Cronograma da Semana, mas com 30% injetados do Caderno de Erros)
        if (weeklyCronoTopics.length === 0) {
            alert("Nenhum assunto agendado no cronograma para esta semana foi encontrado!");
            return;
        }
        
        // Questões dos tópicos da semana
        const weekQuestions = filterByTopicsList(filtered, weeklyCronoTopics);
        
        // Separa em erros vs normais
        const weekErrorQuestions = filterByTopicsList(weekQuestions, errorTopics);
        const weekNormalQuestions = weekQuestions.filter(q => !weekErrorQuestions.includes(q));
        
        const targetErrorCount = Math.round(limit * 0.3);
        const sampledErrors = weekErrorQuestions.sort(() => 0.5 - Math.random()).slice(0, targetErrorCount);
        
        const neededNormal = limit - sampledErrors.length;
        const sampledNormal = weekNormalQuestions.sort(() => 0.5 - Math.random()).slice(0, neededNormal);
        
        finalQuestions = sampledErrors.concat(sampledNormal).sort(() => 0.5 - Math.random());
    } else if (weeklyFilter) {
        // Caso B: Apenas cronograma da semana
        if (weeklyCronoTopics.length === 0) {
            alert("Nenhum assunto agendado no cronograma para esta semana foi encontrado!");
            return;
        }
        finalQuestions = filterByTopicsList(filtered, weeklyCronoTopics);
        finalQuestions = finalQuestions.sort(() => 0.5 - Math.random()).slice(0, limit);
    } else if (errorsFilter) {
        // Caso C: Apenas erros gerais
        if (errorTopics.length === 0) {
            alert("Nenhum erro registrado no seu Caderno de Erros para focar no momento!");
            return;
        }
        finalQuestions = filterByTopicsList(filtered, errorTopics);
        finalQuestions = finalQuestions.sort(() => 0.5 - Math.random()).slice(0, limit);
    } else {
        // Caso D: Filtros normais (Matéria e Origem apenas)
        finalQuestions = filtered.sort(() => 0.5 - Math.random()).slice(0, limit);
    }
    
    if (!finalQuestions || finalQuestions.length === 0) {
        alert("Nenhuma questão encontrada com os filtros selecionados!");
        return;
    }
    
    activeSession.questions = finalQuestions;
    activeSession.currentIndex = 0;
    activeSession.correctCount = 0;
    activeSession.incorrectCount = 0;
    activeSession.startTime = new Date();
    activeSession.elapsedSeconds = 0;
    activeSession.subject = subFilter === "all" ? "Várias Matérias" : subFilter;
    
    document.getElementById("session-correct-count").innerText = "0";
    document.getElementById("session-incorrect-count").innerText = "0";
    document.getElementById("session-accuracy-pct").innerText = "0%";
    
    document.getElementById("session-stats-card").style.display = "block";
    document.getElementById("active-question-card").style.display = "block";
    document.getElementById("placeholder-question-card").style.display = "none";
    document.getElementById("end-session-card").style.display = "none";
    
    if (activeSession.timerInterval) clearInterval(activeSession.timerInterval);
    activeSession.timerInterval = setInterval(() => {
        activeSession.elapsedSeconds++;
        const mins = Math.floor(activeSession.elapsedSeconds / 60).toString().padStart(2, '0');
        const secs = (activeSession.elapsedSeconds % 60).toString().padStart(2, '0');
        document.getElementById("session-timer").innerText = `${mins}:${secs}`;
    }, 1000);
    
    renderActiveQuestion();
}

function renderActiveQuestion() {
    const idx = activeSession.currentIndex;
    const q = activeSession.questions[idx];
    
    document.getElementById("q-meta-subject").innerText = q.subject;
    document.getElementById("q-meta-topic").innerText = q.topic;
    document.getElementById("q-meta-origin").innerText = q.document || "Simulador QG";
    
    // Verifica se é tópico quente
    const isHot = DEFAULT_SYLLABUS.some(t => t.hot && t.subject === q.subject && t.topic.toLowerCase().includes(q.topic.toLowerCase()));
    document.getElementById("q-meta-hot").style.display = isHot ? "inline-block" : "none";
    
    // Statement
    document.getElementById("q-statement-text").innerHTML = `<b>Questão ${idx + 1}/${activeSession.questions.length}</b><br><br>${q.statement}`;
    
    // Reset buttons
    const btnCerto = document.getElementById("btn-answer-certo");
    const btnErrado = document.getElementById("btn-answer-errado");
    btnCerto.disabled = false;
    btnErrado.disabled = false;
    btnCerto.classList.remove("selected");
    btnErrado.classList.remove("selected");
    
    document.getElementById("btn-add-to-errors").disabled = false;
    document.getElementById("q-feedback-panel").style.display = "none";
}

function submitAnswer(userAnswer) {
    const idx = activeSession.currentIndex;
    const q = activeSession.questions[idx];
    
    document.getElementById("btn-answer-certo").disabled = true;
    document.getElementById("btn-answer-errado").disabled = true;
    
    const isCorrect = userAnswer === q.answer;
    const feedbackHeader = document.getElementById("q-feedback-header");
    const feedbackComment = document.getElementById("q-feedback-comment");
    
    if (isCorrect) {
        activeSession.correctCount++;
        feedbackHeader.className = "feedback-header hit";
        feedbackHeader.innerHTML = `<i class="fa-solid fa-circle-check"></i> Resposta Correta!`;
        document.getElementById("session-correct-count").innerText = activeSession.correctCount;
    } else {
        activeSession.incorrectCount++;
        feedbackHeader.className = "feedback-header miss";
        feedbackHeader.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Resposta Incorreta! (Gabarito Oficial: ${q.answer.toUpperCase() === 'C' ? 'CERTO' : 'ERRADO'})`;
        document.getElementById("session-incorrect-count").innerText = activeSession.incorrectCount;
    }
    
    if (userAnswer === 'c') {
        document.getElementById("btn-answer-certo").classList.add("selected");
    } else {
        document.getElementById("btn-answer-errado").classList.add("selected");
    }
    
    const totalAnswered = activeSession.correctCount + activeSession.incorrectCount;
    const accuracy = totalAnswered > 0 ? Math.round((activeSession.correctCount / totalAnswered) * 100) : 0;
    document.getElementById("session-accuracy-pct").innerText = `${accuracy}%`;
    
    feedbackComment.innerHTML = q.comment || "Sem comentários específicos da banca.";
    
    document.getElementById("btn-add-to-errors").style.display = isCorrect ? "none" : "inline-block";
    document.getElementById("q-feedback-panel").style.display = "block";
}

function nextQuestion() {
    activeSession.currentIndex++;
    if (activeSession.currentIndex < activeSession.questions.length) {
        renderActiveQuestion();
    } else {
        finishPracticeSession();
    }
}

function finishPracticeSession() {
    if (activeSession.timerInterval) clearInterval(activeSession.timerInterval);
    
    document.getElementById("active-question-card").style.display = "none";
    document.getElementById("session-stats-card").style.display = "none";
    
    const total = activeSession.correctCount + activeSession.incorrectCount;
    const accuracy = total > 0 ? Math.round((activeSession.correctCount / total) * 100) : 0;
    
    const mins = Math.floor(activeSession.elapsedSeconds / 60);
    const summary = `Você resolveu <b>${total} questões</b> em <b>${mins} min</b>, obtendo <b>${activeSession.correctCount} acertos</b> e <b>${activeSession.incorrectCount} erros</b>. Aproveitamento de <b>${accuracy}%</b>.`;
    document.getElementById("end-session-summary").innerHTML = summary;
    
    document.getElementById("end-session-card").style.display = "flex";
}

async function saveSessionToHistory() {
    const total = activeSession.correctCount + activeSession.incorrectCount;
    const durationMins = Math.max(1, Math.round(activeSession.elapsedSeconds / 60));
    
    const newStudy = {
        date: new Date().toLocaleDateString('pt-BR'),
        subject: activeSession.subject,
        topic: "Treinamento Prático de Questões",
        type: "Questões",
        duration: durationMins,
        questions: total,
        correct: activeSession.correctCount,
        errors: activeSession.incorrectCount,
        notes: `Sessão de prática realizada no simulador QG PMMA. Aproveitamento de ${Math.round((activeSession.correctCount / (total || 1)) * 100)}%.`
    };
    newStudy.accuracy = newStudy.questions > 0 ? (newStudy.correct / newStudy.questions) : 0.0;
    
    if (state.mode === "synced" && state.apiUrl) {
        try {
            await fetch(state.apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'addStudy', ...newStudy })
            });
        } catch (e) {
            console.error("Erro ao sincronizar sessão de questões:", e);
        }
    } else {
        state.registroEstudos.push(newStudy);
        saveLocalDataToStorage();
    }
    
    alert("Sessão salva no histórico de estudos com sucesso!");
    document.getElementById("end-session-card").style.display = "none";
    document.getElementById("placeholder-question-card").style.display = "flex";
    
    refreshData();
}

function initDashboardExtras() {
    // Botão de Estudo Avulso
    const btnAvulso = document.getElementById("btn-open-study-avulso");
    if (btnAvulso) {
        btnAvulso.addEventListener("click", () => {
            pendingCronoConcludeDate = null;
            openModal('modal-study');
            
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            document.getElementById("study-date").value = `${year}-${month}-${day}`;
            
            const studySubSelect = document.getElementById("study-subject");
            studySubSelect.value = "";
            const studyTopicSelect = document.getElementById("study-topic");
            studyTopicSelect.innerHTML = `<option value="">Selecione a matéria primeiro</option>`;
            
            document.getElementById("study-duration").value = "";
            document.getElementById("study-questions").value = "";
            document.getElementById("study-correct").value = "";
            document.getElementById("study-notes").value = "";
            document.getElementById("study-accuracy-preview").value = "0%";
        });
    }
    
    // Card de Tópicos Quentes clique
    const hotCard = document.getElementById("hot-topics-card");
    if (hotCard) {
        hotCard.addEventListener("click", openHotTopicsDetailModal);
    }
    
    // Botão de Gerar Cronograma 60 Dias
    const btnGen60 = document.getElementById("btn-generate-60day-plan");
    if (btnGen60) {
        btnGen60.addEventListener("click", generate60DayPlan);
    }
}

function openHotTopicsDetailModal() {
    openModal('modal-hot-topics-detail');
    const tbody = document.getElementById("hot-topics-detail-rows");
    tbody.innerHTML = "";
    
    const hotTopics = DEFAULT_SYLLABUS.filter(t => t.hot);
    
    hotTopics.forEach(t => {
        const edTopic = state.edital.find(e => e.subject.toLowerCase() === t.subject.toLowerCase() && e.topic.toLowerCase() === t.topic.toLowerCase());
        const studied = edTopic ? edTopic.studied : false;
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><b>${t.subject}</b></td>
            <td>${t.topic} <span style="font-size:10px; color: var(--danger); font-weight:600;"><i class="fa-solid fa-fire"></i> ${t.weight || ''}</span></td>
            <td>
                ${studied ? '<span class="badge" style="background: var(--success-bg); border-color: rgba(16,185,129,0.2); color: var(--success);"><i class="fa-solid fa-circle-check"></i> Concluído</span>' 
                          : '<span class="badge" style="background: rgba(255,255,255,0.04); border-color: var(--border-light); color: var(--text-muted);"><i class="fa-solid fa-circle-minus"></i> Pendente</span>'}
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="handleHotTopicStudyQuick('${t.subject.replace(/'/g, "\\'")}', '${t.topic.replace(/'/g, "\\'")}')" style="padding: 4px 8px; font-size:11px;">
                    <i class="fa-solid fa-play"></i> Estudo Rápido
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function handleHotTopicStudyQuick(subject, topic) {
    closeModal('modal-hot-topics-detail');
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('pt-BR');
    openStudyLogPrefilled(dateFormatted, subject, topic, false);
}

function renderSpacedRevisions() {
    const tbody = document.getElementById("revisions-list-container");
    const countBadge = document.getElementById("revisions-count-badge");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    let list = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastStudiesMap = {};
    state.registroEstudos.forEach(s => {
        if (s.type === "Teoria" || s.type === "Questões" || s.type === "Revisão") {
            const key = s.subject + '|||' + s.topic;
            const studyDate = parseDate(s.date);
            if (!lastStudiesMap[key] || studyDate > lastStudiesMap[key]) {
                lastStudiesMap[key] = studyDate;
            }
        }
    });
    
    const intervals = [1, 7, 15, 21, 30];
    
    for (const key in lastStudiesMap) {
        const lastDate = lastStudiesMap[key];
        const diffTime = today - lastDate;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (intervals.includes(diffDays)) {
            const parts = key.split('|||');
            list.push({
                subject: parts[0],
                topic: parts[1],
                interval: diffDays,
                date: lastDate.toLocaleDateString('pt-BR')
            });
        }
    }
    
    countBadge.innerText = list.length;
    
    if (list.length === 0) {
        tbody.innerHTML = `<p class="empty-state" style="font-size: 12px; padding: 10px;">Nenhuma revisão pendente para hoje.</p>`;
        return;
    }
    
    list.forEach(item => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justify = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "10px";
        row.style.background = "rgba(255, 255, 255, 0.02)";
        row.style.border = "1px solid var(--border-light)";
        row.style.borderRadius = "8px";
        row.style.fontSize = "12.5px";
        row.style.marginTop = "6px";
        
        row.innerHTML = `
            <div style="flex: 1; padding-right: 8px;">
                <span class="badge" style="background: var(--warning-bg); border-color: rgba(245,158,11,0.2); color: var(--warning); font-size: 10px; margin-right: 6px; padding: 2px 4px;">${item.interval}d</span>
                <b>${item.subject}</b>: <span style="color: var(--text-secondary);">${item.topic}</span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="openStudyLogPrefilled('${today.toLocaleDateString('pt-BR')}', '${item.subject.replace(/'/g, "\\'")}', '${item.topic.replace(/'/g, "\\'")}')" style="padding: 4px 8px; font-size: 11px;">
                Revisar
            </button>
        `;
        tbody.appendChild(row);
    });
}

// CRUD do Histórico - Exclusão
async function handleDeleteHistory(category, rawJsonEncoded) {
    if (!confirm("Tem certeza que deseja excluir permanentemente este registro?")) return;
    
    const raw = JSON.parse(decodeURIComponent(rawJsonEncoded));
    
    if (state.mode === "synced" && state.apiUrl) {
        try {
            const payload = { action: 'deleteHistoryItem', cat: category };
            if (category === 'Estudo Diário') {
                payload.date = raw.date;
                payload.subject = raw.subject;
                payload.topic = raw.topic;
                payload.type = raw.type;
            } else if (category === 'Simulado Teórico') {
                payload.id = raw.id;
            } else if (category === 'Treino TAF') {
                payload.date = raw.date;
                payload.exercise = raw.exercise;
            } else if (category === 'Simulado TAF Completo') {
                payload.date = raw.date;
            }
            
            await fetch(state.apiUrl, {
                method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (category === 'Estudo Diário') {
                const others = state.registroEstudos.filter(s => s.subject === raw.subject && s.topic === raw.topic && !(s.date === raw.date && s.type === raw.type));
                if (others.length === 0) {
                    await fetch(state.apiUrl, {
                        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'toggleEdital', subject: raw.subject, topic: raw.topic, studied: false, questions: 0, correct: 0 })
                    });
                }
            }
        } catch (e) {
            console.error("Erro ao sincronizar exclusão:", e);
        }
    } else {
        if (category === 'Estudo Diário') {
            state.registroEstudos = state.registroEstudos.filter(s => !(s.date === raw.date && s.subject === raw.subject && s.topic === raw.topic && s.type === raw.type));
            
            const others = state.registroEstudos.filter(s => s.subject === raw.subject && s.topic === raw.topic);
            if (others.length === 0) {
                const edTopic = state.edital.find(x => x.subject === raw.subject && x.topic === raw.topic);
                if (edTopic) {
                    edTopic.studied = false;
                    edTopic.questions = 0;
                    edTopic.correct = 0;
                }
            }
        } else if (category === 'Simulado Teórico') {
            state.simuladosCab = state.simuladosCab.filter(c => c.id !== raw.id);
            state.simuladosDet = state.simuladosDet.filter(d => d.simId !== raw.id);
        } else if (category === 'Treino TAF') {
            state.treinoTaf = state.treinoTaf.filter(t => !(t.date === raw.date && t.exercise === raw.exercise));
        } else if (category === 'Simulado TAF Completo') {
            state.simuladosTaf = state.simuladosTaf.filter(s => s.date !== raw.date);
        }
        saveLocalDataToStorage();
    }
    
    alert("Registro excluído com sucesso!");
    refreshData();
}

// CRUD do Histórico - Edição
async function handleEditHistory(category, rawJsonEncoded) {
    const raw = JSON.parse(decodeURIComponent(rawJsonEncoded));
    
    if (category === 'Estudo Diário') {
        const duration = prompt("Editar Tempo de Estudo (Minutos):", raw.duration);
        if (duration === null) return;
        const questions = prompt("Editar Questões Resolvidas:", raw.questions);
        if (questions === null) return;
        const correct = prompt("Editar Quantidade de Acertos:", raw.correct);
        if (correct === null) return;
        const notes = prompt("Editar Anotações:", raw.notes || "");
        if (notes === null) return;
        
        const newDuration = parseInt(duration) || 0;
        const newQuestions = parseInt(questions) || 0;
        const newCorrect = parseInt(correct) || 0;
        
        if (state.mode === "synced" && state.apiUrl) {
            try {
                await fetch(state.apiUrl, {
                    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'editHistoryItem',
                        cat: 'Estudo Diário',
                        oldDate: raw.date,
                        oldSubject: raw.subject,
                        oldTopic: raw.topic,
                        oldType: raw.type,
                        duration: newDuration,
                        questions: newQuestions,
                        correct: newCorrect,
                        notes: notes
                    })
                });
            } catch (e) {
                console.error("Erro ao sincronizar edição:", e);
            }
        } else {
            const find = state.registroEstudos.find(s => s.date === raw.date && s.subject === raw.subject && s.topic === raw.topic && s.type === raw.type);
            if (find) {
                find.duration = newDuration;
                find.questions = newQuestions;
                find.correct = newCorrect;
                find.errors = Math.max(0, newQuestions - newCorrect);
                find.accuracy = newQuestions > 0 ? (newCorrect / newQuestions) : 0.0;
                find.notes = notes;
            }
            saveLocalDataToStorage();
        }
    } else if (category === 'Treino TAF') {
        const result = prompt("Editar Resultado (Reps/Metros):", raw.result);
        if (result === null) return;
        const sets = prompt("Editar Séries:", raw.sets || 1);
        if (sets === null) return;
        const rest = prompt("Editar Tempo de Descanso (segundos):", raw.restTime || 0);
        if (rest === null) return;
        const duration = prompt("Editar Tempo Total (minutos):", raw.duration || 0);
        if (duration === null) return;
        
        const newResult = parseInt(result) || 0;
        
        if (state.mode === "synced" && state.apiUrl) {
            try {
                await fetch(state.apiUrl, {
                    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'editHistoryItem',
                        cat: 'Treino TAF',
                        oldDate: raw.date,
                        oldExercise: raw.exercise,
                        result: newResult,
                        sets: parseInt(sets) || 1,
                        restTime: parseInt(rest) || 0,
                        duration: parseInt(duration) || 0
                    })
                });
            } catch (e) {
                console.error("Erro ao sincronizar edição TAF:", e);
            }
        } else {
            const find = state.treinoTaf.find(t => t.date === raw.date && t.exercise === raw.exercise);
            if (find) {
                find.result = newResult;
                find.sets = parseInt(sets) || 1;
                find.restTime = parseInt(rest) || 0;
                find.duration = parseInt(duration) || 0;
                find.status = find.result >= find.target ? 'META ALCANÇADA' : 'ABAIXO DA META';
            }
            saveLocalDataToStorage();
        }
    } else if (category === 'Simulado TAF Completo') {
        const barra = prompt("Editar Barra:", raw.barra);
        if (barra === null) return;
        const sugado = prompt("Editar Meio Sugado:", raw.sugado);
        if (sugado === null) return;
        const abdominal = prompt("Editar Abdominal:", raw.abdominal);
        if (abdominal === null) return;
        const corrida = prompt("Editar Corrida (metros):", raw.corrida);
        if (corrida === null) return;
        const duration = prompt("Editar Tempo Total:", raw.duration);
        if (duration === null) return;
        const notes = prompt("Editar Observações:", raw.notes || "");
        if (notes === null) return;
        
        const bVal = parseInt(barra) || 0;
        const sVal = parseInt(sugado) || 0;
        const aVal = parseInt(abdominal) || 0;
        const cVal = parseInt(corrida) || 0;
        const passed = bVal >= 4 && sVal >= 25 && aVal >= 35 && cVal >= 2400;
        
        if (state.mode === "synced" && state.apiUrl) {
            try {
                await fetch(state.apiUrl, {
                    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'editHistoryItem',
                        cat: 'Simulado TAF Completo',
                        oldDate: raw.date,
                        barra: bVal,
                        sugado: sVal,
                        abdominal: aVal,
                        corrida: cVal,
                        duration: duration,
                        passed: passed,
                        notes: notes
                    })
                });
            } catch (e) {
                console.error("Erro ao sincronizar edição simulado TAF:", e);
            }
        } else {
            const find = state.simuladosTaf.find(s => s.date === raw.date);
            if (find) {
                find.barra = bVal;
                find.sugado = sVal;
                find.abdominal = aVal;
                find.corrida = cVal;
                find.duration = duration;
                find.status = passed ? 'APROVADO NO TAF' : 'NÃO ALCANÇADO';
                find.notes = notes;
            }
            saveLocalDataToStorage();
        }
    }
    
    alert("Registro atualizado com sucesso!");
    refreshData();
}

// Edição Inline no Caderno de Erros
function startEditErrorNotes(safeKey) {
    document.getElementById(`desc-view-${safeKey}`).style.display = "none";
    document.getElementById(`desc-edit-${safeKey}`).style.display = "block";
    document.getElementById(`desc-actions-${safeKey}`).style.display = "flex";
}

function cancelEditErrorNotes(safeKey) {
    document.getElementById(`desc-view-${safeKey}`).style.display = "block";
    document.getElementById(`desc-edit-${safeKey}`).style.display = "none";
    document.getElementById(`desc-actions-${safeKey}`).style.display = "none";
}

async function saveEditErrorNotes(safeKey, simId, subject, topic) {
    const textVal = document.getElementById(`desc-edit-${safeKey}`).value.trim();
    if (!textVal) {
        alert("A anotação de erro não pode ficar em branco!");
        return;
    }
    
    if (state.mode === "synced" && state.apiUrl) {
        try {
            await fetch(state.apiUrl, {
                method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'toggleErrorReview',
                    simId: simId,
                    subject: subject,
                    topic: topic,
                    needsReview: true,
                    notes: textVal
                })
            });
        } catch (e) {
            console.error("Erro ao sincronizar edição do erro:", e);
        }
    }
    
    const find = state.simuladosDet.find(d => d.simId === simId && d.subject === subject && d.topic === topic);
    if (find) {
        find.notes = textVal;
    }
    saveLocalDataToStorage();
    
    alert("Anotação de erro salva!");
    refreshData();
}

// Expõe globalmente para ações inline do HTML
window.handleDeleteHistory = handleDeleteHistory;
window.handleEditHistory = handleEditHistory;
window.startEditErrorNotes = startEditErrorNotes;
window.cancelEditErrorNotes = cancelEditErrorNotes;
window.saveEditErrorNotes = saveEditErrorNotes;
window.handleHotTopicStudyQuick = handleHotTopicStudyQuick;
window.loadBancoQuestoes = loadBancoQuestoes;
window.initQuestoesTab = initQuestoesTab;
window.initDashboardExtras = initDashboardExtras;
window.renderSpacedRevisions = renderSpacedRevisions;

async function generate60DayPlan() {
    if (!confirm("Isso irá substituir o seu cronograma atual por um novo planejamento LINEAR de 60 dias focado nos Temas Quentes. Deseja continuar?")) {
        return;
    }
    
    // Agrupa tópicos por disciplina mantendo a ordem original do edital
    const subjectsMap = {};
    DEFAULT_SYLLABUS.forEach(t => {
        if (!subjectsMap[t.subject]) {
            subjectsMap[t.subject] = [];
        }
        subjectsMap[t.subject].push(t);
    });
    
    // Pointers de progresso para cada matéria
    const pointers = {};
    for (const sub in subjectsMap) {
        pointers[sub] = 0;
    }
    
    // Mapeamento fixo de matérias por dia de semana de acordo com o quadro do quadro branco:
    // Seg (1): PORT + LEG INST
    // Ter (2): RLM + HIST (História do Brasil)
    // Qua (3): PORT + INFO
    // Qui (4): RLM + LEG INST (Usando Legislação PMMA)
    // Sex (5): INFO + GEO (Geografia do Brasil)
    const weekdaySchedule = {
        1: { s1: "Língua Portuguesa", s2: "Legislação Institucional" },
        2: { s1: "Raciocínio Lógico", s2: "História do Brasil" },
        3: { s1: "Língua Portuguesa", s2: "Noções de Informática" },
        4: { s1: "Raciocínio Lógico", s2: "Legislação pertinente à PMMA" },
        5: { s1: "Noções de Informática", s2: "Geografia do Brasil" }
    };
    
    let crono = [];
    const startDate = new Date();
    
    for (let i = 0; i < 60; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 6 = Sábado
        const dateStr = currentDate.toLocaleDateString('pt-BR');
        
        let m1 = "";
        let a1 = "";
        let m2 = "";
        let a2 = "";
        let foco = "Foco em Questões";
        let ciclo = "Progressão Linear";
        
        const getCycleType = (sub, idx) => {
            const list = subjectsMap[sub] || [];
            if (list.length === 0) return "Teoria";
            const cycleCount = Math.floor(idx / list.length);
            if (cycleCount === 0) return "Teoria";
            if (cycleCount === 1) return "Questões";
            return "Revisão";
        };
        
        if (dayOfWeek === 6) { // Sábado: História do Maranhão (Linear) + Revisão C.E.
            const sub = "História do Maranhão";
            const list = subjectsMap[sub] || [];
            let pIdx = pointers[sub] % list.length;
            let p = list[pIdx];
            pointers[sub]++;
            
            const tType = getCycleType(sub, pIdx);
            m1 = sub;
            a1 = p ? `${p.topic} [${tType}]` : "Estudo complementar";
            m2 = "Revisão Caderno de Erros";
            a2 = "Revisar anotações de erros da semana e refazer itens errados no simulador";
            foco = "100% Correção de Erros";
            ciclo = "Análise de Falhas";
        } else if (dayOfWeek === 0) { // Domingo: Geografia do Maranhão (Linear) + Simulado
            const sub = "Geografia do Maranhão";
            const list = subjectsMap[sub] || [];
            let pIdx = pointers[sub] % list.length;
            let p = list[pIdx];
            pointers[sub]++;
            
            const tType = getCycleType(sub, pIdx);
            m1 = sub;
            a1 = p ? `${p.topic} [${tType}]` : "Estudo complementar";
            m2 = "Simulado Geral";
            a2 = "Resolver Simulado Geral Cebraspe (Foco em Tópicos Quentes)";
            foco = "Simulação Real de Prova";
            ciclo = "Testes de Velocidade";
        } else {
            // Dias de semana (Segunda a Sexta): 3 tópicos, no máximo 2 matérias
            const sched = weekdaySchedule[dayOfWeek];
            const sub1 = sched.s1;
            const sub2 = sched.s2;
            
            // M1: puxa 2 assuntos lineares de sub1
            const list1 = subjectsMap[sub1] || [];
            let p1Idx = pointers[sub1] % (list1.length || 1);
            let p1 = list1[p1Idx];
            pointers[sub1]++;
            
            let p2Idx = pointers[sub1] % (list1.length || 1);
            let p2 = list1[p2Idx];
            pointers[sub1]++;
            
            // M2: puxa 1 assunto linear de sub2
            const list2 = subjectsMap[sub2] || [];
            let p3Idx = pointers[sub2] % (list2.length || 1);
            let p3 = list2[p3Idx];
            pointers[sub2]++;
            
            const t1Type = getCycleType(sub1, p1Idx);
            const t2Type = getCycleType(sub1, p2Idx);
            const t3Type = getCycleType(sub2, p3Idx);
            
            m1 = sub1;
            a1 = p2 ? `${p1.topic} [${t1Type}] e ${p2.topic} [${t2Type}]` : `${p1.topic} [${t1Type}]`;
            
            m2 = sub2;
            a2 = p3 ? `${p3.topic} [${t3Type}]` : "Revisão e Prática";
            
            foco = "70% Questões / 30% Teoria";
            ciclo = "Progressão Linear do Edital";
        }
        
        crono.push({
            date: dateStr,
            dia: `Dia ${i + 1}`,
            semana: `Semana ${Math.ceil((i + 1) / 7)}`,
            m1: m1,
            a1: a1,
            m2: m2,
            a2: a2,
            ciclo: ciclo,
            foco: foco,
            completed: false
        });
    }
    
    state.crono = crono;
    const prevEdital = state.edital || [];
    state.edital = DEFAULT_SYLLABUS.map(t => {
        const existing = prevEdital.find(x => x.subject === t.subject && x.topic === t.topic);
        if (existing) {
            return {
                subject: t.subject,
                topic: t.topic,
                studied: existing.studied,
                questions: existing.questions,
                correct: existing.correct,
                revisionStatus: existing.revisionStatus || "Pendente"
            };
        } else {
            return {
                subject: t.subject,
                topic: t.topic,
                studied: false,
                questions: 0,
                correct: 0,
                revisionStatus: "Pendente"
            };
        }
    });
    
    saveLocalDataToStorage();
    
    alert("Cronograma LINEAR de 60 dias gerado com base no quadro de estudos! As matérias seguem a ordem lógica exata.");
    processDataAndRender();
}

window.generate60DayPlan = generate60DayPlan;

