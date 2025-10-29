import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET_KEY = "clave_super_segura"; // Cambiala si querés más seguridad

// Registro de usuario nuevo
router.post("/register", async (req, res) => {
  // --- 👇 CORRECIÓN 1: Leer todos los campos que envía el frontend ---
  const { username, email, password } = req.body;

  // --- 👇 CORRECIÓN 1 (cont.): Validar los TRES campos ---
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // --- 👇 CORRECIÓN 1 (cont.): Insertar los TRES campos en la DB ---
    await req.db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
      [username, email, hashedPassword]
    );
    
    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      // Mejoramos el mensaje de error por si uno de los dos ya existe
      res.status(400).json({ error: "El usuario o el email ya existe" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await req.db.get("SELECT * FROM users WHERE username = ?", [username]);
  if (!user) {
    return res.status(400).json({ error: "Usuario no encontrado" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Contraseña incorrecta" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "2h" });

  // --- 👇 CORRECIÓN 2: Devolver el objeto 'user' al frontend ---
  // Tu App.jsx lo necesita para hacer setUser(response.data.user)
  const userToReturn = {
    id: user.id,
    username: user.username,
    email: user.email
  };

  res.json({ 
    message: "Inicio de sesión exitoso", 
    token,
    user: userToReturn // 👈 AÑADIDO
  });
});

export default router;