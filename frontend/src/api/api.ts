import axios from 'axios';

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/'; // Cambia según tu backend

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // Tiempo de espera de 5s
    headers: { 'Content-Type': 'application/json' }
});

export default api;
