import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const saltRounds = 10;
// La clave ahora se lee desde el archivo .env
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("La variable JWT_SECRET no está definida en el archivo .env");
}

// ... (el resto de tu archivo authRoutes.js) ...
// (Pégalo aquí, solo asegúrate de que la línea 'const JWT_SECRET =' esté como arriba)
// ...

// Ejemplo de tu ruta /register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await req.db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    res.status(201).json({ id: result.lastID, username, email });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({ error: "El usuario o email ya existe" });
    }
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Ejemplo de tu ruta /login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y contraseña requeridos" });
  }
  try {
    const user = await req.db.get("SELECT * FROM users WHERE username = ?", [username]);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default router;