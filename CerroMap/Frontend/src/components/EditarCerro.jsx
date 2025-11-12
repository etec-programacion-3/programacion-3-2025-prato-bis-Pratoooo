// mi-app/src/components/EditarCerro.jsx (ARCHIVO NUEVO)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Creamos una instancia de axios
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
});

const EditarCerro = ({ token, onLoginClick }) => {
  const { id } = useParams(); // Obtiene el ID del cerro desde la URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    altura: '',
    provincia: '',
    descripcion: '',
    imagen: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos del cerro a editar
  useEffect(() => {
    if (!token) {
        onLoginClick(); // Si no está logueado, abre el modal
        navigate('/senderos'); // Y lo saca de esta página
        return;
    }
    
    const fetchCerroData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/cerros/${id}`);
            const { nombre, altura, provincia, descripcion, imagen } = response.data;
            setFormData({ nombre, altura, provincia, descripcion, imagen });
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar datos del cerro:", error);
            setMessage(`❌ Error: No se pudo cargar el cerro. ${error.response?.data?.error || ''}`);
            setLoading(false);
        }
    };
    
    fetchCerroData();
  }, [id, token, navigate, onLoginClick]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Enviar actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Guardando...');

    // Validación simple
    if (!formData.nombre || !formData.altura) {
      setMessage('❌ Error: Nombre y Altura son obligatorios.');
      return;
    }
    
    try {
      // Usamos la ruta PUT (modificar)
      const response = await apiClient.put(`/cerros/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Cerro actualizado:", response.data);
      setMessage('✅ ¡Cerro actualizado con éxito!');
      
      // Espera 2 segundos y redirige a "Mis Cerros"
      setTimeout(() => {
        navigate('/mis-cerros'); 
      }, 1500);

    } catch (error) {
      console.error("Error al actualizar el cerro:", error);
      setMessage(`❌ Error al guardar: ${error.response?.data?.error || 'Error desconocido'}`);
    }
  };

  // --- Estilos ---
  const formStyle = {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
  };
  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0 20px 0',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1em'
  };
  const labelStyle = {
      fontWeight: '600',
      color: '#333'
  };
   const buttonStyle = {
     width: '100%',
     padding: '15px',
     border: 'none',
     borderRadius: '8px',
     backgroundColor: '#4a5c36', // Verde
     color: 'white',
     fontSize: '1.2em',
     fontWeight: 'bold',
     cursor: 'pointer',
     transition: 'background-color 0.3s'
  };

  if (loading) {
     return <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.5em' }}>Cargando editor...</div>;
  }
  
  if (!token) {
     return <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.5em' }}>Debes iniciar sesión para editar.</div>;
  }

  return (
    <div style={{ padding: '40px', minHeight: 'calc(100vh - 80px)', background: '#f4f7f6' }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={{ textAlign: 'center', color: '#4a5c36', marginBottom: '30px' }}>
          ✏️ Modificar Cerro
        </h1>
        
        <label htmlFor="nombre" style={labelStyle}>Nombre del Cerro</label>
        <input
          type="text"
          name="nombre"
          id="nombre"
          value={formData.nombre}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <label htmlFor="altura" style={labelStyle}>Altura (en metros)</label>
        <input
          type="number"
          name="altura"
          id="altura"
          value={formData.altura}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <label htmlFor="provincia" style={labelStyle}>Provincia</label>
        <input
          type="text"
          name="provincia"
          id="provincia"
          value={formData.provincia}
          onChange={handleChange}
          style={inputStyle}
        />
        
        <label htmlFor="imagen" style={labelStyle}>URL de la Imagen</label>
        <input
          type="text"
          name="imagen"
          id="imagen"
          value={formData.imagen}
          onChange={handleChange}
          style={inputStyle}
        />
        
        <label htmlFor="descripcion" style={labelStyle}>Descripción Corta</label>
        <textarea
          name="descripcion"
          id="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: '120px' }}
        />

        <button 
          type="submit" 
          style={buttonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#3e4f2d'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4a5c36'}
        >
          Guardar Cambios
        </button>
        
        {message && (
          <p style={{ 
            textAlign: 'center', 
            marginTop: '20px', 
            fontSize: '1.1em',
            color: message.startsWith('✅') ? 'green' : 'red'
          }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default EditarCerro;