document.addEventListener("DOMContentLoaded", function() {
    const loadFragment = (id, url) => {
        const el = document.getElementById(id);
        if (el) {
            // Retornamos a Promise do fetch para saber quando terminou
            return fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`Erro: ${response.status} ao carregar ${url}`);
                    return response.text();
                })
                .then(data => {
                    el.innerHTML = data;
                //  console.log(`Fragmento carregado: ${url}`);
                })
                .catch(err => console.error("Erro ao carregar fragmento:", err));
        }
        return Promise.resolve(); // Se não houver elemento, resolvemos direto
    };

    // Criamos uma lista de promessas para os carregamentos
    const p1 = loadFragment('nav-placeholder', '/pages/fragments/nav.html');
    const p2 = loadFragment('footer-placeholder', '/pages/fragments/footer.html');

    // Quando AMBOS terminarem, avisamos o server-guard.js
    Promise.all([p1, p2]).then(() => {
        window.dispatchEvent(new Event('fragmentsLoaded'));
    });
});