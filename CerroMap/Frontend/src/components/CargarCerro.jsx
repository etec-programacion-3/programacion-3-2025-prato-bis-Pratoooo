// mi-app/src/components/CargarCerro.jsx (REEMPLAZAR CON ESTO)

import React from 'react';

const CargarCerro = () => {
  // Estilos
  const inputStyle = {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    margin: '15px 0',
    padding: '12px',
    fontSize: '1em',
    border: '2px solid #ddd',
    borderRadius: '10px'
  };

  const btnStyle = {
    // --- 👇 LÍNEA MODIFICADA ---
    backgroundColor: '#4a5c36', // Verde oscuro
    color: 'white',
    border: 'none',
    padding: '15px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '10px',
    fontSize: '1.1em',
    fontWeight: 'bold'
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '2.5em', 
        color: '#2c3e50', 
        marginBottom: '30px' 
      }}>
        ➕ Cargar un Nuevo Cerro
      </h1>
      <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#555', marginBottom: '30px' }}>
        Completa el formulario para añadir un nuevo sendero o cerro a la base de datos.
      </p>

      <form onSubmit={(e) => e.preventDefault()} style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
      }}>
        <label>Nombre del Cerro:</label>
        <input type="text" placeholder="Ej: Cerro Aconcagua" style={inputStyle} />
        
        <label>Altura (en metros):</label>
        <input type="number" placeholder="Ej: 6960" style={inputStyle} />
        
        <label>Provincia:</label>
        <input type="text" placeholder="Ej: Mendoza" style={inputStyle} />

        <label>Descripción Corta:</label>
        <textarea placeholder="Una breve descripción..." style={{...inputStyle, height: '100px'}} />
        
        <label>URL de la Imagen:</label>
        <input type="text" placeholder="https://..." style={inputStyle} />
        
        <button type="submit" style={btnStyle}>
          Guardar Cerro
        </button>
      </form>
    </div>
  );
};

export default CargarCerro;