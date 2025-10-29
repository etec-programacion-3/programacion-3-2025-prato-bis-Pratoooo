// mi-app/src/components/CerrosList.jsx (REEMPLAZAR CON ESTO)

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CerrosList = () => {
  const [cerros, setCerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- 👇 LÓGICA DE COLUMNAS SIMPLIFICADA ---
  // 1 columna si es < 768px, 2 columnas si es >= 768px
  const [columns, setColumns] = useState(window.innerWidth < 768 ? 1 : 2); 

  // Datos de respaldo (sin cambios)
  const cerrosRespaldo = [
    {
      id: 1,
      nombre: "Aconcagua",
      altura: 6960,
      provincia: "Mendoza",
      descripcion: "El pico más alto de América...",
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    },
    // ... (el resto de tus datos)
  ];

  // Manejar resize (ACTUALIZADO CON LA NUEVA LÓGICA)
  useEffect(() => {
    const handleResize = () => {
      setColumns(window.innerWidth < 768 ? 1 : 2); // Actualiza con 1 o 2 columnas
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar cerros (sin cambios)
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3001/cerros")
      .then(response => {
        // ... (lógica de carga sin cambios)
        if (response.data.length > 0 && !response.data[0].imagen) {
          setCerros(cerrosRespaldo);
        } else {
          setCerros(response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        // ... (lógica de error sin cambios)
        setCerros(cerrosRespaldo);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ 
      padding: "60px", 
      textAlign: "center",
      fontSize: "1.5em" 
    }}>
      ⏳ Cargando cerros de Mendoza...
    </div>
  );

return (
  // Div externo (sin cambios)
  <div style={{ 
    paddingTop: columns === 1 ? "30px" : "40px",
    paddingBottom: columns === 1 ? "15px" : "20px",
    paddingLeft: columns === 1 ? "15px" : "20px",
    paddingRight: columns === 1 ? "15px" : "20px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#f5f5f5", 
    minHeight: "calc(100vh - 70px)"
  }}>
    
    {/* Div interno (sin cambios, ya tiene margin: 0 auto) */}
    <div style={{
      maxWidth: "1400px", 
      margin: "0 auto",
      width: "100%"
    }}>

      {/* Header (sin cambios) */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: columns === 1 ? "30px" : "50px",
        padding: columns === 1 ? "20px" : "30px",
        background: "linear-gradient(135deg, #4a5c36 0%, #8b5a2b 100%)", 
        borderRadius: "20px",
        color: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ 
          fontSize: columns === 1 ? "2em" : "3em", // Ajustado para 2 columnas
          margin: "0 0 10px 0",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          🏔️ Cerros de Mendoza
        </h1>
        <p style={{ 
          fontSize: columns === 1 ? "1em" : "1.3em",
          margin: "10px 0 0 0",
          opacity: 0.95
        }}>
          Descubre las montañas más impresionantes de Argentina
        </p>
        <p style={{
          fontSize: columns === 1 ? "0.9em" : "1em",
          marginTop: "15px",
          opacity: 0.85
        }}>
          📊 Total de cerros: {cerros.length} | 📏 Altura promedio: {Math.round(cerros.reduce((sum, c) => sum + c.altura, 0) / cerros.length).toLocaleString()}m
        </p>
      </div>
      
      {/* --- 👇 GRID DE CERROS (COLUMNAS MODIFICADAS) --- */}
      <div style={{
        display: "grid",
        // Usamos el estado 'columns' que ahora es 1 o 2
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        gap: columns === 1 ? "20px" : "30px",
        marginTop: "20px"
      }}>
        {/* --- 👆 FIN DE GRID MODIFICADO --- */}

        {/* Mapeo de cerros (sin cambios) */}
        {cerros.map(cerro => (
          <Link
            key={cerro.id}
            to={`/cerro/${cerro.id}`}
            style={{
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <div style={{ /* ... (estilos de tarjeta sin cambios) */
              border: "none",
              borderRadius: "20px",
              overflow: "hidden",
              background: "white",
              boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              height: "100%",
              display: "flex",
              flexDirection: "column"
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
              {/* Imagen (sin cambios) */}
              <div style={{ 
                position: "relative",
                overflow: "hidden",
                height: columns === 1 ? "200px" : "280px"
              }}>
                <img src={cerro.imagen} alt={cerro.nombre} style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    transition: "transform 0.3s ease"
                  }}/>
                <div style={{ /* ... (badge de altura sin cambios) */
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "rgba(255,255,255,0.95)",
                  padding: columns === 1 ? "6px 12px" : "8px 15px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  color: "#667eea", 
                  fontSize: columns === 1 ? "0.8em" : "0.9em",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                }}>
                  📏 {cerro.altura.toLocaleString()}m
                </div>
              </div>
              
              {/* Contenido (sin cambios) */}
              <div style={{ 
                padding: columns === 1 ? "20px" : "25px",
                flex: 1,
                display: "flex",
                flexDirection: "column"
              }}>
                <h2 style={{ 
                  margin: "0 0 15px 0", 
                  color: "#2c3e50",
                  fontSize: columns === 1 ? "1.4em" : "1.8em",
                  fontWeight: "600"
                }}>
                  {cerro.nombre}
                </h2>
                
                <div style={{ /* ... */ }}>
                  <span style={{ fontSize: "1.2em" }}>📍</span>
                  <span style={{ 
                    fontSize: columns === 1 ? "0.9em" : "1em",
                    color: "#555",
                    fontWeight: "500"
                  }}>
                    {cerro.provincia}
                  </span>
                </div>
                
                <p style={{ /* ... */ }}>
                  {cerro.descripcion}
                </p>

                <div style={{
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "1px solid #eee",
                  color: "#8b5a2b", 
                  fontWeight: "bold",
                  fontSize: columns === 1 ? "0.9em" : "1em"
                }}>
                  Ver más →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);
};

export default CerrosList;