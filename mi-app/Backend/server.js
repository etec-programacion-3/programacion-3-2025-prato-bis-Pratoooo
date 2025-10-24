import express from "express";
import cors from "cors";
import cerrosRoutes from "./routes/cerrosRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { initDB } from "./database/db.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Inicializar base de datos
let db;
initDB().then(database => {
  db = database;
  
  // Middleware para pasar db a las rutas
  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  // Rutas principales
  app.get("/", (req, res) => {
    res.send("✅ Backend funcionando!");
  });

  app.use("/cerros", cerrosRoutes);
  app.use("/auth", authRoutes);

  // Iniciar servidor después de inicializar DB
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });
});
