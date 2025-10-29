// mi-app/src/App.jsx (COMPLETO CON LOGS PARA DEBUG)

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
import PremiumPage from './components/PremiumPage';

// Creamos una instancia de axios para no repetir la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
});

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // --- Estados ---
  const [cerros, setCerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Efecto para cargar cerros ---
  useEffect(() => {
    setLoading(true); // Asegura que el loading se active al inicio
    apiClient.get('/cerros')
      .then(response => {
        setCerros(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar cerros:', error);
        setLoading(false);
        // Podrías mostrar un mensaje de error o usar datos de respaldo
      });
  }, []);

  // --- Efecto para cargar usuario/favoritos desde token al inicio ---
   useEffect(() => {
    const checkToken = async () => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken && !user) {
             console.log("Token encontrado en localStorage:", storedToken);
             setToken(storedToken);
             try {
                // Opcional: Podrías añadir una ruta /auth/me para validar token y obtener usuario
                // const userResponse = await apiClient.get('/auth/me', { headers: { Authorization: `Bearer ${storedToken}` } });
                // setUser(userResponse.data); // Si tienes esa ruta
                // console.log("Usuario recuperado desde token:", userResponse.data);

                // Cargar favoritos asociados al token
                console.log("Intentando cargar favoritos con token guardado...");
                const response = await apiClient.get('/favorites', {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });
                const ids = response.data.map(fav => fav.id);
                setFavoriteIds(new Set(ids));
                console.log("Favoritos cargados desde token:", ids);

                // Si no tienes /auth/me, puedes intentar decodificar el token (necesita jwt-decode)
                // import jwt_decode from "jwt-decode";
                // try {
                //   const decodedUser = jwt_decode(storedToken);
                //   // Asegúrate que tu token JWT tenga id y username
                //   if (decodedUser.id && decodedUser.username) {
                //       setUser({ id: decodedUser.id, username: decodedUser.username });
                //       console.log("Usuario decodificado del token:", decodedUser);
                //   } else {
                //        console.warn("Token no contiene id/username esperados.");
                //        handleLogout(); // Token inválido
                //   }
                // } catch (decodeError) {
                //    console.error("Error decodificando token:", decodeError);
                //    handleLogout(); // Token inválido
                // }

             } catch (error) {
                 console.error("Error al cargar favoritos/validar token guardado:", error.response?.data || error.message);
                 if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.log("Token inválido o expirado, limpiando...");
                    handleLogout(); // Limpia token inválido
                 }
             }
        } else if (!storedToken) {
             console.log("No hay token guardado.");
             setFavoriteIds(new Set()); // Asegura limpiar favoritos si no hay token
        }
    };
    checkToken();
  }, []); // Solo se ejecuta una vez al montar

  // --- Efecto para recargar favoritos si 'user' o 'token' cambian (ej. post-login) ---
   useEffect(() => {
     // Solo recarga si hay usuario Y token (evita recarga inicial redundante)
     if (user && token && favoriteIds.size === 0) { // Recarga solo si favs están vacíos (asumiendo que checkToken falló o es post-login)
       console.log("Usuario y token presentes, recargando favoritos...");
       apiClient.get('/favorites', {
         headers: { Authorization: `Bearer ${token}` }
       })
       .then(response => {
         const ids = response.data.map(fav => fav.id);
         setFavoriteIds(new Set(ids));
         console.log("Favoritos recargados:", ids);
       })
       .catch(error => {
         console.error("Error al recargar favoritos:", error.response?.data || error.message);
         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
           handleLogout();
         }
       });
     } else if (!token && favoriteIds.size > 0) { // Si se cierra sesión y aún hay favs
          console.log("Token ausente, limpiando IDs de favoritos.");
          setFavoriteIds(new Set()); // Limpia visualmente
     }
   }, [user, token]); // Depende de user y token


  // --- Funciones del Modal ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenLoginModal = () => {
    console.log("Abriendo modal de Login");
    setIsLogin(true);
    setMessage('');
    setForm({ username: '', email: '', password: '' }); // Reset form
    setIsModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    console.log("Abriendo modal de Registro");
    setIsLogin(false);
    setMessage('');
    setForm({ username: '', email: '', password: '' }); // Reset form
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Cerrando modal");
    setIsModalOpen(false);
    setMessage(''); // Limpia mensajes al cerrar
  };

  // --- handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Limpia mensaje anterior
    console.log(`[App] handleSubmit called. isLogin: ${isLogin}, Form data:`, form);
    try {
      const url = isLogin ? '/auth/login' : '/auth/register';
      const dataToSend = isLogin
        ? { username: form.username, password: form.password }
        : { username: form.username, email: form.email, password: form.password }; // Asegura enviar email en registro

       console.log("[App] Enviando datos al backend:", url, dataToSend);
      const response = await apiClient.post(url, dataToSend);
      console.log("[App] Respuesta del backend:", response.data);

      if (isLogin) {
        if (response.data.user && response.data.token) {
            console.log("[App] Login exitoso. User:", response.data.user);
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('authToken', response.data.token);
            setMessage('✅ Sesión iniciada correctamente');
            handleCloseModal();
        } else {
             console.error("[App] Respuesta de login inesperada:", response.data);
             setMessage('❌ Error: Respuesta inesperada del servidor.');
        }
      } else { // Si fue registro
        console.log("[App] Registro exitoso.");
        setMessage('✅ Usuario registrado, ahora iniciá sesión');
        setIsLogin(true); // Cambia a modo login
        // Mantenemos username y password para facilitar login, limpiamos email
        setForm(prevForm => ({ ...prevForm, email: '' }));
      }
    } catch (err) {
      console.error("[App] Error en handleSubmit:", err.response || err.message || err);
      const errorMsg = err.response?.data?.error || err.message || 'Error desconocido';
      setMessage(`❌ Error: ${errorMsg}`);
    }
  };

  // --- handleLogout ---
  const handleLogout = () => {
    console.log("[App] handleLogout llamado.");
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    setFavoriteIds(new Set()); // Limpia favoritos visualmente
    setMessage('👋 Sesión cerrada');
    console.log("Sesión cerrada y token limpiado.");
  };

  // --- addToFavorites CON LOGS ---
  const addToFavorites = async (cerroId) => {
    console.log(`[App] addToFavorites called with cerroId: ${cerroId}. Token exists: ${!!token}`); // DEBUG LOG
    if (!token) {
      console.warn("[App] No token, cannot add favorite. Opening login modal."); // DEBUG LOG
      handleOpenLoginModal();
      return;
    }
    console.log("[App] Attempting API POST request to /favorites/" + cerroId); // DEBUG LOG
    try {
      const response = await apiClient.post(`/favorites/${cerroId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[App] API POST successful:", response.data); // DEBUG LOG
      setFavoriteIds(prevIds => {
          const newIds = new Set(prevIds).add(cerroId);
          console.log("[App] Updated favoriteIds state (added):", newIds); // DEBUG LOG
          return newIds;
      });
    } catch (error) {
      console.error("[App] Error adding favorite via API:", error.response?.data || error.message || error); // DEBUG LOG
       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log("[App] Auth error (401/403) detected, logging out."); // DEBUG LOG
          handleLogout();
        } else {
          setMessage(`❌ Error al añadir favorito: ${error.response?.data?.error || error.message}`);
        }
    }
  };

  // --- removeFromFavorites CON LOGS ---
  const removeFromFavorites = async (cerroId) => {
    console.log(`[App] removeFromFavorites called with cerroId: ${cerroId}. Token exists: ${!!token}`); // DEBUG LOG
    if (!token) {
        console.warn("[App] No token, cannot remove favorite."); // DEBUG LOG
        return;
    }
    console.log("[App] Attempting API DELETE request to /favorites/" + cerroId); // DEBUG LOG
    try {
      const response = await apiClient.delete(`/favorites/${cerroId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[App] API DELETE successful:", response.data); // DEBUG LOG
      setFavoriteIds(prevIds => {
        const newIds = new Set(prevIds);
        const deleted = newIds.delete(cerroId); // delete retorna true si algo fue eliminado
        if (deleted) {
           console.log("[App] Updated favoriteIds state (removed):", newIds); // DEBUG LOG
        } else {
            console.warn("[App] Tried to remove ID not in set:", cerroId); // DEBUG LOG
        }
        return newIds;
      });
    } catch (error) {
      console.error("[App] Error removing favorite via API:", error.response?.data || error.message || error); // DEBUG LOG
       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log("[App] Auth error (401/403) detected, logging out."); // DEBUG LOG
          handleLogout();
        } else {
           setMessage(`❌ Error al quitar favorito: ${error.response?.data?.error || error.message}`);
        }
    }
  };

  // --- Estilos ---
  const inputStyle = {
    display: 'block',
    width: '100%',
    margin: '10px 0',
    padding: '12px',
    fontSize: '1em',
    border: '2px solid #ddd',
    borderRadius: '10px',
    boxSizing: 'border-box'
   };
  const btnStyle = {
    backgroundColor: '#4a5c36', // Verde oscuro
    color: 'white',
    border: 'none',
    padding: '12px 15px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
    fontSize: '1.1em',
    fontWeight: 'bold',
    boxSizing: 'border-box'
   };


  // --- Loading ---
  if (loading && cerros.length === 0) { // Muestra loading solo si aún no hay cerros
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontSize: '2em' }}>
        ⏳ Cargando aplicación...
      </div>
    );
  }

  // --- Filtrar favoritos ---
  // Asegura que cerros no sea undefined antes de filtrar
  const favoriteCerroObjects = cerros && cerros.length > 0
    ? cerros.filter(cerro => favoriteIds.has(cerro.id))
    : [];


  return (
    <div className="app-container" style={{ paddingTop: isHomePage ? '0' : '80px' }}>

      <Navbar
        user={user}
        handleLogout={handleLogout}
        onLoginClick={handleOpenLoginModal}
        onRegisterClick={handleOpenRegisterModal}
      />

      {/* Muestra mensaje global brevemente */}
       {message && message.startsWith('❌ Error:') && (
           <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: '#f8d7da', color: '#721c24', padding: '10px 20px', borderRadius: '8px', zIndex: 10001, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
               {message}
           </div>
       )}

      {isModalOpen && (
        <AuthModal
          onClose={handleCloseModal}
          form={form}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          message={message} // Pasamos el mensaje al modal también
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          inputStyle={inputStyle}
          btnStyle={btnStyle}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/senderos"
          element={
            <CerrosList
              cerros={cerros}
              user={user}
              favoriteIds={favoriteIds}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
              onLoginClick={handleOpenLoginModal}
            />
          }
        />
        <Route path="/mapa" element={<MapaCerros cerros={cerros} />} />
        <Route
          path="/cerro/:id"
          element={
            <DetalleCerro
              user={user}
              favoriteIds={favoriteIds}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
               onLoginClick={handleOpenLoginModal}
            />
           }
        />
        <Route
          path="/favoritos"
          element={
            <Favoritos
              // Pasamos los objetos completos, no solo IDs
              favoriteCerros={favoriteCerroObjects}
              removeFromFavorites={removeFromFavorites}
              user={user}
              onLoginClick={handleOpenLoginModal}
            />
          }
        />
        <Route path="/cargar" element={<CargarCerro />} />
        <Route path="/premium" element={<PremiumPage />} />
      </Routes>
    </div>
  );
}

export default App;