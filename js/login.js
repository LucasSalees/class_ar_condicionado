// js/login.js
async function handleLogin(event) {
    event.preventDefault();
    
    const btn = event.target.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = "Autenticando...";

    const payload = {
        username: document.getElementById('usuario').value,
        password: document.getElementById('senha').value
    };

    try { 
        const response = await fetch(`${window.BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            
            // Usamos caminhos absolutos com '/' para o Netlify
            window.location.href = data.primeiroAcesso 
                ? '/pages/reset-password.html' 
                : '/pages/dashboard.html';
        } else {
            alert("Usuário ou senha incorretos.");
            btn.disabled = false;
            btn.innerHTML = "ACESSAR SISTEMA";
        }
    } catch (error) {
        // Caso o servidor caia exatamente no momento do clique
        window.location.href = "/pages/loading.html?from=/pages/login.html";
    }
}

document.getElementById('loginForm')?.addEventListener('submit', handleLogin);