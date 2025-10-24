import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET_KEY = "clave_super_segura"; // Cambiala si querés más seguridad

// Registro de usuario nuevo
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await req.db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      res.status(400).json({ error: "El usuario ya existe" });
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
  res.json({ message: "Inicio de sesión exitoso", token });
});

export default router;
