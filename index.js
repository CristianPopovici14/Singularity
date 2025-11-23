/*
  index.js
  ========
  Main front page script for Singularity.

  Responsibilities:
  - Build filter chips
  - Toggle between search / filter modes
  - Redirect to `search.html` with query or filter params

  Keep selectors in sync with `index.html`.
*/

// ============================================================================
// LISTAS DE FILTRO (CATEGORIAS E LINGUAGENS)
// ============================================================================
const categorias = [
  "3D Renderer", "Augmented Reality", "BitTorrent Client",
  "Blockchain / Cryptocurrency", "Bot", "Command-Line Tool",
  "Database", "Docker", "Emulator / Virtual Machine",
  "Front-end Framework / Library", "Game", "Git", "Network Stack",
  "Neural Network", "Operating System", "Physics Engine",
  "Programming Language", "Regex Engine", "Search Engine",
  "Shell", "Template Engine", "Text Editor", "Visual Recognition System",
  "Voxel Engine", "Web Browser", "Web Server"
];

const linguagens = [
  "C", "C++", "C#", "Go", "Java", "JavaScript", "Python", "Ruby", "Rust",
  "Swift", "PHP", "Kotlin", "Haskell", "Lua", "Bash", "Typescript",
  "Assembly", "R", "Dart", "OCaml", "Perl", "Scala", "Elixir", "Erlang", "Zig"
];


// ============================================================================
// ELEMENTOS DA INTERFACE
// ============================================================================
const filtroSelect = document.querySelector("select.filter-select");
const chipsContainer = document.querySelector("#filter-section .flex.flex-wrap");
const searchSection = document.getElementById("search-section");
const filterSection = document.getElementById("filter-section");
const filterTitle = filtroSelect; // o select É o "título" do filtro


// ============================================================================
// SWITCH – Alternância entre Pesquisar e Filtrar
// ============================================================================
const btnSearch = document.getElementById("switch-search");
const btnFilter = document.getElementById("switch-filter");

// Estado inicial
filterSection.classList.add("hide");
filterTitle.classList.add("hide");

btnSearch.addEventListener("click", () => {
  ativarModoPesquisa();
});

btnFilter.addEventListener("click", () => {
  ativarModoFiltro();
});

function ativarModoPesquisa() {
  btnSearch.classList.add("active");
  btnFilter.classList.remove("active");

  searchSection.classList.remove("hide");
  filterSection.classList.add("hide");
  filterTitle.classList.add("hide");
}

function ativarModoFiltro() {
  btnFilter.classList.add("active");
  btnSearch.classList.remove("active");

  filterSection.classList.remove("hide");
  filterTitle.classList.remove("hide");
  searchSection.classList.add("hide");
}


// ============================================================================
// CRIAÇÃO DINÂMICA DOS CHIPS DE FILTRO
// ============================================================================
function gerarChips(lista) {
  chipsContainer.innerHTML = "";

  lista.forEach(item => {
    const chip = document.createElement("button");
    chip.className = "filter-chip";
    chip.innerHTML = `<span class="checkmark">✓</span>${item}`;

    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
    });

    chipsContainer.appendChild(chip);
  });
}


// ============================================================================
// SELECT — Alteração entre tipos de filtros
// ============================================================================
filtroSelect.addEventListener("change", () => {
  if (filtroSelect.value === "Linguagem de Programação") {
    gerarChips(linguagens);
  } else {
    gerarChips(categorias);
  }
});


// Garante que ao recarregar os chips certos apareçam
if (filtroSelect.value === "Linguagem de Programação") {
  gerarChips(linguagens);
} else {
  gerarChips(categorias);
}


// ============================================================================
// FUNÇÕES DE PESQUISA
// ============================================================================

// 🔍 Pesquisa por texto do input
document.getElementById("search-section").addEventListener("submit", textSearch);

function textSearch(event) {
  if (event) event.preventDefault();

  const termo = document.querySelector("#search-section input").value.trim();

  if (!termo) {
    alert("Digite algo para pesquisar.");
    return;
  }

  // Redireciona para o search.html com o termo
  window.location.href = `search.html?q=${encodeURIComponent(termo)}`;
}

// 🔎 Pesquisa usando filtros (chips)
function filterSearch() {
    const ativos = [...document.querySelectorAll(".filter-chip.active")]
        .map(btn => btn.textContent.replace("✓", "").trim());  // REMOVE O TICK

    if (ativos.length === 0) return;

    const query = ativos.join(",");  // ex: "Python,JavaScript"

    window.location.href = `search.html?filter=${encodeURIComponent(query)}`;
}

