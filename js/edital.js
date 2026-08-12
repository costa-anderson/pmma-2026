// ==========================================================================
// 📖 Edital Module — Controle de Tópicos do Edital PMMA (QG PMMA)
// ==========================================================================

function populateEditalFilterSubjects() {
    const select = document.getElementById("filter-edital-subject");
    if (!select) return;
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
    if (!body) return;
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
