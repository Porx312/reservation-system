import express from 'express';
import cors from 'cors';  // Importa cors
import routes from '../routes/userRoutes.js';  // Importa las rutas de usuarios
import mesasrouter from '../routes/mesas.route.js';
import reservasrouter from '../routes/reservas.route.js';
const app = express();
const PORT = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Habilitar CORS para todas las solicitudes
app.use(cors({
    origin: 'http://localhost:5173'  // Reemplaza con tu dominio permitido
}));

// Ruta para obtener todas las mesas


// Rutas de usuarios (registro, login, etc.)
app.use('/users', routes);  // Usa las rutas de usuarios en el endpoint /users
app.use('/mesas', mesasrouter);  // Usa las rutas de usuarios en el endpoint /users
app.use('/reservas', reservasrouter);  // Usa las rutas de usuarios en el endpoint /users

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
