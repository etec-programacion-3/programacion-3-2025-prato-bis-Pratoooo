// mi-app/Backend/middleware/authMiddleware.js (ARCHIVO NUEVO)

import jwt from 'jsonwebtoken';

const SECRET_KEY = "clave_super_segura"; // La misma clave que usaste en authRoutes.js

const authenticateToken = (req, res, next) => {
  // Obtenemos el token del header 'Authorization' (formato: "Bearer TOKEN")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae solo el TOKEN

  if (token == null) {
    // Si no hay token, no está autorizado
    return res.sendStatus(401); // Unauthorized
  }

  // Verificamos el token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Error al verificar token:", err);
      // Si el token es inválido o expiró
      return res.sendStatus(403); // Forbidden
    }
    
    // Si el token es válido, guardamos la info del usuario en req.user
    // para que las siguientes rutas puedan usarla (ej. req.user.id)
    req.user = user; 
    next(); // Pasamos al siguiente middleware o a la ruta
  });
};

export default authenticateToken;