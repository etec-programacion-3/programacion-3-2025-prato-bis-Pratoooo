import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("✅ Petición recibida en /");
  res.send("Backend funcionando!");
});

app.get("/cerros", (req, res) => {
  console.log("✅ Petición recibida en /cerros");
  res.json([
    { id: 1, nombre: "Aconcagua", altura: 6960 },
    { id: 2, nombre: "Tupungato", altura: 6570 }
  ]);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});