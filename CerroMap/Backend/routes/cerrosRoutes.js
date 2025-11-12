import express from "express";
import authenticateToken from "../middleware/authMiddleware.js"; 

const router = express.Router();

// --- RUTA GET /cerros (Pública) ---
router.get("/", async (req, res) => {
  try {
    const cerrosDesdeDB = await req.db.all("SELECT * FROM cerros ORDER BY id");
    res.json(cerrosDesdeDB);
  } catch (error) {
    console.error("Error al obtener cerros:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- RUTA GET /cerros/mis-cerros (NUEVA RUTA PROTEGIDA) ---
// Obtiene solo los cerros creados por el usuario logueado
router.get("/mis-cerros", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const misCerros = await req.db.all(
      "SELECT * FROM cerros WHERE creado_por_id = ? ORDER BY id",
      [userId]
    );
    res.json(misCerros);
  } catch (error) {
    console.error("Error al obtener 'mis cerros':", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- RUTA GET /cerros/:id (Pública) ---
router.get("/:id", async (req, res) => {
  try {
    const cerro = await req.db.get("SELECT * FROM cerros WHERE id = ?", [req.params.id]);
    if (cerro) {
      res.json(cerro);
    } else {
      res.status(404).json({ error: "Cerro no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener cerro por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// --- RUTA POST /cerros (Protegida - MODIFICADA) ---
router.post("/", authenticateToken, async (req, res) => {
  const { nombre, altura, provincia, descripcion, imagen } = req.body;
  const userId = req.user.id; // <-- Obtenemos el ID del usuario logueado

  if (!nombre || !altura) {
    return res.status(400).json({ error: "El 'nombre' y 'altura' son obligatorios" });
  }
  const alturaNum = parseInt(altura, 10);
  if (isNaN(alturaNum)) {
      return res.status(400).json({ error: "La 'altura' debe ser un número" });
  }

  try {
    // --- 👇 CAMBIO AQUÍ: Añadimos creado_por_id ---
    const sql = `
      INSERT INTO cerros (nombre, altura, provincia, descripcion, imagen, creado_por_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await req.db.run(
      sql,
      [nombre, alturaNum, provincia || '', descripcion || '', imagen || '', userId] // <-- Pasamos el userId
    );
    // --- 👆 FIN DEL CAMBIO ---

    const newCerroId = result.lastID;
    const newCerro = await req.db.get("SELECT * FROM cerros WHERE id = ?", [newCerroId]);
    res.status(201).json(newCerro);
  } catch (error) {
    console.error("Error al guardar el nuevo cerro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- RUTA PUT /cerros/:id (NUEVA RUTA PROTEGIDA) ---
// (Modificar / Actualizar un cerro)
router.put("/:id", authenticateToken, async (req, res) => {
  const cerroId = parseInt(req.params.id, 10);
  const userId = req.user.id;
  const { nombre, altura, provincia, descripcion, imagen } = req.body;
  
  if (isNaN(cerroId)) {
    return res.status(400).json({ error: "ID de cerro inválido" });
  }
  if (!nombre || !altura) {
    return res.status(400).json({ error: "El 'nombre' y 'altura' son obligatorios" });
  }
  const alturaNum = parseInt(altura, 10);
  if (isNaN(alturaNum)) {
      return res.status(400).json({ error: "La 'altura' debe ser un número" });
  }

  try {
    // 1. Verificamos que el cerro exista Y que pertenezca al usuario
    const cerro = await req.db.get(
      "SELECT id, creado_por_id FROM cerros WHERE id = ?", 
      [cerroId]
    );

    if (!cerro) {
      return res.status(404).json({ error: "Cerro no encontrado" });
    }
    
    // (Opcional: Si quieres que los admin puedan editar, aquí iría esa lógica)
    if (cerro.creado_por_id !== userId) {
      return res.status(403).json({ error: "Acción no permitida. No eres el creador de este cerro." });
    }

    // 2. Si todo está bien, actualizamos
    const sql = `
      UPDATE cerros SET
        nombre = ?,
        altura = ?,
        provincia = ?,
        descripcion = ?,
        imagen = ?
      WHERE id = ? AND creado_por_id = ? 
    `;
    await req.db.run(sql, [nombre, alturaNum, provincia, descripcion, imagen, cerroId, userId]);

    // 3. Devolvemos el cerro actualizado
    const cerroActualizado = await req.db.get("SELECT * FROM cerros WHERE id = ?", [cerroId]);
    res.json(cerroActualizado);

  } catch (error) {
    console.error("Error al actualizar el cerro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// --- RUTA DELETE /cerros/:id (Protegida - MODIFICADA) ---
router.delete("/:id", authenticateToken, async (req, res) => {
  const cerroId = parseInt(req.params.id, 10);
  const userId = req.user.id; // <-- Obtenemos el ID del usuario
  
  if (isNaN(cerroId)) {
    return res.status(400).json({ error: "ID de cerro inválido" });
  }

  try {
    // --- 👇 CAMBIO AQUÍ: Añadimos 'creado_por_id = ?' ---
    // Ahora solo borra si el ID del cerro Y el ID del creador coinciden
    const result = await req.db.run(
      "DELETE FROM cerros WHERE id = ? AND creado_por_id = ?", 
      [cerroId, userId]
    );
    // --- 👆 FIN DEL CAMBIO ---

    if (result.changes === 0) {
      // Esto puede pasar por 2 razones:
      // 1. El cerro no existe (404)
      // 2. El cerro existe PERO no te pertenece (403 - Prohibido)
      const cerro = await req.db.get("SELECT id FROM cerros WHERE id = ?", [cerroId]);
      if (cerro) {
        // El cerro existe, pero no es tuyo
        return res.status(403).json({ error: "Acción no permitida. No puedes borrar un cerro que no creaste." });
      } else {
        // El cerro no existe
        return res.status(404).json({ error: "Cerro no encontrado" });
      }
    }
    
    // Si llegamos aquí, se borró exitosamente
    console.log(`[API DELETE /cerros/${cerroId}] Cerro eliminado por usuario ${userId}.`);
    res.json({ message: "Cerro eliminado", deletedCerroId: cerroId });

  } catch (error) {
    console.error("Error al eliminar el cerro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


export default router;