import express from 'express';
import pool from '../db/db.js';  // Importa el pool de conexiones

const reservasrouter = express.Router();

// Ruta para obtener todas las reservas
reservasrouter.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reservas');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).send('Error al obtener las reservas');
    }
});

// Ruta para obtener una reserva por ID
reservasrouter.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reservas WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la reserva:', error);
        res.status(500).send('Error al obtener la reserva');
    }
});

reservasrouter.post('/', async (req, res) => {
    const { user_id, mesa_id, fecha_reserva, estado } = req.body;

    const connection = await pool.getConnection();  // Obtener una conexión

    try {
        // Iniciar la transacción
        await connection.beginTransaction();

        // 1. Verificar si el usuario ya tiene una reserva activa
        console.log("Verificando si el usuario ya tiene una reserva activa...");
        const [reservaActiva] = await connection.query(
            'SELECT * FROM reservas WHERE user_id = ? AND estado IN ("pendiente", "completado")', 
            [user_id]
        );

        // Si el usuario tiene una reserva activa, no permitir más reservas
        if (reservaActiva.length > 0) {
            console.log("El usuario ya tiene una reserva activa.");
            return res.status(400).json({ message: 'El usuario ya tiene una reserva activa.' });
        }

        // 2. Verificar si la mesa está disponible
        console.log("Verificando disponibilidad de la mesa...");
        const [mesa] = await connection.query('SELECT * FROM mesas WHERE id = ? AND estado = "disponible"', [mesa_id]);
        
        if (mesa.length === 0) {
            console.log("La mesa no está disponible.");
            return res.status(400).json({ message: 'La mesa no está disponible para la reserva' });
        }

        // 3. Asegurarnos de que el estado es uno válido
        const estadosValidos = ['pendiente', 'completado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            console.log("Estado no válido:", estado);
            return res.status(400).json({ message: 'Estado de reserva no válido' });
        }

        // 4. Crear la nueva reserva con el estado adecuado
        console.log("Creando la nueva reserva...");
        const [resultReserva] = await connection.query('INSERT INTO reservas (user_id, mesa_id, fecha_reserva, estado) VALUES (?, ?, ?, ?)', [user_id, mesa_id, fecha_reserva, estado]);
        
        console.log("Reserva creada con ID:", resultReserva.insertId);

        // 5. Actualizar el estado de la mesa a "ocupada" en caso de que sea necesario (en este caso, solo se actualiza si la mesa está disponible)
        console.log("Actualizando el estado de la mesa...");
        const [resultMesa] = await connection.query('UPDATE mesas SET estado = "ocupada" WHERE id = ?', [mesa_id]);

        // Verificar que la mesa se haya actualizado
        if (resultMesa.affectedRows === 0) {
            console.log("Error al actualizar el estado de la mesa.");
            return res.status(400).json({ message: 'Error al actualizar el estado de la mesa' });
        }

        // Confirmar la transacción
        await connection.commit();
        console.log("Transacción completada con éxito.");

        // Responder con los datos de la nueva reserva
        res.status(201).json({ 
            id: resultReserva.insertId, 
            user_id, 
            mesa_id, 
            fecha_reserva, 
            estado 
        });

    } catch (error) {
        // Si hay algún error, deshacer todo (rollback)
        await connection.rollback();
        console.error('Error al crear la reserva:', error);
        res.status(500).send('Error al crear la reserva');
    } finally {
        // Liberar la conexión
        connection.release();
    }
});


// Ruta para actualizar una reserva por ID
reservasrouter.put('/:id', async (req, res) => {
    const { estado } = req.body;

    try {
        const [result] = await pool.query('UPDATE reservas SET estado = ? WHERE id = ?', [estado, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.json({ message: 'Reserva actualizada' });
    } catch (error) {
        console.error('Error al actualizar la reserva:', error);
        res.status(500).send('Error al actualizar la reserva');
    }
});

// Ruta para eliminar una reserva por ID
reservasrouter.delete('/:id', async (req, res) => {
    const connection = await pool.getConnection();  // Obtener una conexión

    try {
        // Iniciar la transacción
        await connection.beginTransaction();

        // Obtener la reserva antes de eliminarla para saber el mesa_id
        const [reserva] = await connection.query('SELECT mesa_id FROM reservas WHERE id = ?', [req.params.id]);
        if (reserva.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Eliminar la reserva
        const [result] = await connection.query('DELETE FROM reservas WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Actualizar el estado de la mesa a "disponible"
        const [resultMesa] = await connection.query('UPDATE mesas SET estado = "disponible" WHERE id = ?', [reserva[0].mesa_id]);
        if (resultMesa.affectedRows === 0) {
            return res.status(400).json({ message: 'Error al actualizar el estado de la mesa' });
        }

        // Confirmar la transacción
        await connection.commit();
        res.json({ message: 'Reserva eliminada y mesa actualizada a disponible' });

    } catch (error) {
        // Si hay algún error, deshacer todo (rollback)
        await connection.rollback();
        console.error('Error al eliminar la reserva:', error);
        res.status(500).send('Error al eliminar la reserva');
    } finally {
        // Liberar la conexión
        connection.release();
    }
});

export default reservasrouter;
