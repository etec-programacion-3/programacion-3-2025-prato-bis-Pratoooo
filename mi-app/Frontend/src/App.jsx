// mi-app/src/App.jsx (REEMPLAZAR CON ESTO)

import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; 
import axios from 'axios';

import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import DetalleCerro from './components/DetalleCerro';
import CerrosList from './components/CerrosList';
import MapaCerros from './components/MapaCerros';
import Favoritos from './components/Favoritos';
import CargarCerro from './components/CargarCerro';
import HomePage from './components/HomePage'; 

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // --- Estados (sin cambios) ---
  const [cerros, setCerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- useEffect (sin cambios) ---
  useEffect(() => {
    axios.get('http://localhost:3001/cerros')
      .then(response => {
        setCerros(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar cerros:', error);
        setLoading(false);
      });
  }, []);

  // --- Todas tus funciones (handleChange, handleSubmit, etc. SIN CAMBIOS) ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleOpenLoginModal = () => {
    setIsLogin(true);
    setMessage('');
    setForm({ username: '', email: '', password: '' });
    setIsModalOpen(true);
  };
  
  const handleOpenRegisterModal = () => {
    setIsLogin(false);
    setMessage('');
    setForm({ username: '', email: '', password: '' });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? 'http://localhost:3001/auth/login'
        : 'http://localhost:3001/auth/register';
      const dataToSend = isLogin 
        ? { username: form.username, password: form.password } 
        : form;
      const response = await axios.post(url, dataToSend);
      if (isLogin) {
        setUser(response.data.user);
        setMessage('✅ Sesión iniciada correctamente');
        handleCloseModal();
      } else {
        setMessage('✅ Usuario registrado, ahora iniciá sesión');
        setIsLogin(true);
        setForm(prevForm => ({ ...prevForm, email: '' }));
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error: ' + (err.response?.data?.error || 'Intentalo de nuevo'));
    }
  };
  
  const handleLogout = () => {
    setUser(null);
    setMessage('👋 Sesión cerrada');
  };

  const inputStyle = { /* ... */ };
  const btnStyle = { /* ... */ };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontSize: '2em' }}>
        ⏳ Cargando aplicación...
      </div>
    );
  }

  return (
    // --- 👇 LÍNEA MODIFICADA (revertida) ---
    // Volvemos el padding a 80px (70px de la barra + 10px de espacio)
    <div className="app-container" style={{ paddingTop: isHomePage ? '0' : '80px' }}> 
      
      <Navbar 
        user={user} 
        handleLogout={handleLogout} 
        onLoginClick={handleOpenLoginModal}
        onRegisterClick={handleOpenRegisterModal}
      />

      {isModalOpen && (
        <AuthModal
          onClose={handleCloseModal}
          form={form}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          message={message}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          inputStyle={inputStyle}
          btnStyle={btnStyle}
        />
      )}

      {/* --- Rutas (sin cambios) --- */}
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/senderos" element={<CerrosList />} /> 
        <Route path="/mapa" element={<MapaCerros cerros={cerros} />} />
        <Route path="/cerro/:id" element={<DetalleCerro />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/cargar" element={<CargarCerro />} />
      </Routes>
    </div>
  );
}

export default App;