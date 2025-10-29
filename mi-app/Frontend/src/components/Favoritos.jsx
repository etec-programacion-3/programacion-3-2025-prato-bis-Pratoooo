// mi-app/src/components/Favoritos.jsx (¡ARCHIVO NUEVO!)

import React from 'react';

const Favoritos = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '2.5em', 
        color: '#2c3e50', 
        marginBottom: '30px' 
      }}>
        ❤️ Mis Cerros Favoritos
      </h1>
      <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#555' }}>
        Aquí aparecerá la lista de los cerros que has guardado como favoritos.
      </p>
      {/* Próximos pasos:
        1. Hacer un fetch a una ruta de tu backend (ej. /api/favoritos/:userId)
        2. Mapear los resultados y mostrarlos como una lista o tarjetas.
      */}
    </div>
  );
};

export default Favoritos;