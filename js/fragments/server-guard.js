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

            if (el.tagName === "BUTTON") {
                if (systemStatus.state === 'offline') {
                    el.innerText = "SISTEMA OFFLINE";
                    el.className = "btn btn-danger w-100 py-2 rounded-0 fw-bold"; // Muda para vermelho
                } else if (systemStatus.state === 'connecting') {
                    el.innerText = "VERIFICANDO...";
                    el.className = "btn btn-secondary w-100 py-2 rounded-0 fw-bold"; // Cinza
                } else {
                    el.innerText = "ENTRAR";
                    el.className = "btn btn-outline-gold w-100 py-2 rounded-0 fw-bold"; // Dourado original
                }
            }
        });
    }

    async function checkSystem() {
        try {
            const res = await fetch(`${BACKEND_URL}/login/health`, {
                mode: 'cors',
                cache: 'no-store'
            });

            const data = await res.text();

            if (res.ok && data.trim() === "CLASS_AR_SYSTEM_READY") {
                systemStatus = {
                    state: 'online',
                    label: 'online',
                    active: true
                };
            } else {
                throw new Error();
            }
        } catch {
            systemStatus = {
                state: 'offline',
                label: 'offline',
                active: false
            };
        } finally {
            // 💾 Salva estado para próximas páginas
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(systemStatus));
            refreshUI();
            setTimeout(checkSystem, 1000);
        }
    }

    refreshUI();
    checkSystem();
})();
