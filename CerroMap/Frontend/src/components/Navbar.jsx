// mi-app/src/components/Navbar.jsx (REEMPLAZAR CON ESTO)

import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'; 

const Navbar = ({ user, handleLogout, onLoginClick, onRegisterClick }) => {
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Estilo para los botones (TU CÓDIGO EXACTO)
  const authBtnStyle = {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: isNarrow ? '6px 10px' : '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: isNarrow ? '0.8em' : '0.85em',
    transition: 'all 0.3s'
  };
  const userMenuButton = {
    ...authBtnStyle,
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };
  const dropdownMenu = {
    position: 'absolute',
    top: isNarrow ? '55px' : '65px', 
    right: 0,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 100,
    overflow: 'hidden',
    minWidth: '180px'
  };
  const dropdownItem = {
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    color: '#333',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.95em',
    boxSizing: 'border-box'
  };


  return (
    <nav style={{
      background: 'linear-gradient(135deg, #4a5c36 0%, #8b5a2b 100%)', // Verde oscuro y Marrón
      padding: isNarrow ? '12px 20px' : '15px 40px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      height: isNarrow ? '60px' : '70px', 
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        
        {/* --- Logo (TU CÓDIGO EXACTO) --- */}
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1 style={{
            margin: 0,
            fontSize: isNarrow ? '1.5em' : '2em', 
            fontWeight: 'bold'
          }}>
            CerroMap
          </h1>
        </Link>

        {/* --- Links --- */}
        <div style={{
          display: 'flex',
          gap: isNarrow ? '8px' : '15px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Link Senderos (TU CÓDIGO EXACTO) */}
          <Link 
            to="/senderos" 
            style={{...authBtnStyle, textDecoration: 'none'}}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            📋 Senderos
          </Link>
          {/* Link Mapa (TU CÓDIGO EXACTO) */}
          <Link 
            to="/mapa" 
            style={{...authBtnStyle, textDecoration: 'none'}}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            🗺️ Mapa
          </Link>
          
          {/* --- 👇 LINK PREMIUM AÑADIDO --- */}
          <Link 
            to="/premium" 
            style={{
              ...authBtnStyle, // Usa el mismo estilo base
              textDecoration: 'none', 
              background: 'rgba(255, 215, 0, 0.2)' // Fondo dorado suave
            }} 
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 215, 0, 0.3)'} // Efecto hover
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 215, 0, 0.2)'} // Volver al normal
          >
            💎 Premium
          </Link>
          {/* --- 👆 FIN LINK PREMIUM AÑADIDO --- */}

          {/* --- Lógica de Login/Logout (TU CÓDIGO EXACTO) --- */}
          {user ? (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                style={userMenuButton}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                👤 {user.username || user} <span>▼</span>
              </button>
              {isMenuOpen && (
                <div style={dropdownMenu}>
                  <Link 
                    to="/favoritos" 
                    style={dropdownItem} 
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    ❤️ Mis Favoritos
                  </Link>
                  <Link 
                    to="/cargar" 
                    style={dropdownItem} 
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    ➕ Cargar Cerro
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    style={{...dropdownItem, borderTop: '1px solid #eee', color: '#e74c3c' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={onLoginClick} 
                style={authBtnStyle}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              > 
                Iniciar Sesión 
              </button>
              <button 
                onClick={onRegisterClick} 
                style={authBtnStyle}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              > 
                Registrarse 
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;