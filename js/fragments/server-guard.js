window.BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://project-air-conditioning.onrender.com";

(function() {
    const path = window.location.pathname;
    if (path.includes("loading.html")) return;

    async function checkConnection() {
        try {
            const res = await fetch(`${BACKEND_URL}/login/health`);
            
            if (res.ok) {
                // Em vez de mudar o 'display', adicionamos a classe que criamos no CSS
                document.body.classList.add('ready');
                console.log("Class Ar: Sistema validado e visível.");
            } else {
                throw new Error();
            }
        } catch (e) {
            window.location.href = "/pages/loading.html?from=" + encodeURIComponent(path);
        }
    }
    checkConnection();
})();