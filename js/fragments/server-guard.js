// js/server-guard.js
(function() {
    const BACKEND_URL = "https://project-air-conditioning.onrender.com";
    const path = window.location.pathname;

    if (path.includes("loading.html")) return;

    async function checkConnection() {
        try {
            const controller = new AbortController();
            // Aumentamos o tempo para o Render responder sem pressa
            const timeoutId = setTimeout(() => controller.abort(), 10000); 

            const res = await fetch(`${BACKEND_URL}/login/health`, { 
                signal: controller.signal,
                mode: 'cors' 
            });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error();
        } catch (e) {
            // Se falhar, redireciona apenas se não houver conexão real
            window.location.href = "/pages/loading.html?from=" + encodeURIComponent(path);
        }
    }
    checkConnection();
})();