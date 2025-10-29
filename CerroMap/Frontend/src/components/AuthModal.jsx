// mi-app/src/components/AuthModal.jsx (REEMPLAZAR CON ESTO)

import React from 'react';

// Recibimos todas las props de App.jsx
const AuthModal = ({
  onClose,
  form,
  isLogin,
  setIsLogin,
  message,
  handleChange,
  handleSubmit,
  inputStyle,
  btnStyle
}) => {

  // --- Estilos para el Modal (COMPLETOS) ---
  const modalBackdrop = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 10000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalContent = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    width: '400px',
    maxWidth: '90%',
    position: 'relative',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  };

  const closeButton = {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.8em',
    cursor: 'pointer',
    color: '#aaa',
    lineHeight: '1'
  };

  // --- Estilos del formulario (COMPLETOS) ---
  const formTitle = {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '1.8em',
    color: '#2c3e50'
  };

  const messageStyle = (msg) => ({
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '10px',
    backgroundColor: msg.includes('✅') ? '#d4edda' : '#f8d7da',
    color: msg.includes('✅') ? '#155724' : '#721c24',
    fontSize: '0.9em',
    textAlign: 'center'
  });

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const improvedInputStyle = {
    ...inputStyle,
    padding: '12px',
    fontSize: '1em',
    border: '2px solid #ddd',
    borderRadius: '10px',
    transition: 'border 0.3s',
    boxSizing: 'border-box', // Importante para que el padding no rompa el ancho
    width: '100%', // Asegura que ocupe el 100%
    margin: 0 // Resetea el margen
  };

  const improvedBtnStyle = {
    ...btnStyle,
    width: '100%',
    padding: '12px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    background: 'linear-gradient(135deg, #4a5c36 0%, #8b5a2b 100%)', // Verde y Marrón
    margin: 0 // Resetea el margen
  };
  
  const switchBtnContainer = {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
  };
  
  const switchBtn = {
    background: 'none',
    border: 'none',
    color: '#8b5a2b', // Marrón
    cursor: 'pointer',
    fontSize: '0.95em',
    textDecoration: 'underline'
  };


  return (
    // Fondo oscuro, al hacer clic llama a onClose
    <div style={modalBackdrop} onClick={onClose}>
      {/* Contenido del modal, evitamos que el clic se propague */}
      <div style={modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Botón de cerrar */}
        <button onClick={onClose} style={closeButton}>&times;</button>
        
        {/* --- Formulario (Copiado de tu HomeLayout) --- */}
        <div>
          <h2 style={formTitle}>
            {isLogin ? '🔐 Iniciar Sesión' : '📝 Registrarse'}
          </h2>

          {message && (
            <div style={messageStyle(message)}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={formStyle}>
            {/* Campo de Usuario */}
            <input
              type="text"
              name="username"
              placeholder="👤 Usuario"
              value={form.username}
              onChange={handleChange}
              style={improvedInputStyle}
              required
            />
            
            {/* Campo de Email (solo en registro) */}
            {!isLogin && (
              <input
                type="email"
                name="email"
                placeholder="📧 Email"
                value={form.email}
                onChange={handleChange}
                style={improvedInputStyle}
                required
              />
            )}
            
            {/* Campo de Contraseña */}
            <input
              type="password"
              name="password"
              placeholder="🔒 Contraseña"
              value={form.password}
              onChange={handleChange}
              style={improvedInputStyle}
              required
            />
            
            <button
              type="submit"
              style={improvedBtnStyle}
            >
              {isLogin ? '🚀 Entrar' : '✨ Registrar'}
            </button>
          </form>

          {/* Botón para cambiar entre Login y Registro */}
          <div style={switchBtnContainer}>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                if (!isLogin) {
                  handleChange({ target: { name: 'email', value: '' } });
                }
              }}
              style={switchBtn} 
            >
              {isLogin 
                ? '¿No tenés cuenta? Registrate aquí' 
                : '¿Ya tenés cuenta? Iniciá sesión'}
            </button>
          </div>
        </div>
        {/* --- Fin del formulario --- */}

      </div>
    </div>
  );
};

export default AuthModal;