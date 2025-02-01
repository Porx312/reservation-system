import express from 'express';
import pool from '../db/db.js';  // Importa el pool de conexiones

const mesasrouter = express.Router();

// Ruta para obtener todas las mesas
mesasrouter.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM mesas');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las mesas:', error);
        res.status(500).send('Error al obtener las mesas');
    }
});

export default mesasrouter;
