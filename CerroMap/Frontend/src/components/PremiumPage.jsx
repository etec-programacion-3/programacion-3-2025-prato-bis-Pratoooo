// mi-app/src/components/PremiumPage.jsx (REEMPLAZAR CON ESTO)

import React from 'react';

const PremiumPage = () => {

  // --- Estilos ---
  const pageStyle = {
    padding: '40px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
    color: '#333'
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    color: '#4a5c36', // Verde oscuro
    marginBottom: '20px'
  };

  const subtitleStyle = {
    fontSize: 'clamp(1rem, 3vw, 1.3rem)',
    color: '#555',
    marginBottom: '50px',
    maxWidth: '700px',
    margin: '0 auto 50px auto'
  };

  const plansContainer = {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap'
  };

  const planCard = (isPopular = false) => ({
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    width: '300px',
    boxShadow: isPopular ? '0 10px 30px rgba(74, 92, 54, 0.3)' : '0 5px 15px rgba(0,0,0,0.1)',
    border: isPopular ? '3px solid #4a5c36' : '1px solid #eee',
    position: 'relative',
    transform: isPopular ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex', // Añadido para alinear botón abajo
    flexDirection: 'column' // Añadido para alinear botón abajo
  });

  const popularBadge = {
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#4a5c36',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.8em',
    fontWeight: 'bold'
  };

  const planTitle = {
    fontSize: '1.8em',
    color: '#8b5a2b', // Marrón
    marginBottom: '10px'
  };

  const planPrice = {
    fontSize: '2.5em',
    fontWeight: 'bold',
    color: '#4a5c36',
    margin: '20px 0'
  };

  const planFrequency = {
    fontSize: '0.9em',
    color: '#777'
  };

  const planFeatures = {
    listStyle: 'none',
    padding: '0',
    margin: '30px 0',
    textAlign: 'left',
    color: '#555',
    flexGrow: 1 // Añadido para empujar botón abajo
  };

  const featureItem = {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  // --- 👇 ESTILO DEL BOTÓN MODIFICADO ---
  const subscribeButton = (isPopular = false) => ({
    display: 'inline-block',
    width: '100%',
    padding: '15px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: 'white',
    // Si es popular, usa el gradiente. Si no, usa el verde sólido.
    background: isPopular ? 'linear-gradient(135deg, #4a5c36 0%, #8b5a2b 100%)' : '#4a5c36',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.2s',
    marginTop: 'auto'
  });

  // --- Función placeholder (sin cambios) ---
  const handleSubscribe = (plan) => {
    alert(`Has seleccionado el plan ${plan}. \n¡Próximamente integración con pasarela de pagos!`);
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>💎 Planes Premium CerroMap</h1>
      <p style={subtitleStyle}>
        Desbloquea funciones exclusivas para llevar tus exploraciones al siguiente nivel.
        Mapas offline, rutas avanzadas, pronósticos detallados y más.
      </p>

      <div style={plansContainer}>
        {/* --- Plan Mensual --- */}
        <div style={planCard()}>
          <h2 style={planTitle}>Explorador Mensual</h2>
          <div style={planPrice}>$5 <span style={planFrequency}>/ mes</span></div>
          <ul style={planFeatures}>
            <li style={featureItem}>✔️ Acceso a todas las rutas</li>
            <li style={featureItem}>✔️ Mapas base detallados</li>
            <li style={featureItem}>✔️ Guardar cerros favoritos</li>
            <li style={featureItem}>❌ Mapas offline</li>
            <li style={featureItem}>❌ Pronóstico extendido</li>
          </ul>
          {/* Aplicamos el estilo modificado */}
          <button
            style={subscribeButton(false)} // isPopular = false
            onClick={() => handleSubscribe('Mensual')}
            // Efecto hover para el botón no popular
            onMouseEnter={(e) => e.target.style.background = '#a0714f'} // Marrón más claro
            onMouseLeave={(e) => e.target.style.background = '#4a5c36'} // Verde oscuro original
          >
            Suscribirse
          </button>
        </div>

        {/* --- Plan Anual (Popular) --- */}
        <div style={planCard(true)}>
          <div style={popularBadge}>Más Popular</div>
          <h2 style={planTitle}>Aventurero Anual</h2>
          <div style={planPrice}>$50 <span style={planFrequency}>/ año</span></div>
           <p style={{color: '#4a5c36', fontWeight: 'bold'}}>(¡Ahorra $10!)</p>
          <ul style={planFeatures}>
            <li style={featureItem}>✔️ Acceso a todas las rutas</li>
            <li style={featureItem}>✔️ Mapas base detallados</li>
            <li style={featureItem}>✔️ Guardar cerros favoritos</li>
            <li style={featureItem}>✔️ Mapas offline</li>
            <li style={featureItem}>✔️ Pronóstico extendido</li>
          </ul>
           {/* Aplicamos el estilo modificado */}
          <button
            style={subscribeButton(true)} // isPopular = true
            onClick={() => handleSubscribe('Anual')}
            // Efecto hover para el botón popular
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Suscribirse Ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;