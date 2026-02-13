(function () {
    const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    const BACKEND_URL = isLocal
        ? "http://127.0.0.1:8080"
        : "https://project-air-conditioning.onrender.com";

    const SESSION_KEY = 'class_ar_system_state';

    // 🔁 Recupera estado salvo
    let systemStatus = JSON.parse(sessionStorage.getItem(SESSION_KEY));

    // 🟡 Se não existir, é primeira página da sessão
    if (!systemStatus) {
        systemStatus = {
            state: 'connecting',
            label: 'connecting',
            active: false
        };
    }

    function refreshUI() {
        const badge = document.getElementById('api-status-badge');
        const text = document.getElementById('api-status-text');
        const inputs = document.querySelectorAll('#loginForm input, #loginForm button');

        // Atualiza o Badge visual
        if (badge) {
            badge.className = `api-badge ${systemStatus.state}`;
            if (text) text.innerText = `API: ${systemStatus.label.toUpperCase()}`;
        }

        // Lógica de bloqueio: 
        // O sistema só fica liberado se o estado for exatamente 'online'
        const isLocked = systemStatus.state === 'offline' || systemStatus.state === 'connecting';

        inputs.forEach(el => {
            el.disabled = isLocked;

            // Dentro do inputs.forEach no refreshUI:
            if (el.tagName === "BUTTON") {
                if (systemStatus.state === 'connecting') {
                    el.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> CONECTANDO...`;
                    el.className = "btn btn-secondary w-100 py-2 rounded-0 fw-bold disabled";
                } else if (systemStatus.state === 'offline') {
                    el.innerText = "SISTEMA INDISPONÍVEL";
                    el.className = "btn btn-danger w-100 py-2 rounded-0 fw-bold disabled";
                } else {
                    el.innerText = "ENTRAR";
                    el.className = "btn btn-outline-gold w-100 py-2 rounded-0 fw-bold";
                }
            }
        });
    }

    async function checkSystem() {
        // Criamos um controlador para cancelar a requisição se demorar muito (Timeout)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de limite

        try {
            const res = await fetch(`${BACKEND_URL}/login/health`, {
                mode: 'cors',
                cache: 'no-store',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await res.text();

            if (res.ok && data.trim() === "CLASS_AR_SYSTEM_READY") {
                systemStatus = { 
                    state: 'online', 
                    label: 'ONLINE', 
                    active: true 
                };
            } else {
                throw new Error();
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                // Se deu timeout, provavelmente o Render está "acordando" o servidor
                systemStatus = {
                    state: 'connecting',
                    label: 'INICIALIZANDO SERVIDOR...',
                    active: false
                };
            } else {
                // Se deu erro de conexão (deploy em curso ou servidor fora)
                systemStatus = {
                    state: 'offline',
                    label: 'OFFLINE',
                    active: false
                };
            }
        } finally {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(systemStatus));
            refreshUI();
            // Se estiver inicializando, tenta de novo mais rápido (5s), senão, aguarda 30s
            const nextCheck = systemStatus.state === 'online' ? 30000 : 5000;
            setTimeout(checkSystem, nextCheck);
        }
    }

    refreshUI();
    checkSystem();
})();
