# 🏔️ CerroMap

**Tu campamento base digital para explorar, planificar y compartir aventuras en las montañas de Argentina.**

CerroMap es una aplicación web fullstack que permite a los usuarios descubrir senderos, guardar favoritos, cargar nuevos cerros y visualizarlos en un mapa interactivo.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## ✨ Características

- 🗺️ **Mapa Interactivo** con marcadores de cerros (Leaflet)
- 📋 **Lista de Senderos** con filtros y búsqueda
- ❤️ **Sistema de Favoritos** (requiere autenticación)
- ➕ **Cargar Cerros** propios con imágenes
- ✏️ **Editar/Eliminar** solo tus propios cerros
- 🔐 **Autenticación JWT** (registro e inicio de sesión)
- 📱 **Diseño Responsive** (mobile-first)
- 💎 **Planes Premium** (próximamente)

---

## 🛠️ Tecnologías

### Frontend
- **React 19** + **Vite**
- **React Router DOM** (navegación)
- **Axios** (peticiones HTTP)
- **Leaflet** + **React-Leaflet** (mapas)
- **CSS inline** (estilos)

### Backend
- **Node.js** + **Express**
- **SQLite3** (base de datos)
- **JWT** (autenticación)
- **bcrypt** (hash de contraseñas)
- **CORS** (comunicación frontend-backend)

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** v20 o superior
- **npm** o **yarn**

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/CerroMap.git
cd CerroMap
```

### 2️⃣ Instalar dependencias del Backend
```bash
cd Backend
npm install
```

### 3️⃣ Instalar dependencias del Frontend
```bash
cd ../Frontend
npm install
```

---

## ⚙️ Configuración

### Backend

1. **Crea el archivo `.env`** en la carpeta `Backend/`:
```bash
cd Backend
cp .env.example .env
```

2. **Edita `.env`** y configura las variables:
```bash
# Clave secreta para JWT (usa una clave aleatoria y segura)
JWT_SECRET=tu_clave_secreta_super_segura_aqui

# Puerto del servidor (opcional, por defecto 3001)
PORT=3001
```

> ⚠️ **Importante:** Nunca subas el archivo `.env` a Git. Usa claves diferentes en producción.

3. **Inicia el servidor backend**:
```bash
npm run dev
# o
node server.js
```

El backend estará disponible en `http://localhost:3001`

---

### Frontend

1. **Inicia el servidor de desarrollo**:
```bash
cd Frontend
npm run dev
```

2. **Abre tu navegador** en la URL que aparece (generalmente `http://localhost:5173`)

---

## 📖 Uso

### Como Usuario

1. **Explora** la lista de senderos sin necesidad de registro
2. **Visualiza** los cerros en el mapa interactivo
3. **Regístrate** para acceder a funciones premium:
   - ❤️ Guardar cerros favoritos
   - ➕ Cargar nuevos cerros
   - ✏️ Editar tus propios cerros
   - 🗑️ Eliminar tus cerros

### Como Desarrollador

#### Ejecutar ambos servidores simultáneamente

**Terminal 1 (Backend):**
```bash
cd Backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd Frontend
npm run dev
```

---

## 📁 Estructura del Proyecto
```
CerroMap/
├── Backend/
│   ├── database/
│   │   └── db.js              # Configuración de SQLite
│   ├── middleware/
│   │   └── authMiddleware.js  # Verificación JWT
│   ├── routes/
│   │   ├── authRoutes.js      # Login/Registro
│   │   ├── cerrosRoutes.js    # CRUD de cerros
│   │   └── favoritesRoutes.js # Sistema de favoritos
│   ├── .env.example           # Plantilla de configuración
│   ├── .gitignore
│   ├── server.js              # Punto de entrada
│   └── package.json
│
└── Frontend/
    ├── public/
    │   └── logo.jpg           # Logo de la app
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── CerrosList.jsx
    │   │   ├── DetalleCerro.jsx
    │   │   ├── MapaCerros.jsx
    │   │   ├── Favoritos.jsx
    │   │   ├── CargarCerro.jsx
    │   │   ├── MisCerros.jsx
    │   │   ├── EditarCerro.jsx
    │   │   ├── AuthModal.jsx
    │   │   └── PremiumPage.jsx
    │   ├── App.jsx             # Componente principal
    │   ├── main.jsx            # Punto de entrada
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |

### Cerros

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/cerros` | Obtener todos los cerros | No |
| GET | `/cerros/:id` | Obtener un cerro por ID | No |
| GET | `/cerros/mis-cerros` | Obtener cerros del usuario logueado | Sí |
| POST | `/cerros` | Crear un nuevo cerro | Sí |
| PUT | `/cerros/:id` | Actualizar un cerro propio | Sí |
| DELETE | `/cerros/:id` | Eliminar un cerro propio | Sí |

### Favoritos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/favorites` | Obtener favoritos del usuario | Sí |
| POST | `/favorites/:cerroId` | Añadir cerro a favoritos | Sí |
| DELETE | `/favorites/:cerroId` | Quitar cerro de favoritos | Sí |

**Headers de autenticación:**
```
Authorization: Bearer <tu_token_jwt>
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Haz un **fork** del proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Haz **push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

---

## 📝 Próximas Funcionalidades

- [ ] Búsqueda y filtros avanzados
- [ ] Sistema de reseñas y valoraciones
- [ ] Mapas offline (Premium)
- [ ] Integración con API de clima
- [ ] Compartir rutas en redes sociales
- [ ] Aplicación móvil nativa (KMP)

---

## 👥 Autores

- **Pablo Prato** - [GitHub](https://github.com/Pratoooo)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 📞 Contacto

¿Preguntas o sugerencias?

- 📧 Email: info@cerromap.com
- 📷 Instagram: [@cerromap](https://instagram.com/cerromap)
- 🐦 Twitter: [@cerromap](https://twitter.com/cerromap)

---

## 🙏 Agradecimientos

- Datos de cerros proporcionados por la comunidad de montañistas argentinos
- Imágenes de [Unsplash](https://unsplash.com)
- Tiles de mapa de [OpenStreetMap](https://www.openstreetmap.org) y [Esri](https://www.esri.com)

---

**¡Felices aventuras! 🏔️⛰️🥾**