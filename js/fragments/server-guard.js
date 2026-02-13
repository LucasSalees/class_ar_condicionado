// js/server-guard.js
(function() {
    const BACKEND_URL = "https://project-air-conditioning.onrender.com";
    const path = window.location.pathname;

    // Não rodar o guarda se já estiver no loading
    if (path.includes("loading.html")) return;

async function checkConnection() {
    try {
        const res = await fetch(`${BACKEND_URL}/login/health`, { mode: 'cors' });
        const statusText = await res.text(); // Lê o corpo da resposta

        // Só libera se o status for OK E o corpo for a nossa string secreta
        if (res.ok && statusText === "CLASS_AR_SYSTEM_READY") {
            console.log("Class Ar Guard: Backend Realmente Online!");
        } else {
            throw new Error("Servidor em standby ou banco offline");
        }
    } catch (e) {
        console.warn("Class Ar Guard: Redirecionando para loading...");
        window.location.href = "/pages/loading.html?from=" + encodeURIComponent(path);
    }
}

    checkConnection();
})();