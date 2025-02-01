import mysql from 'mysql2/promise';

// Configurar pool de conexiones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: 'userpassword',
    database: 'my_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// quita los comentarios para insertar tablas
/* async function createTables() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('client', 'admin') NOT NULL
        );
    `;

    const createMesasTable = `
        CREATE TABLE IF NOT EXISTS mesas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            numero INT NOT NULL,
            capacidad INT NOT NULL,
            estado ENUM('disponible', 'ocupada') NOT NULL
        );
    `;

    const createReservasTable = `
        CREATE TABLE IF NOT EXISTS reservas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            mesa_id INT NOT NULL,
            fecha_reserva DATETIME NOT NULL,
            estado ENUM('pendiente', 'confirmada', 'cancelada') NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE CASCADE
        );
    `;

    try {
        const connection = await pool.getConnection();
        await connection.query(createUsersTable);
        await connection.query(createMesasTable);
        await connection.query(createReservasTable);
        connection.release();
    } catch (error) {
        console.error('Error creating tables:', error);
    }
} */




export default pool;

