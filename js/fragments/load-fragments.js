document.addEventListener("DOMContentLoaded", function() {
    const loadFragment = (id, url) => {
        const el = document.getElementById(id);
        if (el) {
            // Usamos a barra inicial '/' para garantir que a busca comece na raiz do Netlify
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`Erro: ${response.status} ao carregar ${url}`);
                    return response.text();
                })
                .then(data => {
                    el.innerHTML = data;
                    console.log(`Fragmento carregado: ${url}`);
                })
                .catch(err => console.error("Erro ao carregar fragmento:", err));
        }
    };

    // Ajuste dos caminhos baseados na sua estrutura de pastas real
    loadFragment('nav-placeholder', '/pages/fragments/nav.html');
    loadFragment('footer-placeholder', '/pages/fragments/footer.html');
});