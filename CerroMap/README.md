# 🏔️ CerroMap

**CerroMap** es una aplicación web full-stack que permite a los usuarios explorar, guardar como favoritos y administrar una base de datos de cerros y senderos.

Este proyecto fue desarrollado para la materia Programación 3.

## Arquitectura

* **Frontend:** React (Vite)
* **Backend:** Node.js (Express)
* **Base de Datos:** SQLite

---

## 🚀 Ejecución del Proyecto

Siga estas instrucciones para levantar el entorno de desarrollo completo.

### 1. Base de Datos (SQLite)

No se requiere ninguna acción manual. La base de datos (`database.sqlite`) será **creada y poblada automáticamente** por el backend la primera vez que se inicie.

Si necesita reiniciar la base de datos, simplemente detenga el backend, elimine el archivo `database.sqlite` de la carpeta `Backend/` y vuelva a iniciar el backend.

### 2. Backend (API)

**Instalación (solo la primera vez):**
```bash
# 1. Navegar a la carpeta del backend
cd CerroMap/Backend

# 2. Instalar dependencias
npm install