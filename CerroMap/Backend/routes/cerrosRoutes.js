import express from "express";
import authenticateToken from "../middleware/authMiddleware.js"; // <-- ¡IMPORTANTE!

const router = express.Router();

// --- RUTA GET /cerros ---
// (Esta es pública, no necesita token)
router.get("/", async (req, res) => {
  try {
    const cerrosDesdeDB = await req.db.all("SELECT * FROM cerros ORDER BY id");
    res.json(cerrosDesdeDB);
  } catch (error) {
    console.error("Error al obtener cerros desde la DB:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener cerros" });
  }
});

// --- RUTA GET /cerros/:id ---
// (Esta es pública, no necesita token)
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


// --- RUTA POST /cerros ---
// (AHORA PROTEGIDA: Solo usuarios logueados pueden crear)
router.post("/", authenticateToken, async (req, res) => {
  console.log("[API POST /cerros] Cuerpo de la petición:", req.body);
  const { nombre, altura, provincia, descripcion, imagen } = req.body;

  if (!nombre || !altura) {
    return res.status(400).json({ error: "El 'nombre' y 'altura' son obligatorios" });
  }
  const alturaNum = parseInt(altura, 10);
  if (isNaN(alturaNum)) {
      return res.status(400).json({ error: "La 'altura' debe ser un número" });
  }

  try {
    const sql = `
      INSERT INTO cerros (nombre, altura, provincia, descripcion, imagen) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await req.db.run(
      sql,
      [nombre, alturaNum, provincia || '', descripcion || '', imagen || '']
    );
    const newCerroId = result.lastID;
    const newCerro = await req.db.get("SELECT * FROM cerros WHERE id = ?", [newCerroId]);

    console.log("[API POST /cerros] Nuevo cerro creado:", newCerro);
    res.status(201).json(newCerro);

  } catch (error) {
    console.error("Error al guardar el nuevo cerro:", error);
    res.status(500).json({ error: "Error interno del servidor al guardar el cerro" });
  }
});


// --- 👇 RUTA DELETE /cerros/:id (¡LA NUEVA!) ---
// (PROTEGIDA: Solo usuarios logueados pueden borrar)
router.delete("/:id", authenticateToken, async (req, res) => {
  const cerroId = parseInt(req.params.id, 10);
  console.log(`[API DELETE /cerros/${cerroId}] Petición de borrado recibida.`);

  if (isNaN(cerroId)) {
    return res.status(400).json({ error: "ID de cerro inválido" });
  }

  try {
    // 1. Verificamos si el cerro existe antes de borrar
    const cerro = await req.db.get("SELECT id FROM cerros WHERE id = ?", [cerroId]);
    if (!cerro) {
      return res.status(404).json({ error: "Cerro no encontrado para eliminar" });
    }
    
    // 2. Ejecutamos el borrado
    const result = await req.db.run("DELETE FROM cerros WHERE id = ?", [cerroId]);

    if (result.changes === 0) {
      // No debería pasar si la comprobación anterior funcionó
      return res.status(404).json({ error: "El cerro no fue encontrado" });
    }
    
    // NOTA: Tu tabla 'user_favorites' tiene 'ON DELETE CASCADE', 
    // así que los favoritos se borran automáticamente. ¡Perfecto!

    console.log(`[API DELETE /cerros/${cerroId}] Cerro eliminado exitosamente.`);
    
    // 3. Respondemos al frontend con el ID del cerro borrado
    res.json({ message: "Cerro eliminado", deletedCerroId: cerroId });

  } catch (error) {
    console.error("Error al eliminar el cerro:", error);
    res.status(500).json({ error: "Error interno del servidor al eliminar el cerro" });
  }
});


export default router;