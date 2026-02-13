(function() {
    const BACKEND_URL = "https://project-air-conditioning.onrender.com";
    const path = window.location.pathname;

    if (path.includes("loading.html")) return;

    async function checkConnection() {
        try {
            // Se demorar mais de 3 segundos, assumimos que está "acordando" e redirecionamos
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 3000);

            const res = await fetch(`${BACKEND_URL}/login/health`, { 
                signal: controller.signal,
                mode: 'cors' 
            });
            clearTimeout(id);

            // Se o status não for 200 (OK), algo está errado (deploy ou cold start)
            if (!res.ok) throw new Error("Servidor instável");
            
        } catch (e) {
            console.error("Guarda Class Ar: Servidor offline ou em deploy. Redirecionando...");
            // Use o caminho absoluto para o loading
            window.location.href = "/pages/loading.html?from=" + encodeURIComponent(path);
        }
    }

    checkConnection();
})();