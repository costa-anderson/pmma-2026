// ==========================================================================
// 🧠 SRS Module — Sistema de Revisão Espaçada (QG PMMA)
// ==========================================================================

function initSrsTab() {
    renderSrsScreen();
}

function parseDmyDate(dateStr) {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split("/");
    if (parts.length !== 3) return new Date(0);
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function renderSrsScreen() {
    const colAtrasados = document.getElementById("srs-col-atrasados");
    const colHoje = document.getElementById("srs-col-hoje");
    const colEmDia = document.getElementById("srs-col-emdia");
    
    if (!colAtrasados || !colHoje || !colEmDia) return;
    
    colAtrasados.innerHTML = "";
    colHoje.innerHTML = "";
    colEmDia.innerHTML = "";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filtrar apenas temas quentes (🔥) do Edital
    const hotTopics = state.edital.filter(e => e.hot);
    
    let countAtrasados = 0;
    let countHoje = 0;
    let countEmDia = 0;
    
    hotTopics.forEach((topic) => {
        // Encontrar histórico de estudos e revisões para este tópico
        const history = state.historico_estudos.filter(h => 
            h.subject.toLowerCase().trim() === topic.subject.toLowerCase().trim() &&
            h.topic.toLowerCase().trim() === topic.topic.toLowerCase().trim()
        );
        
        // Se o tema nunca foi estudado (nem no edital nem no histórico)
        if (!topic.studied && history.length === 0) {
            // Não entra no SRS ainda (está aguardando o estudo inicial)
            return;
        }
        
        let lastLog = null;
        let reviewsCount = 0;
        
        if (history.length > 0) {
            // Ordena o histórico para achar o mais recente
            const sortedHistory = [...history].sort((a, b) => parseDmyDate(a.date) - parseDmyDate(b.date));
            lastLog = sortedHistory[sortedHistory.length - 1];
            
            // Conta quantas revisões já foram feitas
            reviewsCount = sortedHistory.filter(h => h.type.toLowerCase().includes("revisão") || h.type.toLowerCase().includes("revisao")).length;
        }
        
        let lastDate = lastLog ? parseDmyDate(lastLog.date) : null;
        let intervalDays = 7; // Padrão 1ª revisão: 7 dias
        
        if (reviewsCount === 1) {
            intervalDays = 15; // 2ª revisão: 15 dias
        } else if (reviewsCount >= 2) {
            intervalDays = 30; // 3ª+ revisão: 30 dias
        }
        
        let dueDate = null;
        let isAtrasado = false;
        let isHoje = false;
        let diasRestantes = 0;
        let displayReason = "";
        
        if (!lastDate) {
            // Caso esteja marcado no edital como estudado, mas sem histórico de data
            isAtrasado = true;
            displayReason = "Estudado no edital (sem histórico de data)";
        } else {
            dueDate = addDays(lastDate, intervalDays);
            dueDate.setHours(0, 0, 0, 0);
            
            const diffTime = dueDate.getTime() - today.getTime();
            diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diasRestantes < 0) {
                isAtrasado = true;
                displayReason = `Atrasado há ${Math.abs(diasRestantes)} dia(s) (Prazo: ${intervalDays}d)`;
            } else if (diasRestantes === 0) {
                isHoje = true;
                displayReason = `Vence hoje! (Prazo: ${intervalDays}d)`;
            } else {
                displayReason = `Em dia. Revisar em ${diasRestantes} dia(s) (${dueDate.toLocaleDateString('pt-BR')})`;
            }
        }
        
        // Criar o card do tema
        const card = document.createElement("div");
        card.className = "srs-card";
        
        let badgeClass = "srs-badge-1";
        if (reviewsCount === 1) badgeClass = "srs-badge-2";
        if (reviewsCount >= 2) badgeClass = "srs-badge-3";
        
        const lastDateStr = lastDate ? lastDate.toLocaleDateString('pt-BR') : "Sem registro";
        
        card.innerHTML = `
            <div class="srs-card-subject">${topic.subject}</div>
            <div class="srs-card-topic">${topic.topic}</div>
            <div class="srs-card-info">
                <span>Última interação: <strong>${lastDateStr}</strong></span>
                <span>Ciclo atual: <span class="badge ${badgeClass}">${reviewsCount + 1}ª Revisão (${intervalDays}d)</span></span>
            </div>
            <div class="srs-card-status">${displayReason}</div>
            <button class="btn btn-primary btn-sm srs-card-btn" onclick="openSrsReviewModal('${escapeHtml(topic.subject)}', '${escapeHtml(topic.topic)}')">
                <i class="fa-solid fa-rotate-left"></i> Marcar Revisado
            </button>
        `;
        
        if (isAtrasado) {
            card.classList.add("atrasado");
            colAtrasados.appendChild(card);
            countAtrasados++;
        } else if (isHoje) {
            card.classList.add("hoje");
            colHoje.appendChild(card);
            countHoje++;
        } else {
            card.classList.add("emdia");
            colEmDia.appendChild(card);
            countEmDia++;
        }
    });
    
    // Atualizar contadores nos títulos
    document.getElementById("srs-count-atrasados").textContent = countAtrasados;
    document.getElementById("srs-count-hoje").textContent = countHoje;
    document.getElementById("srs-count-emdia").textContent = countEmDia;
    
    // Fallbacks caso as colunas fiquem vazias
    if (countAtrasados === 0) {
        colAtrasados.innerHTML = `<div class="srs-empty"><i class="fa-solid fa-circle-check"></i> Nenhum tema atrasado!</div>`;
    }
    if (countHoje === 0) {
        colHoje.innerHTML = `<div class="srs-empty"><i class="fa-solid fa-mug-hot"></i> Nada para hoje!</div>`;
    }
    if (countEmDia === 0 && countAtrasados === 0 && countHoje === 0) {
        colEmDia.innerHTML = `<div class="srs-empty">Aguardando estudos iniciais dos Temas Quentes.</div>`;
    }
}

