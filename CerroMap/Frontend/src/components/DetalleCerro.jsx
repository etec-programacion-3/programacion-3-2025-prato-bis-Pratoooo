// mi-app/src/components/DetalleCerro.jsx (REEMPLAZAR CON ESTO)

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Mantenemos axios aquí

// --- Props actualizadas ---
const DetalleCerro = ({ user, favoriteIds, addToFavorites, removeFromFavorites, onLoginClick }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cerro, setCerro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 768);

  // useEffect para resize
  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect para cargar cerro
  useEffect(() => {
    setLoading(true);
    // Usamos axios directamente aquí ya que App.jsx no pasa el cerro específico
    axios.get(`http://localhost:3001/cerros/${id}`) // Asumimos que tienes una ruta /cerros/:id
      .then(response => {
        setCerro(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar detalle del cerro:', error);
        // Si falla /cerros/:id, intentamos buscarlo en la lista completa
        // Esto es útil si no tienes la ruta específica en el backend
        axios.get(`http://localhost:3001/cerros`)
         .then(response => {
           const cerroEncontrado = response.data.find(c => c.id === parseInt(id));
           if (cerroEncontrado) {
               setCerro(cerroEncontrado);
           } else {
               console.error('Cerro no encontrado en la lista completa tampoco.');
               setCerro(null); // Asegura que se muestre "no encontrado"
           }
           setLoading(false);
         })
         .catch(listError => {
             console.error('Error al cargar lista completa de cerros:', listError);
             setLoading(false);
         });
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontSize: '2em' }}>
        ⏳ Cargando detalle del cerro...
      </div>
    );
  }

  if (!cerro) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h2>😕 Cerro no encontrado</h2>
        <Link to="/senderos" style={{ color: '#8b5a2b', fontSize: '1.2em' }}>
          ← Volver a la lista
        </Link>
      </div>
    );
  }

  // Comprobamos si es favorito
  const isFav = favoriteIds.has(cerro.id);

  // --- Estilos ---
  const volverButtonStyle = {
    background: 'white',
    border: '2px solid #8b5a2b', // Marrón
    color: '#8b5a2b',
    padding: isNarrow ? '10px 20px' : '12px 24px',
    borderRadius: '10px',
    fontSize: isNarrow ? '0.9em' : '1em',
    cursor: 'pointer',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s'
  };
  const volverButtonHoverStyle = {
    background: '#8b5a2b',
    color: 'white',
  };
  const infoBoxStyle = {
    padding: '25px',
    background: 'linear-gradient(135deg, #4a5c36 0%, #8b5a2b 100%)', // Verde/Marrón
    borderRadius: '15px',
    color: 'white',
    textAlign: 'center'
  };
   const favButtonStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '1.8em',
    color: isFav ? '#e74c3c' : '#ccc',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s, background 0.2s, color 0.2s', // Añadido color a transition
    marginLeft: '20px',
    verticalAlign: 'middle'
  };
  // --- Fin Estilos ---


   const handleFavClick = () => {
      if (!user) {
          onLoginClick();
          return;
      }
      if (isFav) {
          removeFromFavorites(cerro.id);
      } else {
          addToFavorites(cerro.id);
      }
  };


  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)', // Ajustado para padding de App
      backgroundColor: '#f5f5f5',
      padding: isNarrow ? '20px' : '40px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          style={volverButtonStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, volverButtonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, {
              background: volverButtonStyle.background,
              color: volverButtonStyle.color
            })}
        >
          ← Volver
        </button>

        {/* Card del cerro */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
        }}>
          {/* Imagen hero */}
          <div style={{
            position: 'relative',
            height: isNarrow ? '300px' : '500px',
            overflow: 'hidden'
          }}>
            <img
              src={cerro.imagen || 'https://via.placeholder.com/1200x500?text=Sin+Imagen'}
              alt={cerro.nombre || 'Cerro'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/1200x500?text=Error+Imagen'; }}
            />
            {/* Overlay con Título y Botón Fav */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              padding: isNarrow ? '40px 20px 20px' : '60px 40px 30px',
              color: 'white'
             }}>
              {/* Contenedor Flex para Título y Botón */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <h1 style={{
                  margin: '0',
                  fontSize: isNarrow ? '2em' : '3.5em',
                  textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
                  flexGrow: 1 // Ocupa espacio disponible
                }}>
                  {cerro.nombre || 'Nombre no disponible'}
                </h1>
                {/* Botón de Favorito */}
                {user && // Solo muestra si está logueado
                    <button
                       style={favButtonStyle} // Ya incluye el color condicional
                       onClick={handleFavClick}
                       onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                       onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                       title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                      {isFav ? '❤️' : '♡'}
                    </button>
                }
                {!user && // Muestra desactivado si no está logueado
                     <button
                       style={{ ...favButtonStyle, color: '#ccc', cursor: 'pointer' }}
                       onClick={handleFavClick} // Llama igual para abrir modal
                       title="Inicia sesión para añadir a favoritos"
                     >
                        ♡
                     </button>
                 }
              </div>
              {/* Info rápida (altura, provincia) */}
              <div style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                fontSize: isNarrow ? '1em' : '1.2em'
              }}>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)'
                }}>
                  📏 {(cerro.altura || 0).toLocaleString()} metros
                </span>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)'
                }}>
                  📍 {cerro.provincia || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div style={{
            padding: isNarrow ? '30px 20px' : '50px 40px'
          }}>
            <h2 style={{
              fontSize: isNarrow ? '1.5em' : '2em',
              color: '#2c3e50',
              marginBottom: '20px'
            }}>
              📖 Descripción
            </h2>
            <p style={{
              fontSize: isNarrow ? '1em' : '1.2em',
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '40px'
            }}>
              {cerro.descripcion || 'No hay descripción disponible.'}
            </p>

            {/* Información adicional */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isNarrow ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '40px'
            }}>
              {/* Caja de Altura */}
              <div style={infoBoxStyle}>
                <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>🏔️</div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>Altura</h3>
                <p style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold' }}>
                  {(cerro.altura || 0).toLocaleString()}m
                </p>
              </div>

              {/* Caja de Ubicación */}
              <div style={infoBoxStyle}>
                <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>📍</div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>Ubicación</h3>
                <p style={{ margin: 0, fontSize: '1.4em', fontWeight: 'bold' }}>
                  {cerro.provincia || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleCerro;