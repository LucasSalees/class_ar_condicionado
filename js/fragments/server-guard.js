// js/server-guard.js
(function() {
    const BACKEND_URL = "https://project-air-conditioning.onrender.com";
    
    // Lista de páginas que NÃO precisam de conexão ativa imediata (se houver)
    const bypassPages = ['loading.html'];
    const currentPage = window.location.pathname.split("/").pop();

    if (bypassPages.includes(currentPage)) return;

    async function checkConnection() {
        try {
            const res = await fetch(`${BACKEND_URL}/login/health`);
            if (!res.ok) throw new Error();
        } catch (e) {
            // Se o servidor não responder, envia para a página de loading
            // passando a página atual como parâmetro 'from'
            const from = window.location.pathname;
            window.location.href = `/pages/loading.html?from=${from}`;
        }
    }

    // Executa a checagem
    checkConnection();
})();