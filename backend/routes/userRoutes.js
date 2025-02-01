import express from 'express';
import db from '../db/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';  // Para crear un token JWT
import dotenv from 'dotenv';

dotenv.config(); // Para cargar variables de entorno como JWT_SECRET

const router = express.Router();
// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Extrae el token sin "Bearer"

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedUser; // Guarda los datos del usuario en `req.user`
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

// Ruta para obtener la información del usuario autenticado 

router.get('/token', verifyToken, (req, res) => {
  res.json({ 
    id: req.user.id,
    name: req.user.name || 'No disponible',
    email: req.user.email,
    role: req.user.role,
    token: req.header('Authorization').split(' ')[1] // Enviar el token también
  });
});

// Registro de usuario
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la base de datos
    const [result] = await db.query('INSERT INTO users (id, name, email, password, role) VALUES (UUID(), ?, ?, ?, ?)', [name, email, hashedPassword, role]);
    
    // Enviar respuesta
    res.status(201).json({ message: 'Usuario registrado correctamente', id: result.insertId, name, email, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login de usuario
// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña con la almacenada
    const validPassword = await bcrypt.compare(password, rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear un token JWT incluyendo todos los datos del usuario
    const token = jwt.sign(
      {
        id: rows[0].id,
        name: rows[0].name,   // 🔹 Ahora se incluye el nombre
        email: rows[0].email, // 🔹 Ahora se incluye el email
        role: rows[0].role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar respuesta con el token y los datos del usuario
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        role: rows[0].role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






// Obtener todos los usuarios (solo para admins)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un usuario por ID (solo para admins)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un usuario por ID (solo para admins)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const [result] = await db.query('UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?', [name, email, password, role, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un usuario por ID (solo para admins)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
