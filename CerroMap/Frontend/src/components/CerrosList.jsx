
// mi-app/src/components/CerrosList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CerrosList = ({ cerros, user, favoriteIds, addToFavorites, removeFromFavorites, onLoginClick, handleDeleteCerro }) => {

  // --- 👇 LÓGICA PARA 1 O 2 COLUMNAS ---
  const [columns, setColumns] = useState(window.innerWidth < 768 ? 1 : 2);

  useEffect(() => {
    const handleResize = () => {
      // 768px es un punto de quiebre común para tablets
      setColumns(window.innerWidth < 768 ? 1 : 2);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // --- 👆 FIN LÓGICA DE COLUMNAS ---

  // --- Estilos de Botones (sin cambios) ---
  const favButtonStyle = {
    position: 'absolute', top: '15px', left: '15px', background: 'rgba(255, 255, 255, 0.8)',
    border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex',
    justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '1.5em',
    color: '#e74c3c', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s, background 0.2s', zIndex: 2 
  };
  const deleteButtonStyle = {
    position: 'absolute', top: '60px', left: '15px', background: 'rgba(52, 73, 94, 0.8)',
    border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex',
    justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '1.3em', 
    color: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s, background 0.2s', zIndex: 2
  };
  
  // --- Manejadores de Clics (sin cambios) ---
  const handleFavClick = (e, cerroId, isFav) => {
      e.stopPropagation(); e.preventDefault();
      if (!user) { onLoginClick(); return; }
      if (isFav) { removeFromFavorites(cerroId); } else { addToFavorites(cerroId); }
  };
  const handleDeleteClick = (e, cerroId) => {
      e.stopPropagation(); e.preventDefault();
      handleDeleteCerro(cerroId);
  };

  // --- Estado de Carga (sin cambios) ---
  if (!Array.isArray(cerros)) {
       return <div style={{ padding: "60px", textAlign: "center", fontSize: "1.5em", color: 'red' }}>Error: Datos de cerros inválidos.</div>;
  }
  if (cerros.length === 0) {
      return <div style={{ padding: "60px", textAlign: "center", fontSize: "1.5em" }}>Cargando lista de cerros...</div>;
  }

return (
  <div style={{
    width: "100%", minHeight: "calc(100vh - 70px)", padding: "40px 20px",
    boxSizing: "border-box", backgroundColor: "#f4f7f6", 
  }}>
    <div style={{ 
        maxWidth: "1400px", // Ancho máximo
        margin: "0 auto" 
    }}>

      {/* --- Header (sin cambios) --- */}
      <div style={{
        textAlign: "center", marginBottom: "40px", padding: "30px",
        background: "linear-gradient(135deg, #4a5c36 0%, #8b5a2b 100%)",
        borderRadius: "20px", color: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ fontSize: "2.5em", margin: "0 0 10px 0" }}>🏔️ Senderos</h1>
        <p style={{ fontSize: "1.2em", margin: 0, opacity: 0.9 }}>Descubre las montañas más impresionantes</p>
      </div>

      {/* --- 👇 GRILLA (GRID) CORREGIDA --- */}
      <div style={{
        display: "grid",
        // Aquí usamos el estado 'columns' para forzar 1 o 2 columnas
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "30px",
      }}>

        {/* --- Mapeo de Cerros --- */}
        {cerros.map(cerro => {
            const isFav = cerro && typeof cerro.id === 'number' && favoriteIds.has(cerro.id);

            if (!cerro || typeof cerro.id !== 'number') return null; 

            return (
              // --- 👇 TARJETA (Link) ---
              // Flexbox fuerza a la tarjeta a ocupar el 100% del alto
              <Link
                key={cerro.id} 
                to={`/cerro/${cerro.id}`}
                style={{ 
                    textDecoration: "none", 
                    color: "inherit",
                    display: 'flex', // <-- Magia
                    flexDirection: 'column', // <-- Magia
                    height: '100%' 
                }}
              >
                {/* --- Contenedor Interno de la Tarjeta --- */}
                <div style={{
                  border: "none", borderRadius: "20px", overflow: "hidden",
                  background: "white", boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease", cursor: "pointer",
                  display: "flex", // <-- Magia
                  flexDirection: "column", // <-- Magia
                  flexGrow: 1 // <-- Magia (crece para llenar el espacio)
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* --- Contenedor Imagen --- */}
                  <div style={{
                      position: "relative", height: "250px", backgroundColor: '#eee'
                  }}>
                    <img
                      src={cerro.imagen || 'https://via.placeholder.com/400x250?text=Sin+Imagen'} 
                      alt={cerro.nombre || 'Cerro sin nombre'}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/400x250?text=Error+Imagen'; }}
                    />

                    {/* --- Botones (Favorito, Borrar) --- */}
                    {user ? ( 
                      <button
                        style={{ ...favButtonStyle, color: isFav ? '#e74c3c' : '#ccc' }}
                        onClick={(e) => handleFavClick(e, cerro.id, isFav)} 
                        title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"} 
                      >
                        {isFav ? '❤️' : '♡'} 
                      </button>
                    ) : ( 
                         <button
                           style={{ ...favButtonStyle, color: '#ccc' }} 
                           onClick={(e) => handleFavClick(e, cerro.id, false)} 
                           title="Inicia sesión para añadir a favoritos" 
                         >
                            ♡ 
                         </button>
                    )}
                    {user && ( 
                      <button
                        style={deleteButtonStyle}
                        onClick={(e) => handleDeleteClick(e, cerro.id)}
                        onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(52, 73, 94, 0.8)'}
                        title="Eliminar cerro (¡Permanente!)"
                      >
                        🗑️
                      </button>
                    )}
                    
                    {/* --- Badge altura --- */}
                    <div style={{
                      position: "absolute", bottom: "10px", right: "10px",
                      background: "rgba(255,255,255,0.95)", padding: "5px 12px",
                      borderRadius: "20px", fontWeight: "bold", color: "#4a5c36",
                      fontSize: "0.9em", boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
                    }}>
                      📏 {(cerro.altura || 0).toLocaleString()}m 
                    </div>
                  </div> 

                  {/* --- 👇 Contenido de la Tarjeta (CORREGIDO) --- */}
                  <div style={{
                    padding: "25px",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1, // <-- Magia (crece)
                  }}>
                    
                    <h2 style={{
                      margin: "0 0 10px 0", color: "#2c3e50", fontSize: "1.6em", 
                      fontWeight: "600", whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {cerro.nombre || 'Nombre no disponible'}
                    </h2>

                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px", 
                      marginBottom: "15px", color: "#555", fontSize: '0.95em'
                    }}>
                      <span style={{ fontSize: "1.1em" }}>📍</span>
                      {cerro.provincia || 'Provincia no disponible'}
                    </div>

                    <p style={{
                      fontSize: "0.9em", color: "#666", lineHeight: "1.6", 
                      margin: "0 0 15px 0", 
                      flexGrow: 1, // <-- Magia (crece)
                      display: "-webkit-box", WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                      textOverflow: "ellipsis", minHeight: '54px' 
                    }}>
                      {cerro.descripcion || 'Sin descripción.'}
                    </p>

                    <div style={{
                      marginTop: "auto", // <-- Magia (empuja al fondo)
                      paddingTop: "10px", borderTop: "1px solid #eee", 
                      color: "#8b5a2b", fontWeight: "bold",
                      fontSize: "1em", textAlign: 'right' 
                    }}>
                      Ver más →
                    </div>
                  </div> 
                </div> 
              </Link> 
            ); 
          })} 
      </div> {/* --- Fin Grid --- */}

    </div> {/* --- Fin Div interno --- */}
  </div> 
); 
}; 

export default CerrosList;
