const BASE_URL = "https://project-air-conditioning.onrender.com"; 

async function callAPI(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (response.status === 403 || response.status === 401) {
            // Se o token expirou ou é inválido, desloga
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        return response;
    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
}