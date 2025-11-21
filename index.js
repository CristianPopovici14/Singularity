function firstSearch() {
    const raw = document.getElementById('query').value.trim();

    if (!raw) {
        alert('Type something!');
        return;
    }

    const params = new URLSearchParams({ q: raw });
    window.location.href = `search.html?${params.toString()}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('query');
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') firstSearch();
    });
});
