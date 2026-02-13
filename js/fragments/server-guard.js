(function() {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const BACKEND_URL = isLocal ? "http://localhost:8080" : "https://project-air-conditioning.onrender.com";
    
    async function checkSystemIntegrity() {
        try {
            // Timeout curto: se não responder em 4s, o sistema é considerado instável
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 4000);

            const res = await fetch(`${BACKEND_URL}/login/health`, { 
                signal: controller.signal,
                mode: 'cors'
            });
            clearTimeout(id);

            const statusText = await res.text();

            // SÓ LIBERA SE O BACKEND RESPONDER A STRING DE SUCESSO
            if (res.ok && statusText.includes("CLASS_AR_SYSTEM_READY")) {
                console.log("Class Ar: Backend validado. Liberando acesso.");
                // Remove o bloqueio de display do CSS
                document.body.setAttribute('style', 'display: block !important; opacity: 1;');
            } else {
                throw new Error("Sistema inconsistente");
            }
        } catch (e) {
            console.error("Falha Crítica no Backend. Redirecionando...");
            // Se falhar, o usuário nunca vê a tela de login e volta para o loading
            window.location.href = "/pages/loading.html?from=" + encodeURIComponent(window.location.pathname);
        }
    }

    checkSystemIntegrity();
})();