// mi-app/src/components/MisCerros.jsx (ARCHIVO NUEVO)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Creamos una instancia de axios para no repetir la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
});

// Este componente es una "copia" de CerrosList pero para 'mis-cerros'
// Recibe el token y la función de borrar de App.jsx
const MisCerros = ({ token, handleDeleteCerro, user }) => {
  const [misCerros, setMisCerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // Si no hay token, no podemos cargar nada
      setLoading(false);
      setError("Debes iniciar sesión para ver esta página.");
      // Opcional: redirigir al login
      // navigate('/'); 
      return;
    }

    const fetchMisCerros = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/cerros/mis-cerros', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMisCerros(response.data);
      } catch (err) {
        console.error("Error al cargar 'mis cerros':", err);
        setError(err.response?.data?.error || "No se pudieron cargar tus cerros.");
      } finally {
        setLoading(false);
      }
    };

    fetchMisCerros();
  }, [token, navigate]); // Depende de 'token'

  // --- Estilos ---
   const cardStyle = {
      border: "1px solid #ddd",
      borderRadius: "15px",
      overflow: "hidden",
      background: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
      height: "100%", 
      display: "flex",
      flexDirection: "column",
   };
    const buttonStyle = {
      padding: '8px 15px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'transform 0.2s',
      marginRight: '10px'
    };
    const editButtonStyle = {
       ...buttonStyle,
       backgroundColor: '#3498db', // Azul
       color: 'white',
    };
     const deleteButtonStyle = {
       ...buttonStyle,
       backgroundColor: '#e74c3c', // Rojo
       color: 'white',
    };

  // --- Renderizado ---

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.5em' }}>Cargando tus cerros...</div>;
  }

  if (error) {
     return <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.5em', color: 'red' }}>{error}</div>;
  }

  if (!user) {
     return <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.5em' }}>Por favor, inicia sesión.</div>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 80px)' }}>
      <h1 style={{
        textAlign: 'center',
        fontSize: 'clamp(2rem, 5vw, 2.8rem)',
        color: '#4a5c36',
        marginBottom: '30px'
      }}>
        ✍️ Mis Cerros Cargados ({misCerros.length})
      </h1>

      {misCerros.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '20px' }}>
            Aún no has cargado ningún cerro.
          </p>
           <p>¡Ve a <Link to="/cargar" style={{ color: '#8b5a2b', textDecoration: 'underline' }}>Cargar Cerro</Link> para añadir el primero!</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: "30px",
        }}>
          {misCerros.map(cerro => (
            <div key={cerro.id} style={cardStyle}>
              {/* Imagen */}
              <div style={{ height: "220px", overflow: 'hidden' }}>
                <img
                  src={cerro.imagen || 'https://via.placeholder.com/400x220?text=Sin+Imagen'}
                  alt={cerro.nombre}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/400x220?text=Error+Imagen'; }}
                />
              </div>
              
              {/* Contenido */}
              <div style={{ padding: "20px", flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ margin: "0 0 10px 0", color: "#2c3e50", fontSize: "1.5em" }}>
                  {cerro.nombre}
                </h2>
                <div style={{ color: "#555", fontSize: '0.95em', marginBottom: '5px' }}>
                  📏 {cerro.altura}m
                </div>
                <div style={{ color: "#555", fontSize: '0.95em', marginBottom: '15px' }}>
                  📍 {cerro.provincia}
                </div>
                <p style={{
                    fontSize: "0.9em", color: "#666", lineHeight: "1.6", flexGrow: 1,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    overflow: "hidden", textOverflow: "ellipsis", minHeight: '40px'
                }}>
                  {cerro.descripcion || 'Sin descripción.'}
                </p>
                
                {/* Botones de Acción */}
                <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                  <Link to={`/editar-cerro/${cerro.id}`}>
                    <button 
                      style={editButtonStyle}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      ✏️ Modificar
                    </button>
                  </Link>
                  <button 
                    style={deleteButtonStyle}
                    onClick={() => {
                      // Usamos la función de App.jsx
                      // La API ya valida que solo el creador pueda borrar
                      handleDeleteCerro(cerro.id); 
                      // Opcional: actualizar el estado local para reflejo inmediato
                      // setMisCerros(misCerros.filter(c => c.id !== cerro.id));
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCerros;