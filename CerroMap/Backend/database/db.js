import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDB() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  // Create 'cerros' table (your code)
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

  // Create 'users' table (your code, added email)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL, 
      email TEXT UNIQUE NOT NULL,    
      password TEXT NOT NULL
    )
  `);

  // --- 👇 NUEVA TABLA AÑADIDA ---
  // Create 'user_favorites' table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_favorites (
      user_id INTEGER NOT NULL,
      cerro_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, cerro_id), 
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, 
      FOREIGN KEY (cerro_id) REFERENCES cerros (id) ON DELETE CASCADE
    )
  `);
  // --- 👆 FIN NUEVA TABLA ---

  console.log("✅ Base de datos inicializada correctamente (con tabla de favoritos)");
  return db;
}