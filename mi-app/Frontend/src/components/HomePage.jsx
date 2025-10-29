// mi-app/src/components/HomePage.jsx (REEMPLAZAR CON ESTO)

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {

  // --- Estilos ---
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed', 
    height: '100vh', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    padding: '70px 20px 0 20px', 
    boxSizing: 'border-box',
  };

  const heroLogo = {
    height: 'clamp(80px, 15vw, 150px)', 
    width: 'auto',
    marginBottom: '20px',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' 
  };
  
  const heroTitle = {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  };

  const heroSubtitle = {
    fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
    margin: '0 0 40px 0',
    maxWidth: '700px',
    opacity: 0.9
  };

  const heroButton = {
    padding: '15px 30px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'white',
    // --- 👇 LÍNEA MODIFICADA ---
    background: 'linear-gradient(135deg, #4a5c36 0%, #8b5a2b 100%)', // Verde y Marrón
    border: 'none',
    borderRadius: '50px',
    textDecoration: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  };

  const storySection = {
    padding: '60px 30px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#fff',
    color: '#2c3e50',
    lineHeight: '1.8',
    fontSize: '1.1em'
  };

  return (
    <div>
      {/* --- Sección Hero --- */}
      <div style={heroStyle}>
        <img 
          src="/logo.jpg"
          alt="CerroMap Logo" 
          style={heroLogo}
        />
        <h1 style={heroTitle}>Bienvenido a CerroMap</h1> 
        <p style={heroSubtitle}>
          Tu campamento base digital para explorar, planificar y compartir 
          tus aventuras en las montañas más icónicas de la región.
        </p>
        <Link 
          to="/senderos" 
          style={heroButton}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Explorar Senderos
        </Link>
      </div>

      {/* --- Sección de Historia (sin cambios) --- */}
      <div style={storySection}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5em', marginBottom: '30px' }}>
          Nuestra Historia
        </h2>
        <p>
          "CerroMap" nació de una charla al pie de un fogón en el Cordón del Plata...
        </p>
        <p>
          Nos preguntamos: ¿Por qué no crear un solo lugar? ...
        </p>
        <p>
          Este proyecto es nuestra respuesta...
        </p>
      </div>
    </div>
  );
};

export default HomePage;