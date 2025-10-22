import { useEffect, useState } from "react";
import axios from "axios";

const CerrosList = () => {
  const [cerros, setCerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3001/cerros")
      .then(response => {
        console.log("✅ Datos recibidos:", response.data);
        setCerros(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Error al obtener los cerros:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>⏳ Cargando cerros...</div>;
  if (error) return <div style={{ padding: "20px", color: "red", textAlign: "center" }}>❌ Error: {error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "3em", margin: "10px 0" }}>🏔️ Cerros de Mendoza</h1>
        <p style={{ fontSize: "1.2em", color: "#666" }}>Descubre las montañas más impresionantes de Argentina</p>
      </div>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "30px",
        marginTop: "20px"
      }}>
        {cerros.map(cerro => (
          <div key={cerro.id} style={{
            border: "1px solid #ddd",
            borderRadius: "15px",
            overflow: "hidden",
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "transform 0.3s",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <img
              src={cerro.imagen}
              alt={cerro.nombre}
              style={{ 
                width: "100%", 
                height: "250px", 
                objectFit: "cover" 
              }}
            />
            <div style={{ padding: "20px" }}>
              <h2 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>{cerro.nombre}</h2>
              <p style={{ 
                fontSize: "1.1em", 
                fontWeight: "bold", 
                color: "#3498db",
                margin: "10px 0"
              }}>
                📏 Altura: {cerro.altura.toLocaleString()} metros
              </p>
              <p style={{ 
                fontSize: "0.95em", 
                color: "#555",
                margin: "10px 0"
              }}>
                📍 {cerro.provincia}
              </p>
              <p style={{ 
                fontSize: "0.95em", 
                color: "#666",
                lineHeight: "1.6",
                marginTop: "15px"
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