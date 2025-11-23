//--------------------------------------------------------------
// ELEMENTOS
//--------------------------------------------------------------
/*
    search.js
    -------
    Client-side search page logic for Singularity.

    Purpose: load `projects.json`, read query params (q / filter), and
    render matching project cards into `#results`.

    Notes for maintainers:
    - This file performs DOM lookups and network fetch; keep selectors
        in sync with `search.html` (header-search / footer-search forms).
    - Non-functional edits (spacing/comments) are safe. Avoid renaming
        exported symbols; functions are referenced only in this file.
*/

// try to find the visible search input: prefer header, then footer, then any text input
const searchInput = document.querySelector('#header-search input')
                                 || document.querySelector('#footer-search input')
                                 || document.querySelector('input[type="text"]');

const resultsDiv = document.getElementById("results");
const statsDiv = document.getElementById("stats");

let projects = [];


// ============================================================================
// PESQUISA
// ============================================================================
document.getElementById("header-search").addEventListener("submit", (event) => {
  textSearch(event, "header");
});

document.getElementById("footer-search").addEventListener("submit", (event) => {
  textSearch(event, "footer");
});

function textSearch(event, location) {
  if (event) event.preventDefault();

  const termo = document.querySelector(`#${location}-search input`).value.trim();

  if (!termo) {
    alert("Digite algo para pesquisar.");
    return;
  }

  window.location.href = `search.html?q=${encodeURIComponent(termo)}`;
}



//--------------------------------------------------------------
// CARREGA O JSON LOCAL
//--------------------------------------------------------------
async function loadProjects() {
    const res = await fetch("projects.json");
    projects = (await res.json()).projects || [];
}


//--------------------------------------------------------------
// NORMALIZA TEXTO
//--------------------------------------------------------------
function norm(txt) {
    return (txt || "").toString().trim().toLowerCase();
}


//--------------------------------------------------------------
// SALVA NA URL
//--------------------------------------------------------------
function updateURL(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, "", url);
}


//--------------------------------------------------------------
// BUSCA POR TEXTO
//--------------------------------------------------------------
function performSearch() {
    const query = norm(searchInput.value);

    if (!query) {
        statsDiv.innerHTML = "";
        resultsDiv.innerHTML = `
            <div class="text-gray-400 text-center py-12">
                Digite um termo para pesquisar projetos.
            </div>`;
        return;
    }

    updateURL("q", query);

    const filtered = projects.filter(p =>
        norm(p.name).includes(query) ||
        norm(p["translated-name"]).includes(query) ||
        norm(p.description).includes(query) ||
        norm(p["translated-description"]).includes(query)
    );

    renderResults(filtered);
}


//--------------------------------------------------------------
// BUSCA POR FILTRO DE LINGUAGEM OU CATEGORIA
//--------------------------------------------------------------
function performFilterSearch() {
    let filterStr = new URLSearchParams(window.location.search).get("filter");
    if (!filterStr) return;

    // separa filtros múltiplos
    const filters = filterStr
        .split(",")
        .map(f => norm(f))
        .filter(f => f.length > 0);

    const filtered = projects.filter(p => {
        const langs = (p["programing-language"] || []).map(norm);
        const cat = norm(p.category);
        const tcat = norm(p["translated-category"]);

        // OR — retorna true se QUALQUER filtro bater
        return filters.some(f =>
            langs.includes(f) ||
            cat === f ||
            tcat === f
        );
    });

    renderResults(filtered);
}


//--------------------------------------------------------------
// DIFICULDADE DO PROJETO
//--------------------------------------------------------------
function getDifficultyColor(diff) {
  const d = diff.toLowerCase();

  if (d === "easy") return "border bg-green-500/20 border-green-400/40 text-green-300";
  if (d === "medium") return "border bg-yellow-500/20 border-yellow-400/40 text-yellow-300";
  if (d === "hard") return "border bg-orange-500/20 border-orange-400/40 text-orange-300";
  if (d === "insane") return "border bg-red-500/20 border-red-400/40 text-red-300";

  return "bg-gray-500/20 border-gray-400/40 text-gray-300";
}

//--------------------------------------------------------------
// DESENHA RESULTADOS NA TELA
//--------------------------------------------------------------
function renderResults(list) {
    statsDiv.innerHTML = ``;
    resultsDiv.innerHTML = "";

    if (list.length === 0) {
        resultsDiv.innerHTML = `
            <div class="text-gray-400 text-center py-12">
                Nenhum projeto encontrado.
            </div>`;
        return;
    }

    list.forEach(proj => {
        const div = document.createElement("div");
        div.className = "result-card rounded-lg p-6";

        div.innerHTML = `
            <a href="project.html?id=${proj.id}" class="result-link text-xl font-medium block mb-2">
                ${proj["translated-name"] || proj.name}
            </a>

            <div class="text-gray-500 text-sm mb-1">
                <b>Original:</b> ${proj.name}
            </div>

            <div class="text-gray-300 mb-2">
                ${proj["translated-description"] || proj.description}
            </div>

            <div class="text-gray-500 text-sm">
                <b>Original:</b> ${proj.description}
            </div>
            <div class="mt-6 flex flex-wrap gap-4 text-sm">
                <span class="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40">
                    Categoria: ${proj["translated-category"] || proj.category}
                </span>

                <span class="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40">
                    Linguagens: ${(proj["programing-language"] || []).join(", ")}
                </span>

                <span class="px-3 py-1 rounded-full ${getDifficultyColor(proj.dificulty)}">
                    Dificuldade: ${proj.dificulty}
                </span>
            </div>
        `;

        resultsDiv.appendChild(div);
    });
}



//--------------------------------------------------------------
// EVENTOS
//--------------------------------------------------------------
if (searchInput) {
    searchInput.addEventListener("keypress", e => {
        if (e.key === "Enter") performSearch();
    });
}


//--------------------------------------------------------------
// INICIALIZAÇÃO
//--------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    await loadProjects();

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const f = params.get("filter");

    if (q) {
        if (searchInput) searchInput.value = q;
        performSearch();
        return;
    }

    if (f) {
        performFilterSearch();
        return;
    }

    resultsDiv.innerHTML = `
        <div class="text-gray-400 text-center py-12">
            Digite um termo para pesquisar projetos.
        </div>`;
});
