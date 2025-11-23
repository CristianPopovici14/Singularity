/*
  project.js
  -----------
  Loads a single project by id (from URL) and renders the project
  details into the project page.

  Notes:
  - `proj` is a module-level variable used by render and embed helpers.
  - Keep `projects.json` schema in sync with render logic.
*/

//--------------------------------------------------------------
// PEGA O ID DA URL
//--------------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

const container = document.getElementById("project-container");
const embedBox = document.getElementById("embed-box");

let proj;


//--------------------------------------------------------------
// CARREGA JSON
//--------------------------------------------------------------
async function loadProject() {
  const res = await fetch("projects.json");
  const data = await res.json();

  proj = data.projects.find(p => p.id === id);

  if (!proj) {
    container.innerHTML = `
      <div class="text-red-400 text-xl">Projeto não encontrado.</div>
    `;
    return;
  }

  renderProject();
  renderEmbed();
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
// DESENHA O CARD
//--------------------------------------------------------------
function renderProject() {
  container.innerHTML = `
    <h1 class="text-3xl font-bold text-blue-300">
      ${proj["translated-name"] || proj.name}
    </h1>

    <p class="text-gray-400 italic">Original: ${proj.name}</p>

    <p class="text-gray-300 mt-4">
      ${proj["translated-description"] || proj.description}
    </p>

    <p class="text-gray-500">
      <b>Original:</b> ${proj.description}
    </p>

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

    <a href="${proj.link}" target="_blank"
      class="inline-block mt-6 px-5 py-2 rounded-lg bg-blue-600/30 border border-blue-500/40 
             hover:bg-blue-600/50 transition text-blue-300 font-semibold">
      🔗 Abrir página original
    </a>
  `;
}


//--------------------------------------------------------------
// INICIALIZA
//--------------------------------------------------------------
loadProject();
