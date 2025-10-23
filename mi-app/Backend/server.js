import express from "express";
import cors from "cors";
import cerrosRoutes from "./routes/cerrosRoutes.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("✅ Petición recibida en /");
  res.send("Backend funcionando!");
});

// Usar las rutas de cerros
app.use("/cerros", cerrosRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});