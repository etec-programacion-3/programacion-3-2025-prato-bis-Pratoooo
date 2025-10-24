import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDB() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cerros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      altura INTEGER,
      provincia TEXT,
      descripcion TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  console.log("✅ Base de datos inicializada correctamente");
  return db;
}
