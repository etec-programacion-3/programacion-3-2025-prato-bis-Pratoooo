import express from "express";
import cors from "cors"; 
import 'dotenv/config'; // <-- ¡NUEVO! Carga las variables de .env

import { initDB } from "./database/db.js"; 
import authRoutes from "./routes/authRoutes.js";
import cerroRoutes from "./routes/cerrosRoutes.js"; // <-- CORREGIDO (con 's')
import favoritesRoutes from "./routes/favoritesRoutes.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const db = await initDB();
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use("/auth", authRoutes);
    app.use("/cerros", cerroRoutes);
    app.use("/favorites", favoritesRoutes);

    app.get("/", (req, res) => {
      res.send("¡API de CerroMap funcionando!");
    });

    app.listen(port, () => {
      console.log(`✅ Servidor backend iniciado en http://localhost:${port}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}
startServer();