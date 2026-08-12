// ==========================================================================
// 🔌 API Bridge — Comunicação com o Servidor Local Python (QG PMMA)
// ==========================================================================

const API_BASE = ""; // Como rodamos na mesma origem, podemos usar rotas relativas

// Estado Global Compartilhado
let state = {
    crono: [],
    edital: [],
    treinos: [],
    taf_semanal: [],
    simulados: [],
    historico_estudos: [],
    caderno_erros: []
};

// Carrega todos os dados do Excel
async function loadData() {
    updateSyncText("Lendo planilha local...", "synching");
    try {
        const response = await fetch(`${API_BASE}/api/data`);
        if (response.ok) {
            const res = await response.json();
            if (res.status === "success" && res.data) {
                state = res.data;
                // Inicializa arrays obrigatórios vazios caso venham nulos
                if (!state.historico_estudos) state.historico_estudos = [];
                if (!state.caderno_erros) state.caderno_erros = [];
                if (!state.crono) state.crono = [];
                if (!state.edital) state.edital = [];
                if (!state.treinos) state.treinos = [];
                if (!state.taf_semanal) state.taf_semanal = [];
                if (!state.simulados) state.simulados = [];
                
                // Salva backup local no browser
                localStorage.setItem("pmma_local_backup", JSON.stringify(state));
                updateSyncText("Planilha Conectada", "synced");
                return true;
            }
        }
        throw new Error("Erro na resposta do servidor.");
    } catch (err) {
        console.error("Falha ao carregar dados do Excel, tentando arquivo de dados estático:", err);
        
        try {
            // Tenta carregar do pmma_data_export.json estático (para rodar no GitHub Pages/Modo Consulta)
            const staticResponse = await fetch(`${API_BASE}/pmma_data_export.json`);
            if (staticResponse.ok) {
                const staticData = await staticResponse.json();
                state = staticData;
                if (!state.historico_estudos) state.historico_estudos = [];
                if (!state.caderno_erros) state.caderno_erros = [];
                if (!state.crono) state.crono = [];
                if (!state.edital) state.edital = [];
                if (!state.treinos) state.treinos = [];
                if (!state.taf_semanal) state.taf_semanal = [];
                if (!state.simulados) state.simulados = [];
                
                localStorage.setItem("pmma_local_backup", JSON.stringify(state));
                updateSyncText("Modo Consulta (Git)", "synced");
                return true;
            }
        } catch (staticErr) {
            console.error("Falha ao carregar dados estáticos:", staticErr);
        }
        
        updateSyncText("Modo Offline (Backup)", "error");
        
        // Tenta carregar do backup local do browser
        const backup = localStorage.getItem("pmma_local_backup");
        if (backup) {
            try {
                state = JSON.parse(backup);
                return true;
            } catch (e) {
                console.error("Erro ao ler backup do localStorage", e);
            }
        }
        return false;
    }
}

// Salva um Registro de Estudo
async function apiRegisterStudy(studyData) {
    try {
        const response = await fetch(`${API_BASE}/api/study`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studyData)
        });
        const res = await response.json();
        if (res.status === "success") {
            await loadData();
            return true;
        }
        alert("Erro ao salvar estudo: " + res.message);
        return false;
    } catch (err) {
        console.error("Erro ao registrar estudo:", err);
        alert("Erro de conexão ao salvar estudo localmente.");
        return false;
    }
}

// Salva múltiplos estudos/revisões em lote
async function apiRegisterStudyBulk(bulkData) {
    try {
        const response = await fetch(`${API_BASE}/api/study/bulk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bulkData)
        });
        const res = await response.json();
        if (res.status === "success") {
            await loadData();
            return true;
        }
        alert("Erro ao salvar lote: " + res.message);
        return false;
    } catch (err) {
        console.error("Erro ao registrar lote:", err);
        alert("Erro de conexão ao salvar lote localmente.");
        return false;
    }
}

// Salva uma Revisão do SRS
async function apiRegisterReview(reviewData) {
    try {
        const response = await fetch(`${API_BASE}/api/review`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewData)
        });
        const res = await response.json();
        if (res.status === "success") {
            await loadData();
            return true;
        }
        alert("Erro ao salvar revisão: " + res.message);
        return false;
    } catch (err) {
        console.error("Erro ao registrar revisão:", err);
        alert("Erro de conexão ao salvar revisão localmente.");
        return false;
    }
}

// Salva um Simulado Externo (Tec Concursos)
async function apiRegisterSimulado(simData) {
    try {
        const response = await fetch(`${API_BASE}/api/simulado`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(simData)
        });
        const res = await response.json();
        if (res.status === "success") {
            await loadData();
            return true;
        }
        alert("Erro ao salvar simulado: " + res.message);
        return false;
    } catch (err) {
        console.error("Erro ao registrar simulado:", err);
        alert("Erro de conexão ao salvar simulado localmente.");
        return false;
    }
}

// Salva um Treino/TAF
async function apiRegisterTaf(tafData) {
    try {
        const response = await fetch(`${API_BASE}/api/taf`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tafData)
        });
        const res = await response.json();
        if (res.status === "success") {
            await loadData();
            return true;
        }
        alert("Erro ao salvar TAF: " + res.message);
        return false;
    } catch (err) {
        console.error("Erro ao registrar TAF:", err);
        alert("Erro de conexão ao salvar TAF localmente.");
        return false;
    }
}

// Salva questão no Caderno de Erros
async function apiRegisterErro(erroData) {
    try {
        const response = await fetch(`${API_BASE}/api/erros`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(erroData)
        });
        const res = await response.json();
        if (res.status === "success") {
            await loadData();
            return true;
        }
        alert("Erro ao salvar caderno de erros: " + res.message);
        return false;
    } catch (err) {
        console.error("Erro ao registrar no caderno de erros:", err);
        alert("Erro de conexão ao salvar erro localmente.");
        return false;
    }
}

// Auxiliar para atualizar o status visual de sincronização
function updateSyncText(text, status) {
    const el = document.getElementById("sync-status");
    const textEl = document.getElementById("sync-text");
    if (!el || !textEl) return;
    
    textEl.textContent = text;
    el.className = "sync-badge"; // Reseta
    
    if (status === "synced") {
        el.classList.add("synced");
        el.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> <span id="sync-text">Planilha Conectada</span>';
    } else if (status === "synching") {
        el.classList.add("synching");
        el.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span id="sync-text">' + text + '</span>';
    } else if (status === "error") {
        el.classList.add("error");
        el.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span id="sync-text">' + text + '</span>';
    } else {
        el.innerHTML = '<i class="fa-solid fa-file-excel"></i> <span id="sync-text">' + text + '</span>';
    }
}
