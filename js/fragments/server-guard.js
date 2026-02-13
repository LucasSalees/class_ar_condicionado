// js/server-guard.js
(function() {
    const BACKEND_URL = "https://project-air-conditioning.onrender.com";
    const path = window.location.pathname;

    if (path.includes("loading.html")) return;

    async function checkConnection() {
        try {
            // Adicionamos mode: 'no-cors' para um check rápido de vida
            const res = await fetch(`${BACKEND_URL}/login/health`, { mode: 'cors' });
            if (!res.ok) throw new Error();
        } catch (e) {
            // No Netlify, precisamos do caminho absoluto para o loading
            window.location.href = "/pages/loading.html?from=" + encodeURIComponent(path);
        }
    }
    checkConnection();
})();