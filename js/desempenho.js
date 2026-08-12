// ==========================================================================
// 📊 Desempenho Module — Simulados e Treinos do TAF (QG PMMA)
// ==========================================================================

function renderDesempenho() {
    renderSimuladosTable();
    renderTafTable();
    renderCharts();
}

function renderSimuladosTable() {
    const body = document.getElementById("simulados-table-body");
    if (!body) return;
    body.innerHTML = "";
    
    if (!state.simulados || state.simulados.length === 0) {
        body.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Nenhum simulado cadastrado.</td></tr>`;
        return;
    }
    
    const sorted = [...state.simulados].sort((a, b) => b.number - a.number); // Mais recentes primeiro
    
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
            <td style="text-align: center;">
                <button class="btn btn-circle" onclick="editSimulado(${s.number})" title="Editar Simulado" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-standard); width: 28px; height: 28px;">
                    <i class="fa-solid fa-pen" style="font-size: 0.75rem; color: var(--accent);"></i>
                </button>
            </td>
        `;
        body.appendChild(tr);
    });
}

window.editSimulado = function(number) {
    const sim = state.simulados.find(s => s.number === number);
    if (!sim) return;
    
    const h3 = document.querySelector("#modal-log-simulado h3");
    if (h3) h3.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar Simulado ${number}`;
    
    const simNumInput = document.getElementById("form-sim-num");
    if (simNumInput) {
        simNumInput.value = sim.number;
        simNumInput.readOnly = true;
    }
    
    if (sim.date) {
        const parts = sim.date.split("/");
        if (parts.length === 3) {
            document.getElementById("form-sim-date").value = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
    
    document.getElementById("form-sim-p1-q").value = sim.p1_questions;
    document.getElementById("form-sim-p1-c").value = sim.p1_correct;
    document.getElementById("form-sim-p2-q").value = sim.p2_questions;
    document.getElementById("form-sim-p2-c").value = sim.p2_correct;
    document.getElementById("form-sim-score").value = sim.score;
    document.getElementById("form-sim-duration").value = sim.duration || "03:00:00";
    
    openModal("modal-log-simulado");
};

function renderTafTable() {
    const body = document.getElementById("taf-table-body");
    if (!body) return;
    body.innerHTML = "";
    
    if (!state.taf_semanal || state.taf_semanal.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum teste TAF cadastrado.</td></tr>`;
        return;
    }
    
    const sorted = [...state.taf_semanal].sort((a, b) => parseDate(b.date) - parseDate(a.date));
    
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

// --- REGISTRO DE SIMULADOS E REVISÕES EM LOTE (POR SEMANA) ---

window.populateSimuladoLoteWeeks = function() {
    const select = document.getElementById("form-sim-lote-week");
    if (!select) return;
    select.innerHTML = '<option value="">-- Selecione a Semana --</option>';
    
    const semanas = [...new Set(state.crono.map(c => c.semana))].filter(Boolean);
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
};

window.loadSimuladoWeekTopics = function(week) {
    const container = document.getElementById("sim-lote-topics-container");
    if (!container) return;
    container.innerHTML = "";
    
    if (!week) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; margin: 2rem 0;">Selecione uma semana para ver os temas.</p>';
        return;
    }
    
    const weekItems = state.crono.filter(c => c.semana === week);
    if (weekItems.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; margin: 2rem 0;">Nenhum tema encontrado para esta semana.</p>';
        return;
    }
    
    weekItems.forEach((item, idx) => {
        const itemRow = document.createElement("div");
        itemRow.className = "sim-lote-row";
        itemRow.style = "display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.015); border: 1px solid var(--border-standard); border-radius: 8px; margin-bottom: 0.5rem; flex-wrap: wrap;";
        
        itemRow.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 250px; flex: 1;">
                <input type="checkbox" class="lote-checkbox" data-subject="${escapeHtml(item.subject)}" data-topic="${escapeHtml(item.topic)}" onchange="toggleLoteRowInputs(this, ${idx})" style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0; margin: 0;">
                <div style="display: flex; flex-direction: column; gap: 0.15rem;">
                    <span style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px;">${item.subject}</span>
                    <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); line-height: 1.3;">${item.topic}</span>
                </div>
            </div>
            <div class="lote-inputs-grid" id="lote-inputs-${idx}" style="display: none; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; width: 320px; flex-shrink: 0;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 0.65rem; color: var(--text-secondary); margin-bottom: 3px; display: block;">Tempo (min)</label>
                    <input type="number" class="form-input lote-duration" min="0" value="20" style="padding: 0.35rem 0.5rem; font-size: 0.85rem; background: rgba(0,0,0,0.3); text-align: center; border-radius: 6px; border: 1px solid var(--border-standard);">
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 0.65rem; color: var(--text-secondary); margin-bottom: 3px; display: block;">Questões</label>
                    <input type="number" class="form-input lote-questions" min="0" value="10" style="padding: 0.35rem 0.5rem; font-size: 0.85rem; background: rgba(0,0,0,0.3); text-align: center; border-radius: 6px; border: 1px solid var(--border-standard);">
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 0.65rem; color: var(--text-secondary); margin-bottom: 3px; display: block;">Acertos</label>
                    <input type="number" class="form-input lote-correct" min="0" value="8" style="padding: 0.35rem 0.5rem; font-size: 0.85rem; background: rgba(0,0,0,0.3); text-align: center; border-radius: 6px; border: 1px solid var(--border-standard);">
                </div>
            </div>
        `;
        container.appendChild(itemRow);
    });
};

window.toggleLoteRowInputs = function(checkbox, idx) {
    const inputs = document.getElementById(`lote-inputs-${idx}`);
    if (inputs) {
        inputs.style.display = checkbox.checked ? "grid" : "none";
    }
};

window.toggleAllLoteCheckboxes = function(checked) {
    const checkboxes = document.querySelectorAll(".lote-checkbox");
    checkboxes.forEach((cb, idx) => {
        cb.checked = checked;
        window.toggleLoteRowInputs(cb, idx);
    });
};

async function handleSimuladoLoteFormSubmit(e) {
    e.preventDefault();
    
    const dateInput = document.getElementById("form-sim-lote-date").value;
    const formattedDate = formatDateInput(dateInput);
    
    const checkboxes = document.querySelectorAll(".lote-checkbox:checked");
    if (checkboxes.length === 0) {
        alert("Selecione pelo menos um tema para registrar!");
        return;
    }
    
    const bulkData = [];
    checkboxes.forEach(cb => {
        const row = cb.closest(".sim-lote-row");
        const duration = parseInt(row.querySelector(".lote-duration").value) || 0;
        const questions = parseInt(row.querySelector(".lote-questions").value) || 0;
        const correct = parseInt(row.querySelector(".lote-correct").value) || 0;
        
        bulkData.push({
            date: formattedDate,
            subject: cb.getAttribute("data-subject"),
            topic: cb.getAttribute("data-topic"),
            type: "Revisão",
            duration: duration,
            questions: questions,
            correct: correct,
            notes: "Simulado / Revisão em Lote"
        });
    });
    
    updateSyncText("Registrando lote no Excel...", "synching");
    const success = await apiRegisterStudyBulk(bulkData);
    if (success) {
        closeModal("modal-log-simulado-lote");
        document.getElementById("form-simulado-lote-log").reset();
        document.getElementById("sim-lote-topics-container").innerHTML = "";
        appDataReady();
    }
}

// Auxiliar para escapar HTML
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

