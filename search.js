const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const statsDiv = document.getElementById("stats");

function getQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q");
}

function updateURL(query) {
    const url = new URL(window.location);
    url.searchParams.set("q", query);
    window.history.pushState({}, "", url);
}

async function performSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        resultsDiv.innerHTML = `<div class="text-gray-400 text-center py-12">
            Digite um termo para pesquisar artigos científicos.
        </div>`;
        statsDiv.innerHTML = "";
        return;
    }

    updateURL(query);

    resultsDiv.innerHTML = `<div class="text-gray-400 text-center py-12">
        Pesquisando...
    </div>`;
    statsDiv.innerHTML = "";

    const url = `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(query)},is_oa:true&per-page=20`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            resultsDiv.innerHTML = `<div class="text-gray-400 text-center py-12">
                Nenhum artigo encontrado.
            </div>`;
            statsDiv.innerHTML = "Cerca de 0 resultados";
            return;
        }

        const count = data.meta?.count || data.results.length;
        statsDiv.innerHTML = `Cerca de ${count.toLocaleString()} resultados`;

        resultsDiv.innerHTML = "";

        data.results.forEach(paper => {
            const title = paper.display_name || "Sem título";
            const authors = paper.authorships
                ? paper.authorships.slice(0, 3).map(a => a.author.display_name).join(", ")
                : "Autores desconhecidos";

            const link = paper.open_access?.oa_url || paper.doi || "#";

            let domain = "openalex.org";
            try {
                if (link !== "#") domain = new URL(link).hostname.replace("www.", "");
            } catch (e) {}

            const year = paper.publication_year || "";
            const venue = paper.primary_location?.source?.display_name || "";
            const snippet = [venue, year].filter(Boolean).join(" · ");

            const div = document.createElement("div");
            div.className = "result-card rounded-lg p-6";

            div.innerHTML = `
                <div class="text-sm text-gray-500 mb-1">${domain}</div>
                <a href="${link}" target="_blank" class="result-link text-xl font-medium block mb-2">
                    ${title}
                </a>
                <div class="text-sm text-gray-400 mb-1">${authors}</div>
                ${snippet ? `<div class="text-sm text-gray-500">${snippet}</div>` : ""}
            `;

            resultsDiv.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = `<div class="text-red-400 text-center py-12">
            Erro ao buscar resultados.
        </div>`;
        statsDiv.innerHTML = "";
    }
}

searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") performSearch();
});

document.addEventListener("DOMContentLoaded", () => {
    const q = getQuery();

    if (q) {
        searchInput.value = q;
        performSearch();
    } else {
        resultsDiv.innerHTML = `<div class="text-gray-400 text-center py-12">
            Digite um termo para pesquisar artigos científicos.
        </div>`;
    }
});
