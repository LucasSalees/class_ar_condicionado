(function() {
    const BACKEND_URL = "https://project-air-conditioning.onrender.com";
    
    // Pega o caminho completo para não se perder em "Pretty URLs" do Netlify
    const path = window.location.pathname;

    // Se já estiver na loading.html, não faz nada
    if (path.includes("loading.html")) return;

    async function checkConnection() {
        try {
            // Adicionamos um timeout curto para o Netlify não ficar esperando para sempre
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 4000);

            const res = await fetch(`${BACKEND_URL}/login/health`, { 
                signal: controller.signal,
                mode: 'cors' // Força o modo CORS
            });
            clearTimeout(id);

            if (!res.ok) throw new Error();
        } catch (e) {
            console.log("Servidor Render offline. Redirecionando para loading...");
            // Usamos o caminho absoluto para o Netlify encontrar o arquivo
            window.location.href = "/pages/loading.html?from=" + encodeURIComponent(path);
        }
    }

    checkConnection();
})();