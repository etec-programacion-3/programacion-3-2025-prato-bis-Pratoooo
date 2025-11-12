import express from "express";
import cors from "cors"; 

// --- 👇 LÍNEA 5 CORREGIDA ---
import { initDB } from "./database/db.js"; // Apunta a la carpeta 'database'

// Importa tus rutas
import authRoutes from "./routes/authRoutes.js";
// --- 👇 LÍNEA 9 CORREGIDA (CON 'S') ---
import cerroRoutes from "./routes/cerrosRoutes.js"; // El archivo se llama 'cerrosRoutes' (plural)
import favoritesRoutes from "./routes/favoritesRoutes.js";

const app = express();
const port = 3001;

// --- Configuración de Middlewares ---
app.use(cors());
app.use(express.json());
// --- Fin Configuración de Middlewares ---


// Función principal para iniciar todo
async function startServer() {
  try {
    // 1. Inicializa la base de datos
    const db = await initDB();

    // 2. Hacemos la base de datos accesible para TODAS las rutas
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // 3. Carga las rutas de la API
    app.use("/auth", authRoutes);
    app.use("/cerros", cerroRoutes);
    app.use("/favorites", favoritesRoutes);

    // Ruta de bienvenida
    app.get("/", (req, res) => {
      res.send("¡API de CerroMap funcionando!");
    });

    // 4. Inicia el servidor
    app.listen(port, () => {
      console.log(`✅ Servidor backend iniciado en http://localhost:${port}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

// Llama a la función principal
startServer();