import sqlite3 from "sqlite3";
import { open } from "sqlite";

// --- 👇 LISTA DE CERROS ACTUALIZADA (12 cerros) ---
const cerrosData = [
  { id: 1, nombre: "Aconcagua", altura: 6960, provincia: "Mendoza", descripcion: "El pico más alto de América y del hemisferio sur. El 'Coloso de América'.", imagen: "https://images.unsplash.com/photo-1589182373726-e4b6c6f6d7d2?w=800&q=80" },
  { id: 2, nombre: "Tupungato", altura: 6570, provincia: "Mendoza", descripcion: "Estratovolcán en la frontera con Chile. 'Mirador de las estrellas'.", imagen: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { id: 3, nombre: "Cerro El Plata", altura: 5968, provincia: "Mendoza", descripcion: "Popular para ascensos de entrenamiento en el Cordón del Plata.", imagen: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80" },
  { id: 4, nombre: "Cerro Mercedario", altura: 6720, provincia: "San Juan", descripcion: "El pico más alto de San Juan y el cuarto de los Andes argentinos.", imagen: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80" },
  { id: 5, nombre: "Volcán Maipo", altura: 5264, provincia: "Mendoza", descripcion: "Volcán activo con una caldera espectacular y vista a la laguna.", imagen: "https://images.unsplash.com/photo-1629814238837-7613c5ffd83f?w=800&q=80" },
  { id: 6, nombre: "Cerro Tolosa", altura: 5432, provincia: "Mendoza", descripcion: "Parte del Cordón del Plata, cerro técnico que requiere experiencia.", imagen: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80" },
  { id: 7, nombre: "Cerro Bonete", altura: 6759, provincia: "La Rioja", descripcion: "Uno de los picos más altos de La Rioja y tercer volcán más alto del mundo.", imagen: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&q=80" },
  { id: 8, nombre: "Cerro de la Ramada", altura: 6410, provincia: "San Juan", descripcion: "Impresionante cerro en la Cordillera de la Ramada, San Juan.", imagen: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80" },
  { id: 9, nombre: "Cerro Fitz Roy", altura: 3405, provincia: "Santa Cruz", descripcion: "Icónica montaña de la Patagonia, en el límite con Chile. Un desafío técnico.", imagen: "https://images.unsplash.com/photo-1471306224500-60146c0f06f9?w=800&q=80" },
  { id: 10, nombre: "Cerro Torre", altura: 3128, provincia: "Santa Cruz", descripcion: "Famosa por su aguja de granito y sus condiciones climáticas extremas.", imagen: "https://images.unsplash.com/photo-1508241249607-c19b9f74919b?w=800&q=80" },
  { id: 11, nombre: "Volcán Lanín", altura: 3776, provincia: "Neuquén", descripcion: "Un estratovolcán con una forma cónica perfecta. Símbolo de Neuquén.", imagen: "https://images.unsplash.com/photo-1588339890635-a134c89a7c36?w=800&q=80" },
  { id: 12, nombre: "Monte Pissis", altura: 6795, provincia: "Catamarca", descripcion: "Volcán inactivo y el segundo pico más alto de los Andes, en la Puna.", imagen: "https://images.unsplash.com/photo-1551636821-f2038933b49e?w=800&q=80" }
];
// --- 👆 FIN DE LA LISTA ---

export async function initDB() {
  const db = await open({
    filename: "./database.sqlite", // El archivo se creará FUERA de la carpeta 'database'
    driver: sqlite3.Database,
  });

  // --- 1. CREAR TABLAS (con 'creado_por_id') ---
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cerros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      altura INTEGER NOT NULL,
      provincia TEXT,
      descripcion TEXT,
      imagen TEXT,
      creado_por_id INTEGER, 
      FOREIGN KEY (creado_por_id) REFERENCES users (id) ON DELETE SET NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL, 
      email TEXT UNIQUE NOT NULL,    
      password TEXT NOT NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_favorites (
      user_id INTEGER NOT NULL,
      cerro_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, cerro_id), 
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, 
      FOREIGN KEY (cerro_id) REFERENCES cerros (id) ON DELETE CASCADE
    )
  `);

  // --- 2. SEEDER (POBLAR DATOS) ---
  const count = await db.get("SELECT COUNT(id) as count FROM cerros");
  if (count.count === 0) {
    console.log("Base de datos vacía, poblando con 12 cerros iniciales...");
    const stmt = await db.prepare(
      "INSERT INTO cerros (id, nombre, altura, provincia, descripcion, imagen, creado_por_id) VALUES (?, ?, ?, ?, ?, ?, NULL)"
    );
    for (const cerro of cerrosData) {
      await stmt.run(cerro.id, cerro.nombre, cerro.altura, cerro.provincia, cerro.descripcion, cerro.imagen);
    }
    await stmt.finalize();
    console.log("Datos iniciales de cerros cargados.");
  }

  console.log("✅ Base de datos inicializada correctamente.");
  return db;
}