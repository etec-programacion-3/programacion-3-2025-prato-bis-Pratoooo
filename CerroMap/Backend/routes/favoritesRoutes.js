// mi-app/Backend/routes/favoritesRoutes.js (ARCHIVO NUEVO)

import express from "express";
import authenticateToken from "../middleware/authMiddleware.js"; // Importamos el middleware

const router = express.Router();

// --- Middleware para TODAS las rutas de este archivo ---
// Esto asegura que solo usuarios logueados puedan acceder a /favorites/*
router.use(authenticateToken); 

// --- GET /favorites ---
// Obtiene la lista de IDs y nombres de cerros favoritos del usuario logueado
router.get("/", async (req, res) => {
  const userId = req.user.id; // Obtenemos el ID del usuario desde el token verificado

  try {
    // Buscamos en user_favorites las entradas de este usuario
    // y unimos con la tabla cerros para obtener los detalles del cerro
    const favoriteCerros = await req.db.all(`
      SELECT c.id, c.nombre, c.altura, c.provincia, c.descripcion, c.imagen 
      FROM user_favorites uf
      JOIN cerros c ON uf.cerro_id = c.id
      WHERE uf.user_id = ?
    `, [userId]);

    res.json(favoriteCerros);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- POST /favorites/:cerroId ---
// Añade un cerro a los favoritos del usuario logueado
router.post("/:cerroId", async (req, res) => {
  const userId = req.user.id;
  const cerroId = parseInt(req.params.cerroId, 10); // Obtenemos el ID del cerro de la URL

  if (isNaN(cerroId)) {
     return res.status(400).json({ error: "ID de cerro inválido" });
  }

  try {
    // Verificamos si el cerro existe (opcional pero buena práctica)
    const cerroExists = await req.db.get("SELECT id FROM cerros WHERE id = ?", [cerroId]);
    if (!cerroExists) {
        return res.status(404).json({ error: "Cerro no encontrado" });
    }

    // Intentamos insertar la relación en la tabla user_favorites
    await req.db.run(
      "INSERT OR IGNORE INTO user_favorites (user_id, cerro_id) VALUES (?, ?)",
      [userId, cerroId]
    );
    // Usamos 'INSERT OR IGNORE' para que no dé error si ya existe (la clave primaria lo evita)
    
    res.status(201).json({ message: "Cerro añadido a favoritos" }); 
  } catch (error) {
    console.error("Error al añadir favorito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- DELETE /favorites/:cerroId ---
// Elimina un cerro de los favoritos del usuario logueado
router.delete("/:cerroId", async (req, res) => {
  const userId = req.user.id;
  const cerroId = parseInt(req.params.cerroId, 10);

   if (isNaN(cerroId)) {
     return res.status(400).json({ error: "ID de cerro inválido" });
  }

  try {
    // Eliminamos la relación de la tabla user_favorites
    const result = await req.db.run(
      "DELETE FROM user_favorites WHERE user_id = ? AND cerro_id = ?",
      [userId, cerroId]
    );

    if (result.changes === 0) {
      // Si no se borró nada, es porque no era favorito
       return res.status(404).json({ message: "El cerro no estaba en favoritos" });
    }

    res.json({ message: "Cerro eliminado de favoritos" });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


export default router;