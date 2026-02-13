// js/server-guard.js
(function() {
    const BACKEND_URL = "https://project-air-conditioning.onrender.com";
    const path = window.location.pathname;

    // Não rodar o guarda se já estiver no loading
    if (path.includes("loading.html")) return;

    async function checkConnection() {
        console.log("Class Ar Guard: Verificando conexão com o Render...");
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 segundos de limite

            const res = await fetch(`${BACKEND_URL}/login/health`, { 
                signal: controller.signal,
                mode: 'cors' 
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                console.log("Class Ar Guard: Backend Online!");
            } else {
                throw new Error("Backend retornou erro");
            }
        } catch (e) {
            console.warn("Class Ar Guard: Backend Offline. Redirecionando...");
            // Força o redirecionamento absoluto para o Netlify não se perder
            window.location.href = "/pages/loading.html?from=" + encodeURIComponent(path);
        }
    }

    checkConnection();
})();