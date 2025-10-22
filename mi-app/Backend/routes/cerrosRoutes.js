import express from "express";

const router = express.Router();

// Datos completos de cerros de Mendoza
const cerros = [
  {
    id: 1,
    nombre: "Aconcagua",
    altura: 6960,
    provincia: "Mendoza",
    descripcion: "El pico más alto de América y del hemisferio sur. Conocido como el 'Coloso de América', atrae a montañistas de todo el mundo. Su ascenso requiere aclimatación y experiencia en alta montaña.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Aconcagua2016.jpg/1200px-Aconcagua2016.jpg"
  },
  {
    id: 2,
    nombre: "Tupungato",
    altura: 6570,
    provincia: "Mendoza",
    descripcion: "Estratovolcán ubicado en la frontera entre Argentina y Chile. Su nombre proviene del quechua 'Tupun Gato' que significa 'mirador de las estrellas'. Es el segundo pico más alto de Mendoza.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tupungato.jpg/1200px-Tupungato.jpg"
  },
  {
    id: 3,
    nombre: "Cerro El Plata",
    altura: 5968,
    provincia: "Mendoza",
    descripcion: "Ubicado en el Cordón del Plata, es muy popular para ascensos de entrenamiento. Ofrece vistas espectaculares del Valle de Uco y es accesible durante gran parte del año.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cordon_del_Plata.jpg/1200px-Cordon_del_Plata.jpg"
  },
  {
    id: 4,
    nombre: "Cerro Mercedario",
    altura: 6720,
    provincia: "San Juan",
    descripcion: "El pico más alto de San Juan y el cuarto de los Andes argentinos. Su ascenso técnico lo hace menos frecuentado que el Aconcagua, pero igualmente desafiante y hermoso.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Cerro_Mercedario.jpg/1200px-Cerro_Mercedario.jpg"
  },
  {
    id: 5,
    nombre: "Volcán Maipo",
    altura: 5264,
    provincia: "Mendoza",
    descripcion: "Volcán activo en la frontera argentino-chilena. Su última erupción fue en 1826. Es muy popular entre montañistas por su accesibilidad y belleza escénica.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Volcan_Maipo.jpg/1200px-Volcan_Maipo.jpg"
  },
  {
    id: 6,
    nombre: "Cerro Tolosa",
    altura: 5432,
    provincia: "Mendoza",
    descripcion: "Parte del Cordón del Plata, es un cerro técnico que requiere experiencia en escalada en roca. Ofrece rutas desafiantes y vistas panorámicas increíbles.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Cordillera_de_los_Andes.jpg/1200px-Cordillera_de_los_Andes.jpg"
  },
  {
    id: 7,
    nombre: "Cerro Bonete",
    altura: 6759,
    provincia: "La Rioja",
    descripcion: "Uno de los picos más altos de La Rioja y tercer volcán más alto del mundo. Su ubicación remota lo hace poco visitado, conservando su belleza prístina.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Andes_Mountains.jpg/1200px-Andes_Mountains.jpg"
  },
  {
    id: 8,
    nombre: "Cerro de la Ramada",
    altura: 6410,
    provincia: "Mendoza/San Juan",
    descripcion: "Ubicado en el límite entre Mendoza y San Juan. Su ascenso combina glaciares y roca, ofreciendo un desafío técnico considerable para montañistas experimentados.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Cordillera_Principal.jpg/1200px-Cordillera_Principal.jpg"
  }
];

// Ruta para obtener todos los cerros
router.get("/", (req, res) => {
  res.json(cerros);
});

export default router;