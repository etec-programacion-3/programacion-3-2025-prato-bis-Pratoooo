// mi-app/src/components/Favoritos.jsx (REEMPLAZAR CON ESTO)

import React from 'react';
import { Link } from 'react-router-dom';

// --- Props actualizadas ---
const Favoritos = ({ favoriteCerros, removeFromFavorites, user, onLoginClick }) => {

   // --- Estilos ---
   const cardStyle = {
      border: "none",
      borderRadius: "20px",
      overflow: "hidden",
      background: "white",
      boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      height: "100%", // Asegura que todas las tarjetas tengan la misma altura si están en grid
      display: "flex",
      flexDirection: "column",
   };

    const removeButtonStyle = {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'rgba(231, 76, 60, 0.8)', // Rojo semitransparente
      border: 'none',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '1.2em',
      color: 'white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, background 0.2s',
      zIndex: 2
   };

   const linkStyle = {
       color: '#8b5a2b', // Marrón
       textDecoration: 'underline',
       fontWeight: 'bold'
   };
    const loginButtonStyle = {
       color: '#8b5a2b',
       background: 'none',
       border: 'none',
       textDecoration: 'underline',
       cursor: 'pointer',
       fontSize: '1em',
       padding: 0, // Quita padding default
       fontWeight: 'bold'
   };
   // --- Fin Estilos ---


   // Si el usuario no está logueado
   if (!user) {
     return (
       <div style={{ padding: '40px', maxWidth: '1000px', margin: '40px auto', textAlign: 'center', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
         <h1 style={{color: '#4a5c36', marginBottom: '20px'}}>❤️ Mis Cerros Favoritos</h1>
         <p style={{fontSize: '1.1em', color: '#555'}}>
           Debes <button onClick={onLoginClick} style={loginButtonStyle}>iniciar sesión</button> para ver o guardar tus cerros favoritos.
         </p>
         <p style={{marginTop: '30px'}}>
             <Link to="/senderos" style={linkStyle}>Explorar senderos</Link>
         </p>
       </div>
     );
   }

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 80px - 80px)' }}> {/* 80px navbar + 80px padding */}
      <h1 style={{
        textAlign: 'center',
        fontSize: 'clamp(2rem, 5vw, 2.8rem)', // Ajustado
        color: '#4a5c36', // Verde
        marginBottom: '30px'
      }}>
        ❤️ Mis Cerros Favoritos ({favoriteCerros ? favoriteCerros.length : 0})
      </h1>

      {/* Si está logueado pero no hay favoritos */}
      {(!favoriteCerros || favoriteCerros.length === 0) && user ? (
        <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '20px' }}>
            Aún no has añadido ningún cerro a tus favoritos.
          </p>
           <p>¡Explora la <Link to="/senderos" style={linkStyle}>lista de senderos</Link> y marca los que más te gusten con un ❤️!</p>
        </div>
      ) : (
        // Si hay favoritos, muestra la grid
        <div style={{
          display: "grid",
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', // Columnas responsivas
          gap: "30px",
        }}>
          {favoriteCerros.map(cerro => (
            // Contenedor relativo para el botón de eliminar
            <div key={cerro.id} style={{ position: 'relative' }}>
               {/* Botón para quitar favorito */}
               <button
                  style={removeButtonStyle}
                  onClick={() => {
                      console.log("Intentando quitar favorito:", cerro.id);
                      removeFromFavorites(cerro.id);
                  }}
                  onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.background = '#c0392b'; // Rojo más oscuro
                  }}
                  onMouseLeave={(e) => {
                       e.target.style.transform = 'scale(1)';
                       e.target.style.background = 'rgba(231, 76, 60, 0.8)';
                  }}
                  title="Quitar de favoritos"
               >
                 🗑️
               </button>

              {/* Tarjeta del cerro (Linkeada) */}
              <Link to={`/cerro/${cerro.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <div style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"; // Efecto hover más sutil
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Imagen */}
                  <div style={{ height: "250px", overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={cerro.imagen || 'https://via.placeholder.com/400x250?text=Sin+Imagen'}
                      alt={cerro.nombre || 'Cerro'}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                       onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/400x250?text=Error+Imagen'; }}
                    />
                     {/* Badge Altura (opcional, igual que en CerrosList) */}
                     <div style={{
                        position: "absolute", bottom: "10px", right: "10px",
                        background: "rgba(255,255,255,0.9)", padding: "5px 10px",
                        borderRadius: "15px", fontWeight: "bold", color: "#4a5c36",
                        fontSize: "0.85em", boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
                     }}>
                         📏 {(cerro.altura || 0).toLocaleString()}m
                     </div>
                  </div>
                  {/* Contenido */}
                  <div style={{ padding: "20px", flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{
                        margin: "0 0 10px 0", color: "#2c3e50", fontSize: "1.5em",
                        // Limitar nombre a una línea
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                     }}>
                      {cerro.nombre || 'Nombre no disponible'}
                    </h2>
                     <div style={{
                         display: "flex", alignItems: "center", gap: "8px",
                         marginBottom: "15px", color: "#555", fontSize: '0.95em'
                     }}>
                       <span style={{ fontSize: "1.1em" }}>📍</span> {cerro.provincia || 'N/A'}
                    </div>
                    {/* Descripción corta (opcional) */}
                    <p style={{
                         fontSize: "0.9em", color: "#666", lineHeight: "1.6",
                         margin: "0 0 15px 0", flexGrow: 1, // Ocupa espacio
                         display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                         overflow: "hidden", textOverflow: "ellipsis", minHeight: '40px'
                     }}>
                        {cerro.descripcion || 'Sin descripción.'}
                    </p>
                    {/* Botón/Link Ver Más */}
                     <div style={{marginTop: "auto", paddingTop: "10px", borderTop: "1px solid #eee", color: "#8b5a2b", fontWeight: "bold", fontSize: "0.9em", textAlign: 'right'}}>
                         Ver Detalles →
                     </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;