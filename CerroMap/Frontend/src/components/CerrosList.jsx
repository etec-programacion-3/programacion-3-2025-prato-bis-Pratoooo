// mi-app/src/components/CerrosList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// --- Props actualizadas (se añade 'handleDeleteCerro') ---
const CerrosList = ({ cerros, user, favoriteIds, addToFavorites, removeFromFavorites, onLoginClick, handleDeleteCerro }) => {

  const [columns, setColumns] = useState(window.innerWidth < 768 ? 1 : 2);

  // Manejar resize
  useEffect(() => {
    const handleResize = () => setColumns(window.innerWidth < 768 ? 1 : 2);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Estilos de Botones ---
  const favButtonStyle = {
    position: 'absolute',
    top: '15px',
    left: '15px',
    background: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '1.5em',
    color: '#e74c3c', // Color base rojo
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s, background 0.2s',
    zIndex: 2 // Para estar sobre la imagen
  };

  // --- 👇 NUEVO ESTILO ---
  const deleteButtonStyle = {
    position: 'absolute',
    top: '60px', // Debajo del de favoritos (40px + 15px espacio + 5px)
    left: '15px',
    background: 'rgba(52, 73, 94, 0.8)', // Gris oscuro
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '1.3em', // Un poco más pequeño que fav
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s, background 0.2s',
    zIndex: 2
  };

  // --- handleFavClick CON LOGS ---
  const handleFavClick = (e, cerroId, isFav) => {
      e.stopPropagation(); // Evita navegar al detalle al hacer clic en el corazón
      e.preventDefault();
      console.log(`[CerrosList] handleFavClick called for cerroId: ${cerroId}, isFav: ${isFav}, user exists: ${!!user}`); 
      if (!user) {
          console.log("[CerrosList] No user found, calling onLoginClick."); 
          onLoginClick(); // Llama a la función pasada por App.jsx
          return;
      }
      if (isFav) {
          console.log("[CerrosList] Calling removeFromFavorites..."); 
          removeFromFavorites(cerroId);
      } else {
          console.log("[CerrosList] Calling addToFavorites..."); 
          addToFavorites(cerroId);
      }
  };

  // --- 👇 NUEVA FUNCIÓN DE MANEJO ---
  const handleDeleteClick = (e, cerroId) => {
      e.stopPropagation(); // Evita navegar al detalle
      e.preventDefault();
      console.log(`[CerrosList] handleDeleteClick called for cerroId: ${cerroId}`);
      // La confirmación (window.confirm) ya se hace en App.jsx
      handleDeleteCerro(cerroId);
  };


  // --- Estado de Carga (si cerros aún no llegó de App.jsx) ---
  if (!Array.isArray(cerros)) {
       console.error("[CerrosList] La prop 'cerros' no es un array:", cerros);
       return (
            <div style={{ padding: "60px", textAlign: "center", fontSize: "1.5em", color: 'red' }}>
                 Error: Datos de cerros inválidos.
            </div>
       );
  }
  if (cerros.length === 0) {
      return (
         <div style={{ padding: "60px", textAlign: "center", fontSize: "1.5em" }}>
             Cargando lista de cerros... O no se encontraron cerros registrados.
         </div>
      );
  }

return (
  // --- Div externo ---
  <div style={{
    paddingTop: columns === 1 ? "30px" : "40px",
    paddingBottom: columns === 1 ? "15px" : "20px",
    paddingLeft: columns === 1 ? "15px" : "20px",
    paddingRight: columns === 1 ? "15px" : "20px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#f5f5ff", // Un fondo ligeramente azulado
    minHeight: "calc(100vh - 80px)" // Asumiendo navbar de 80px
  }}>

    {/* --- Div interno centrado --- */}
    <div style={{
      maxWidth: "1400px",
      margin: "0 auto",
      width: "100%"
    }}>

      {/* --- Header --- */}
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
          fontSize: columns === 1 ? "2em" : "3em",
          margin: "0 0 10px 0",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          🏔️ Senderos de Mendoza
        </h1>
        <p style={{
          fontSize: columns === 1 ? "1em" : "1.3em",
          margin: "10px 0 0 0",
          opacity: 0.95
        }}>
          Descubre las montañas más impresionantes de Argentina
        </p>
        {cerros && cerros.length > 0 && (
          <p style={{
            fontSize: columns === 1 ? "0.9em" : "1em",
            marginTop: "15px",
            opacity: 0.85
          }}>
            📊 Total de senderos: {cerros.length} | 📏 Altura promedio: {
              (() => {
                  const cerrosConAltura = cerros.filter(c => typeof c.altura === 'number');
                  if (cerrosConAltura.length === 0) return 'N/A';
                  const sum = cerrosConAltura.reduce((acc, c) => acc + c.altura, 0);
                  return Math.round(sum / cerrosConAltura.length).toLocaleString() + 'm';
              })()
            }
          </p>
        )}
      </div>

      {/* --- Grid de cerros --- */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(320px, 1fr))`, // Responsive
        gap: columns === 1 ? "20px" : "30px",
        marginTop: "20px"
      }}>
        {/* --- Mapeo de Cerros --- */}
        {cerros.map(cerro => { 
            const isFav = cerro && typeof cerro.id === 'number' && favoriteIds.has(cerro.id);

            if (!cerro || typeof cerro.id !== 'number') {
                console.warn("Se encontró un cerro sin ID válido:", cerro);
                return null; 
            }

            return ( 
              <Link
                key={cerro.id} 
                to={`/cerro/${cerro.id}`}
                style={{ textDecoration: "none", color: "inherit", display: 'block', height: '100%' }}
              >
                {/* --- Tarjeta --- */}
                <div style={{
                  border: "none",
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "white",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%", 
                  display: "flex",
                  flexDirection: "column",
                  position: 'relative' // Necesario para botones
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"; 
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* --- Contenedor Imagen --- */}
                  <div style={{
                      position: "relative", 
                      overflow: "hidden",
                      height: "280px" // Altura fija
                  }}>
                    {/* --- Imagen --- */}
                    <img
                      src={cerro.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'} 
                      alt={cerro.nombre || 'Cerro sin nombre'}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", 
                        transition: "transform 0.3s ease" 
                      }}
                       onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/400x300?text=Error+Imagen'; }}
                    />

                    {/* --- Botón de Favorito --- */}
                    {user ? ( 
                      <button
                        style={{
                          ...favButtonStyle,
                          color: isFav ? '#e74c3c' : '#ccc', // Cambia color
                        }}
                        onClick={(e) => handleFavClick(e, cerro.id, isFav)} 
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} 
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}  
                        title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"} 
                      >
                        {isFav ? '❤️' : '♡'} 
                      </button>
                    ) : ( 
                         <button
                           style={{ ...favButtonStyle, color: '#ccc', cursor: 'pointer' }} 
                           onClick={(e) => handleFavClick(e, cerro.id, false)} 
                           title="Inicia sesión para añadir a favoritos" 
                         >
                            ♡ 
                         </button>
                    )}

                    {/* --- 👇 NUEVO BOTÓN DE BORRAR --- */}
                    {user && ( // Solo usuarios logueados pueden ver el botón
                      <button
                        style={deleteButtonStyle}
                        onClick={(e) => handleDeleteClick(e, cerro.id)}
                        onMouseEnter={(e) => {
                           e.target.style.transform = 'scale(1.1)';
                           e.target.style.background = '#c0392b'; // Se pone rojo en hover
                        }}
                        onMouseLeave={(e) => {
                           e.target.style.transform = 'scale(1)';
                           e.target.style.background = 'rgba(52, 73, 94, 0.8)';
R                        }}
                        title="Eliminar cerro (¡Permanente!)"
                      >
                        🗑️
                      </button>
                    )}
                    {/* --- FIN NUEVO BOTÓN --- */}

                    {/* --- Badge altura --- */}
                    <div style={{
                      position: "absolute",
                      top: "15px", 
                      right: "15px",
                      background: "rgba(255,255,255,0.95)",
                      padding: "8px 15px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      color: "#4a5c36", // Verde oscuro
                      fontSize: "0.9em",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                    }}>
                      📏 {(cerro.altura || 0).toLocaleString()}m 
                    </div>
                  </div> {/* --- Fin Contenedor Imagen --- */}

                  {/* --- Contenido de la Tarjeta --- */}
                  <div style={{
                    padding: "25px",
                    flex: 1, 
                    display: "flex",
                    flexDirection: "column" 
                  }}>
                    {/* --- Nombre --- */}
                    <h2 style={{
                      margin: "0 0 10px 0", 
                      color: "#2c3e50",
                      fontSize: "1.7em", 
                      fontWeight: "600",
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {cerro.nombre || 'Nombre no disponible'}
                    </h2>

                    {/* --- Provincia --- */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px", 
                      marginBottom: "15px",
                      padding: "8px 12px", 
                      background: "#f8f9fa", 
                      borderRadius: "8px" 
                    }}>
                      <span style={{ fontSize: "1.1em" }}>📍</span>
                      <span style={{
                        fontSize: "0.95em", 
                        color: "#555",
                        fontWeight: "500"
                      }}>
                        {cerro.provincia || 'Provincia no disponible'}
                      </span>
                    </div>

                    {/* --- Descripción --- */}
                    <p style={{
                      fontSize: "0.9em", 
                      color: "#666",
                      lineHeight: "1.6", 
                      margin: "0 0 15px 0", 
                      flexGrow: 1, 
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: '54px' // 3 líneas * 1.6 * 0.9em
                    }}>
                      {cerro.descripcion || 'Sin descripción.'}
                    </p>

                    {/* --- Ver más --- */}
                    <div style={{
                      marginTop: "auto", 
                      paddingTop: "10px", 
                      borderTop: "1px solid #eee", 
                      color: "#8b5a2b", 
                      fontWeight: "bold",
                      fontSize: "1em",
                      textAlign: 'right' 
                    }}>
                      Ver más →
                    </div>
                  </div> {/* --- Fin Contenido --- */}
                </div> {/* --- Fin Tarjeta --- */}
              </Link> 
            ); 
          })} 
      </div> {/* --- Fin Grid --- */}

    </div> {/* --- Fin Div interno --- */}
  </div> 
); 
}; 

export default CerrosList;