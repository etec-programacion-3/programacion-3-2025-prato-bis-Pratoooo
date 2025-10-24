// mi-app/src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // 👈 AÑADIR ESTA LÍNEA
import axios from 'axios';
import CerrosList from './components/CerrosList';
import MapaCerros from './components/MapaCerros';
import DetalleCerro from './components/DetalleCerro'; // 👈 AÑADIR ESTA LÍNEA (lo creamos en Paso 5)

function App() {
  const [cerros, setCerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  // 🔹 Cargar cerros
  useEffect(() => {
    axios.get('http://localhost:3001/cerros')
      .then(response => {
        console.log('Cerros cargados:', response.data);
        setCerros(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar cerros:', error);
        setLoading(false);
      });
  }, []);

  // 🔹 Manejar formulario (sin cambios)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Registrar o iniciar sesión (sin cambios)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? 'http://localhost:3001/auth/login'
        : 'http://localhost:3001/auth/register';

      const response = await axios.post(url, form);

      if (isLogin) {
        setUser(form.username);
        setMessage('✅ Sesión iniciada correctamente');
      } else {
        setMessage('✅ Usuario registrado, ahora iniciá sesión');
        setIsLogin(true);
      }

      setForm({ username: '', password: '' });
    } catch (err) {
      console.error(err);
      setMessage('❌ Error: ' + (err.response?.data?.error || 'Intentalo de nuevo'));
    }
  };

  // 🔹 Cerrar sesión (sin cambios)
  const handleLogout = () => {
    setUser(null);
    setMessage('👋 Sesión cerrada');
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '60px', 
        textAlign: 'center',
        fontSize: '2em' 
      }}>
        ⏳ Cargando aplicación...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* 🔸 Contenido principal (AHORA ES DINÁMICO) */}
      <div style={{ flex: 1, padding: '20px' }}>
        
        {/* 👇 AQUÍ ESTÁ LA MAGIA DE LAS RUTAS 👇 */}
        <Routes>
          {/* Ruta 1: La Home (lo que ya tenías) */}
          <Route path="/" element={
            <>
              <CerrosList />
              <MapaCerros cerros={cerros} />
            </>
          } />

          {/* Ruta 2: La nueva página de detalle */}
          <Route path="/cerro/:id" element={<DetalleCerro />} />

        </Routes>
        {/* 👆 FIN DE LAS RUTAS 👆 */}

      </div>

      {/* 🔸 Sidebar de usuario (ESTO QUEDA IDÉNTICO) */}
      <div style={{
        width: '300px',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderLeft: '2px solid #ccc'
      }}>
        {user ? (
          <div>
            <h3>👤 Tu cuenta</h3>
            <p><b>Usuario:</b> {user}</p>
            <button onClick={handleLogout} style={btnStyle}>Cerrar sesión</button>

            <hr />
            <h4>🌄 Tus cerros favoritos</h4>
            <p>(Aún no hay cerros favoritos)</p>
          </div>
        ) : (
          <div>
            <h3>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={form.username}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <button type="submit" style={btnStyle}>
                {isLogin ? 'Entrar' : 'Registrarse'}
              </button>
            </form>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ ...btnStyle, backgroundColor: '#888' }}
            >
              {isLogin ? 'Crear cuenta nueva' : 'Ya tengo cuenta'}
            </button>
            {message && <p style={{ marginTop: '10px', color: 'blue' }}>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// 🔹 Estilos (sin cambios)
const inputStyle = {
  display: 'block',
  width: '100%',
  margin: '10px 0',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const btnStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '10px'
};

export default App;