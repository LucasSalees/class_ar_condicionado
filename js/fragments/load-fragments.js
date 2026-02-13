document.addEventListener("DOMContentLoaded", function() {
    const loadFragment = (id, url) => {
        const el = document.getElementById(id);
        if (el) {
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`Erro: ${response.status} ao carregar ${url}`);
                    return response.text();
                })
                .then(data => {
                    el.innerHTML = data;
                })
                .catch(err => console.error(err));
        }
    };

    // Ajuste dos caminhos conforme a sua estrutura real:
    loadFragment('nav-placeholder', '/pages/fragments/nav.html');
    loadFragment('footer-placeholder', '/pages/fragments/footer.html');
});