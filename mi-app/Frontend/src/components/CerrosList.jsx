import { useEffect, useState } from "react";
import axios from "axios";

const CerrosList = () => {
  const [cerros, setCerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos de respaldo en caso de que el backend no funcione
  const cerrosRespaldo = [
    {
      id: 1,
      nombre: "Aconcagua",
      altura: 6960,
      provincia: "Mendoza",
      descripcion: "El pico más alto de América y del hemisferio sur. Conocido como el 'Coloso de América', atrae a montañistas de todo el mundo.",
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Aconcagua2016.jpg/1200px-Aconcagua2016.jpg"
    },
    {
      id: 2,
      nombre: "Tupungato",
      altura: 6570,
      provincia: "Mendoza",
      descripcion: "Estratovolcán ubicado en la frontera entre Argentina y Chile. Su nombre significa 'mirador de las estrellas'.",
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tupungato.jpg/1200px-Tupungato.jpg"
    },
    {
      id: 3,
      nombre: "Cerro El Plata",
      altura: 5968,
      provincia: "Mendoza",
      descripcion: "Ubicado en el Cordón del Plata, muy popular para ascensos de entrenamiento y accesible durante gran parte del año.",
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cordon_del_Plata.jpg/1200px-Cordon_del_Plata.jpg"
    },
    {
      id: 4,
      nombre: "Cerro Mercedario",
      altura: 6720,
      provincia: "San Juan",
      descripcion: "El pico más alto de San Juan y el cuarto de los Andes argentinos. Menos frecuentado que el Aconcagua pero igualmente hermoso.",
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Cerro_Mercedario.jpg/1200px-Cerro_Mercedario.jpg"
    },
    {
      id: 5,
      nombre: "Volcán Maipo",
      altura: 5264,
      provincia: "Mendoza",
      descripcion: "Volcán activo en la frontera argentino-chilena. Su última erupción fue en 1826. Popular por su accesibilidad.",
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Volcan_Maipo.jpg/1200px-Volcan_Maipo.jpg"
    },
    {
      id: 6,
      nombre: "Cerro Tolosa",
      altura: 5432,
      provincia: "Mendoza",
      descripcion: "Parte del Cordón del Plata, cerro técnico que requiere experiencia en escalada con vistas panorámicas increíbles.",
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Cordillera_de_los_Andes.jpg/1200px-Cordillera_de_los_Andes.jpg"
    },
    {
      id: 7,
      nombre: "Cerro Bonete",
      altura: 6759,
      provincia: "La Rioja",
      descripcion: "Uno de los picos más altos de La Rioja. Su ubicación remota conserva su belleza prístina.",
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Andes_Mountains.jpg/1200px-Andes_Mountains.jpg"
    },
    {
      id: 8,
      nombre: "Cerro de la Ramada",
      altura: 6410,
      provincia: "Mendoza/San Juan",
      descripcion: "En el límite entre Mendoza y San Juan. Su ascenso combina glaciares y roca.",
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Cordillera_Principal.jpg/1200px-Cordillera_Principal.jpg"
    }
  ];

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3001/cerros")
      .then(response => {
        console.log("✅ Datos recibidos del backend:", response.data);
        // Si el backend no devuelve las propiedades necesarias, usar datos de respaldo
        if (response.data.length > 0 && !response.data[0].imagen) {
          console.warn("⚠️ Backend no devuelve datos completos, usando datos de respaldo");
          setCerros(cerrosRespaldo);
        } else {
          setCerros(response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Error al obtener los cerros, usando datos de respaldo:", error);
        setCerros(cerrosRespaldo);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ 
      padding: "20px", 
      textAlign: "center",
      fontSize: "1.5em" 
    }}>
      ⏳ Cargando cerros de Mendoza...
    </div>
  );

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1400px", 
      margin: "0 auto",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "50px",
        padding: "30px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "20px",
        color: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ 
          fontSize: "3.5em", 
          margin: "0 0 10px 0",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          🏔️ Cerros de Mendoza
        </h1>
        <p style={{ 
          fontSize: "1.3em", 
          margin: "10px 0 0 0",
          opacity: 0.95
        }}>
          Descubre los senderos más impresionantes de Mendoza
        </p>
        <p style={{
          fontSize: "1em",
          marginTop: "15px",
          opacity: 0.85
        }}>
          📊 Total de cerros: {cerros.length} | 📏 Altura promedio: {Math.round(cerros.reduce((sum, c) => sum + c.altura, 0) / cerros.length).toLocaleString()}m
        </p>
      </div>
      
      {/* Grid de cerros */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "30px",
        marginTop: "20px"
      }}>
        {cerros.map(cerro => (
          <div key={cerro.id} style={{
            border: "none",
            borderRadius: "20px",
            overflow: "hidden",
            background: "white",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
          }}
          >
            {/* Imagen */}
            <div style={{ 
              position: "relative",
              overflow: "hidden",
              height: "280px"
            }}>
              <img
                src={cerro.imagen}
                alt={cerro.nombre}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              />
              {/* Badge de altura */}
              <div style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "rgba(255,255,255,0.95)",
                padding: "8px 15px",
                borderRadius: "20px",
                fontWeight: "bold",
                color: "#667eea",
                fontSize: "0.9em",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
              }}>
                📏 {cerro.altura.toLocaleString()}m
              </div>
            </div>
            
            {/* Contenido */}
            <div style={{ padding: "25px" }}>
              <h2 style={{ 
                margin: "0 0 15px 0", 
                color: "#2c3e50",
                fontSize: "1.8em",
                fontWeight: "600"
              }}>
                {cerro.nombre}
              </h2>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
                padding: "10px",
                background: "#f8f9fa",
                borderRadius: "10px"
              }}>
                <span style={{ fontSize: "1.2em" }}>📍</span>
                <span style={{ 
                  fontSize: "1em", 
                  color: "#555",
                  fontWeight: "500"
                }}>
                  {cerro.provincia}
                </span>
              </div>
              
              <p style={{ 
                fontSize: "0.95em", 
                color: "#666",
                lineHeight: "1.7",
                margin: "0"
              }}>
                {cerro.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CerrosList;