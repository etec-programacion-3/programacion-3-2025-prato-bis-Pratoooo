import jwt from "jsonwebtoken";

// La clave ahora se lee desde el archivo .env
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("La variable JWT_SECRET no está definida en el archivo .env");
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (token == null) {
    return res.status(401).json({ error: "Token no provisto" }); // 401 No autorizado
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" }); // 403 Prohibido
    }
    req.user = user; // Guarda el payload del token (ej: { id: 1, username: 'pepe' })
    next();
  });
};

export default authenticateToken;