// mi-app/src/components/CerrosList.jsx (CORREGIDO)

import { useEffect, useState } from "react";
// Quitamos axios ya que los cerros vienen por props
import { Link } from "react-router-dom";

// --- Props actualizadas ---
const CerrosList = ({ cerros, user, favoriteIds, addToFavorites, removeFromFavorites, onLoginClick }) => {

  const [columns, setColumns] = useState(window.innerWidth < 768 ? 1 : 2);

  // Manejar resize
  useEffect(() => {
    const handleResize = () => setColumns(window.innerWidth < 768 ? 1 : 2);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estilo para el botón de favorito
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

  // --- handleFavClick CON LOGS ---
  const handleFavClick = (e, cerroId, isFav) => {
      e.stopPropagation(); // Evita navegar al detalle al hacer clic en el corazón
      e.preventDefault();
      console.log(`[CerrosList] handleFavClick called for cerroId: ${cerroId}, isFav: ${isFav}, user exists: ${!!user}`); // DEBUG LOG
      if (!user) {
          console.log("[CerrosList] No user found, calling onLoginClick."); // DEBUG LOG
          onLoginClick(); // Llama a la función pasada por App.jsx
          return;
      }
      // Llama a la función correspondiente pasada desde App.jsx
      if (isFav) {
          console.log("[CerrosList] Calling removeFromFavorites..."); // DEBUG LOG
          removeFromFavorites(cerroId);
      } else {
          console.log("[CerrosList] Calling addToFavorites..."); // DEBUG LOG
          addToFavorites(cerroId);
      }
  };

  // --- Estado de Carga (si cerros aún no llegó de App.jsx) ---
  // Hacemos una validación más robusta
  if (!Array.isArray(cerros)) {
       console.error("[CerrosList] La prop 'cerros' no es un array:", cerros);
       return (
            <div style={{ padding: "60px", textAlign: "center", fontSize: "1.5em", color: 'red' }}>
                 Error: Datos de cerros inválidos.
            </div>
       );
  }
  if (cerros.length === 0) {
      // Si el loading de App ya pasó pero cerros sigue vacío
      return (
         <div style={{ padding: "60px", textAlign: "center", fontSize: "1.5em" }}>
             {/* Podríamos diferenciar si está cargando o si realmente no hay datos */}
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
    backgroundColor: "#f5f5f5",
    minHeight: "calc(100vh - 70px)" // Asumiendo navbar de 70px
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
        {/* Mostramos stats solo si hay cerros */}
        {cerros && cerros.length > 0 && (
          <p style={{
            fontSize: columns === 1 ? "0.9em" : "1em",
            marginTop: "15px",
            opacity: 0.85
          }}>
            {/* Calculamos promedio solo si hay cerros con altura */}
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
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: columns === 1 ? "20px" : "30px",
        marginTop: "20px"
      }}>
        {/* --- Mapeo de Cerros --- */}
        {cerros.map(cerro => { // <-- Abre llave para la función map
            // Verifica si el cerro actual está en el Set de favoritos
            // Asegura que cerro.id exista antes de chequear
            const isFav = cerro && typeof cerro.id === 'number' && favoriteIds.has(cerro.id);

            // Si el cerro no tiene id, no lo renderizamos (o mostramos un error)
            if (!cerro || typeof cerro.id !== 'number') {
                console.warn("Se encontró un cerro sin ID válido:", cerro);
                return null; // O un placeholder de error
            }

            return ( // <-- Abre paréntesis para el JSX devuelto por map
              // --- Link a DetalleCerro ---
              <Link
                key={cerro.id} // Usamos el ID como key
                to={`/cerro/${cerro.id}`}
                style={{ textDecoration: "none", color: "inherit", display: 'block', height: '100%' }} // display block y height 100% para que el link ocupe toda la tarjeta
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
                  height: "100%", // Para que todas las tarjetas tengan misma altura en la fila
                  display: "flex",
                  flexDirection: "column",
                  position: 'relative' // Necesario para el botón de favorito
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"; // Efecto hover más sutil
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* --- Contenedor Imagen --- */}
                  <div style={{
                      position: "relative", // Para posicionar botones encima
                      overflow: "hidden",
                      height: columns === 1 ? "200px" : "280px" // Altura de imagen
                  }}>
                    {/* --- Imagen --- */}
                    <img
                      src={cerro.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'} // Imagen por defecto
                      alt={cerro.nombre || 'Cerro sin nombre'}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Escala y recorta para llenar el espacio
                        transition: "transform 0.3s ease" // Efecto zoom suave al pasar mouse (opcional)
                      }}
                       // Manejo de error si la imagen no carga
                       onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/400x300?text=Error+Imagen'; }}
                    />

                    {/* --- Botón de Favorito --- */}
                    {user ? ( // Si hay usuario logueado
                      <button
                        style={{
                          ...favButtonStyle,
                          color: isFav ? '#e74c3c' : '#ccc', // Cambia color basado en isFav
                        }}
                        onClick={(e) => handleFavClick(e, cerro.id, isFav)} // Llama a la función de manejo
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} // Efecto visual
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}  // Efecto visual
                        title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"} // Texto de ayuda
                      >
                        {isFav ? '❤️' : '♡'} {/* Cambia ícono basado en isFav */}
                      </button>
                    ) : ( // Si no hay usuario logueado
                         <button
                           style={{ ...favButtonStyle, color: '#ccc', cursor: 'pointer' }} // Corazón gris
                           onClick={(e) => handleFavClick(e, cerro.id, false)} // Llama igual para abrir modal login
                           title="Inicia sesión para añadir a favoritos" // Texto de ayuda
                         >
                            ♡ {/* Siempre corazón vacío */}
                         </button>
                    )}

                    {/* --- Badge altura --- */}
                    <div style={{
                      position: "absolute",
                      top: "15px", // Lo dejamos arriba a la derecha
                      right: "15px",
                      background: "rgba(255,255,255,0.95)",
                      padding: columns === 1 ? "6px 12px" : "8px 15px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      color: "#4a5c36", // Verde oscuro
                      fontSize: columns === 1 ? "0.8em" : "0.9em",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                    }}>
                      📏 {(cerro.altura || 0).toLocaleString()}m {/* Maneja altura undefined */}
                    </div>
                  </div> {/* --- Fin Contenedor Imagen --- */}

                  {/* --- Contenido de la Tarjeta --- */}
                  <div style={{
                    padding: columns === 1 ? "20px" : "25px",
                    flex: 1, // Ocupa el espacio restante verticalmente
                    display: "flex",
                    flexDirection: "column" // Organiza elementos verticalmente
                  }}>
                    {/* --- Nombre --- */}
                    <h2 style={{
                      margin: "0 0 10px 0", // Reducido margen inferior
                      color: "#2c3e50",
                      fontSize: columns === 1 ? "1.4em" : "1.7em", // Ligeramente más pequeño
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
                      gap: "8px", // Reducido gap
                      marginBottom: "15px",
                      padding: "8px 12px", // Reducido padding
                      background: "#f8f9fa", // Fondo gris claro
                      borderRadius: "8px" // Redondeado
                    }}>
                      <span style={{ fontSize: "1.1em" }}>📍</span>
                      <span style={{
                        fontSize: columns === 1 ? "0.9em" : "0.95em", // Ligeramente más pequeño
                        color: "#555",
                        fontWeight: "500"
                      }}>
                        {cerro.provincia || 'Provincia no disponible'}
                      </span>
                    </div>

                    {/* --- Descripción --- */}
                    <p style={{
                      fontSize: columns === 1 ? "0.85em" : "0.9em", // Ligeramente más pequeño
                      color: "#666",
                      lineHeight: "1.6", // Ligeramente más compacto
                      margin: "0 0 15px 0", // Margen inferior
                      flexGrow: 1, // Ocupa el espacio disponible para empujar "Ver más"
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: '45px' // Ajusta según necesites
                    }}>
                      {cerro.descripcion || 'Sin descripción.'}
                    </p>

                    {/* --- Ver más --- */}
                    <div style={{
                      marginTop: "auto", // Empuja esto al fondo
                      paddingTop: "10px", // Espacio sobre la línea
                      borderTop: "1px solid #eee", // Línea divisoria
                      color: "#8b5a2b", // Marrón
                      fontWeight: "bold",
                      fontSize: columns === 1 ? "0.9em" : "1em",
                      textAlign: 'right' // Alineado a la derecha
                    }}>
                      Ver más →
                    </div>
                  </div> {/* --- Fin Contenido --- */}
                </div> {/* --- Fin Tarjeta --- */}
              </Link> // <-- Cierre del Link
            ); // <-- Cierre del return dentro del map
          })} {/* <-- Cierre EXACTO del map */}
      </div> {/* --- Fin Grid --- */}

    </div> {/* --- Fin Div interno --- */}
  </div> // --- Fin Div externo ---
); // <-- Cierre del return principal del componente
}; // <-- Cierre de la función del componente

export default CerrosList; // Exportación