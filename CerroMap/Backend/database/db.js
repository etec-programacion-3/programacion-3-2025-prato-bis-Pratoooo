import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Esta es tu lista de cerros que estaba en cerroRoutes.js
const cerrosData = [
  {
    id: 1,
    nombre: "Aconcagua",
    altura: 6960,
    provincia: "Mendoza",
    descripcion: "El pico más alto de América y del hemisferio sur. Conocido como el 'Coloso de América', atrae a montañistas de todo el mundo.",
    imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
  },
  {
    id: 2,
    nombre: "Tupungato",
    altura: 6570,
    provincia: "Mendoza",
    descripcion: "Estratovolcán ubicado en la frontera entre Argentina y Chile. Su nombre significa 'mirador de las estrellas'.",
    imagen: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
  },
  {
    id: 3,
    nombre: "Cerro El Plata",
    altura: 5968,
    provincia: "Mendoza",
    descripcion: "Ubicado en el Cordón del Plata, muy popular para ascensos de entrenamiento.",
    imagen: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80"
  },
  {
    id: 4,
    nombre: "Cerro Mercedario",
    altura: 6720,
    provincia: "San Juan",
    descripcion: "El pico más alto de San Juan y el cuarto de los Andes argentinos.",
    imagen: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80"
  },
  {
    id: 5,
    nombre: "Volcán Maipo",
    altura: 5264,
    provincia: "Mendoza",
    descripcion: "Volcán activo en la frontera argentino-chilena. Su última erupción fue en 1826.",
    imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
  },
  {
    id: 6,
    nombre: "Cerro Tolosa",
    altura: 5432,
    provincia: "Mendoza",
    descripcion: "Parte del Cordón del Plata, cerro técnico que requiere experiencia en escalada.",
    imagen: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80"
  },
  {
    id: 7,
    nombre: "Cerro Bonete",
    altura: 6759,
    provincia: "La Rioja",
    descripcion: "Uno de los picos más altos de La Rioja y tercer volcán más alto del mundo.",
    imagen: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&q=80"
  },
  {
    id: 8,
    nombre: "Cerro de la Ramada",
    altura: 6410,
    provincia: "Mendoza/San Juan",
    descripcion: "En el límite entre Mendoza y San Juan. Su ascenso combina glaciares y roca.",
    imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
  }
];


export async function initDB() {
  const db = await open({
    filename: "./database.sqlite", // El nombre de tu archivo de base de datos
    driver: sqlite3.Database,
  });

  // --- 1. CREAR TABLAS (Si no existen) ---
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cerros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      altura INTEGER,
      provincia TEXT,
      descripcion TEXT,
      imagen TEXT 
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
  // Contamos cuántos cerros hay
  const count = await db.get("SELECT COUNT(*) as count FROM cerros");
  
  // Si no hay cerros (count es 0), los insertamos
  if (count.count === 0) {
    console.log("Base de datos de 'cerros' vacía. Poblando datos iniciales...");
    
    // Preparamos la consulta de inserción
    const stmt = await db.prepare(
      "INSERT INTO cerros (id, nombre, altura, provincia, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?)"
    );
    
    // Insertamos cada cerro del array
    for (const cerro of cerrosData) {
      // Usamos los IDs del array (para que coincidan con 1, 2, 3...)
      await stmt.run(
        cerro.id, 
        cerro.nombre, 
        cerro.altura, 
        cerro.provincia, 
        cerro.descripcion, 
        cerro.imagen
      );
    }
    await stmt.finalize();
    console.log("✅ Datos de cerros insertados correctamente.");
  } else {
    console.log("La base de datos de 'cerros' ya tiene datos. No se necesita poblar.");
  }

  console.log("✅ Base de datos inicializada correctamente.");
  return db;
}