// mi-app/src/components/HomePage.jsx (REEMPLAZAR CON ESTO)

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {

  // --- Estilos (sin cambios) ---
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
    background: 'linear-gradient(135deg, #4a5c36 0%, #8b5a2b 100%)', 
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

  // --- 👇 NUEVOS ESTILOS PARA LA SECCIÓN "ENCUÉNTRANOS" ---
  const contactSection = {
    backgroundColor: '#f5f5f5', // Fondo gris claro
    padding: '60px 30px',
    textAlign: 'center',
    color: '#333' // Color de texto oscuro
  };
  
  const contactTitle = {
    fontSize: '2.5em',
    color: '#4a5c36', // Verde oscuro del logo
    marginBottom: '30px'
  };

  const socialLinks = {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px', // Espacio entre íconos/links
    marginTop: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap' // Para que se adapte en pantallas chicas
  };

  const socialLink = {
    color: '#8b5a2b', // Marrón del logo
    textDecoration: 'none',
    fontSize: '1.2em',
    fontWeight: 'bold',
    transition: 'color 0.3s'
  };
  // --- 👆 FIN DE NUEVOS ESTILOS ---

  return (
    <div>
      {/* --- Sección Hero (sin cambios) --- */}
      <div style={heroStyle}>
        <img src="/logo.jpg" alt="CerroMap Logo" style={heroLogo} />
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
          Con mi papa escontramos que no hay ninguna aplicacion que aparezcan todos los cerros de mendoza, la mas parecida es WikiLoc y muchas funciones tenes que tener premiun para usarlas.
        </p>
        <p>
          Asi nacio "CerroMap" tratando de solucionar este problema que tienen los mendocinos y extranjeros para ver la ruta de un cerro o sendero. Nuestra idea es poder tener la mayor cantidad de cerros cargados en la aplicacion, que los usuarios tambien pueden cargarlos.
        </p>
        <p>
          Esta pagina es un prototipo de como queremos que quede la WEB, estamos trabajando en un nuevo idioma de programacion que es KMP, usando estas tecnologias, nos permitira tener la aplicacion para celulares y computadoras.
        </p>
      </div>

      {/* --- 👇 NUEVA SECCIÓN "ENCUÉNTRANOS" --- */}
      <div style={contactSection}>
        <h2 style={contactTitle}>📍 Encuéntranos</h2>
        <p style={{ fontSize: '1.1em', maxWidth: '600px', margin: '0 auto 30px auto' }}>
          ¿Tenés dudas, sugerencias o simplemente querés charlar sobre montañas? 
          ¡Contactate con nosotros!
        </p>
        <div style={socialLinks}>
          {/* Reemplaza '#' con tus links reales */}
          <a href="#" style={socialLink} onMouseEnter={(e) => e.target.style.color = '#4a5c36'} onMouseLeave={(e) => e.target.style.color = '#8b5a2b'}>
            📷 Instagram
          </a>
          <a href="#" style={socialLink} onMouseEnter={(e) => e.target.style.color = '#4a5c36'} onMouseLeave={(e) => e.target.style.color = '#8b5a2b'}>
            👍 Facebook
          </a>
          <a href="#" style={socialLink} onMouseEnter={(e) => e.target.style.color = '#4a5c36'} onMouseLeave={(e) => e.target.style.color = '#8b5a2b'}>
            🐦 Twitter
          </a>
        </div>
        <p style={{ fontSize: '1.1em' }}>
          O envíanos un email a: 
          <a href="mailto:info@cerromap.com" style={{...socialLink, marginLeft: '10px'}} onMouseEnter={(e) => e.target.style.color = '#4a5c36'} onMouseLeave={(e) => e.target.style.color = '#8b5a2b'}>
            info@cerromap.com
          </a>
        </p>
      </div>
      {/* --- 👆 FIN DE NUEVA SECCIÓN --- */}

    </div>
  );
};

export default HomePage;