// Auxiliar para escapar strings no HTML
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Abre o modal de registro de revisão
window.openSrsReviewModal = function(subject, topic) {
    document.getElementById("form-srs-subject").value = subject;
    document.getElementById("form-srs-topic").value = topic;
    document.getElementById("form-srs-date").value = new Date().toISOString().split('T')[0];
    document.getElementById("form-srs-duration").value = 20;
    document.getElementById("form-srs-questions").value = 10;
    document.getElementById("form-srs-correct").value = 8;
    document.getElementById("form-srs-notes").value = "Revisão Espaçada Feita";
    
    openModal("modal-log-srs");
};

// Salva o formulário de revisão do SRS
async function handleSrsFormSubmit(e) {
    e.preventDefault();
    
    const subject = document.getElementById("form-srs-subject").value;
    const topic = document.getElementById("form-srs-topic").value;
    const dateInput = document.getElementById("form-srs-date").value;
    const duration = parseInt(document.getElementById("form-srs-duration").value) || 0;
    const questions = parseInt(document.getElementById("form-srs-questions").value) || 0;
    const correct = parseInt(document.getElementById("form-srs-correct").value) || 0;
    const notes = document.getElementById("form-srs-notes").value;
    
    const formattedDate = formatDateInput(dateInput);
    
    const reviewData = {
        date: formattedDate,
        subject: subject,
        topic: topic,
        duration: duration,
        questions: questions,
        correct: correct,
        notes: notes
    };
    
    updateSyncText("Salvando revisão no Excel...", "synching");
    const success = await apiRegisterReview(reviewData);
    if (success) {
        closeModal("modal-log-srs");
        renderSrsScreen();
        // Atualiza dashboard se necessário
        const activeTab = document.querySelector(".menu-item.active").getAttribute("data-tab");
        if (activeTab === "dashboard") renderDashboard();
    }
}
