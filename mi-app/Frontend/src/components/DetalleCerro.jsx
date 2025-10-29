// mi-app/src/components/DetalleCerro.jsx (REEMPLAZAR CON ESTO)

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DetalleCerro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cerro, setCerro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true); 
    axios.get(`http://localhost:3001/cerros`) 
      .then(response => {
        const cerroEncontrado = response.data.find(c => c.id === parseInt(id));
        setCerro(cerroEncontrado);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar detalle del cerro:', error);
        setLoading(false);
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
        {/* --- 👇 COLOR MODIFICADO --- */}
        <Link to="/senderos" style={{ color: '#8b5a2b', fontSize: '1.2em' }}> {/* Marrón */}
          ← Volver a la lista
        </Link>
      </div>
    );
  }

  // --- Estilos del Botón "Volver" (con color marrón) ---
  const volverButtonStyle = {
    background: 'white',
    border: '2px solid #8b5a2b', // Marrón
    color: '#8b5a2b', // Marrón
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
    background: '#8b5a2b', // Marrón
    color: 'white',
  };
  
  // --- 👇 ESTILO PARA LAS CAJAS DE INFO (con gradiente verde/marrón) ---
  const infoBoxStyle = {
    padding: '25px',
    background: 'linear-gradient(135deg, #4a5c36 0%, #8b5a2b 100%)', // Verde y Marrón
    borderRadius: '15px',
    color: 'white',
    textAlign: 'center'
  };
  // --- 👆 FIN NUEVO ESTILO ---

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: isNarrow ? '20px' : '40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Botón volver (sin cambios en la lógica) */}
        <button
          onClick={() => navigate(-1)} 
          style={volverButtonStyle} 
          onMouseEnter={(e) => {
            Object.assign(e.target.style, volverButtonHoverStyle); 
          }}
          onMouseLeave={(e) => {
            Object.assign(e.target.style, { 
              background: volverButtonStyle.background,
              color: volverButtonStyle.color
            });
          }}
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
          {/* Imagen hero (sin cambios) */}
          <div style={{
            position: 'relative',
            height: isNarrow ? '300px' : '500px',
            overflow: 'hidden'
          }}>
            <img
              src={cerro.imagen}
              alt={cerro.nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{ /* ... (estilos overlay imagen sin cambios) */ }}>
              <h1 style={{ /* ... */ }}>
                {cerro.nombre}
              </h1>
              <div style={{ /* ... */ }}>
                <span style={{ /* ... */ }}>
                  📏 {cerro.altura?.toLocaleString()} metros
                </span>
                <span style={{ /* ... */ }}>
                  📍 {cerro.provincia}
                </span>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div style={{
            padding: isNarrow ? '30px 20px' : '50px 40px'
          }}>
            <h2 style={{ /* ... */ }}>
              📖 Descripción
            </h2>
            <p style={{ /* ... */ }}>
              {cerro.descripcion}
            </p>

            {/* --- 👇 Información adicional (COLORES MODIFICADOS) --- */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isNarrow ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '40px'
            }}>
              {/* Caja de Altura (con nuevo estilo) */}
              <div style={infoBoxStyle}>
                <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>🏔️</div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>Altura</h3>
                <p style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold' }}>
                  {cerro.altura?.toLocaleString()}m
                </p>
              </div>

              {/* Caja de Ubicación (con nuevo estilo) */}
              <div style={infoBoxStyle}>
                <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>📍</div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>Ubicación</h3>
                <p style={{ margin: 0, fontSize: '1.4em', fontWeight: 'bold' }}>
                  {cerro.provincia}
                </p>
              </div>
            </div>
             {/* --- 👆 FIN INFORMACIÓN ADICIONAL MODIFICADA --- */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleCerro;