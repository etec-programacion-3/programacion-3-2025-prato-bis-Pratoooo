import express from "express";

const router = express.Router();

const cerros = [
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

router.get("/", (req, res) => {
  res.json(cerros);
});

export default router;