// ==========================================================================
// 🗓️ Cronograma Module — Controle da Grade de Estudos Semanal (QG PMMA)
// ==========================================================================

// Estado persistente em tempo de execução para as seções de semanas recolhidas
let cronoWeekCollapsed = {};

function populateCronoFilterSemanas() {
    const select = document.getElementById("filter-crono-week");
    if (!select) return;
    
    const currentValue = select.value;
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
    
    // Restaura o valor selecionado se ele ainda existir na lista
    if (currentValue && [...select.options].some(opt => opt.value === currentValue)) {
        select.value = currentValue;
    }
}

function renderCronograma() {
    const container = document.getElementById("crono-weeks-list");
    if (!container) return;
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
        
        // Verifica se a seção está marcada como recolhida. Se não estiver no objeto, por padrão inicia aberta.
        const isCollapsed = cronoWeekCollapsed[semana] === true;
        
        const weekSec = document.createElement("div");
        weekSec.className = `week-section ${isCollapsed ? '' : 'open'}`;
        
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

// Tornar global para acesso do onclick
window.toggleWeekSection = function(headerEl) {
    const section = headerEl.parentElement;
    section.classList.toggle("open");
    
    // Obtém o nome da semana e salva o estado de recolhida
    const weekName = headerEl.querySelector("h4").textContent.trim();
    cronoWeekCollapsed[weekName] = !section.classList.contains("open");
};

