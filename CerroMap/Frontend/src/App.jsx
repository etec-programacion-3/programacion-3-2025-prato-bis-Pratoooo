// mi-app/src/App.jsx (COMPLETO CON LOGS Y DELETE)

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
    setLoading(true); 
    apiClient.get('/cerros')
      .then(response => {
        setCerros(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar cerros:', error);
        setLoading(false);
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
                // (Opcional) /auth/me para validar token y obtener usuario
                // const userResponse = await apiClient.get('/auth/me', { headers: { Authorization: `Bearer ${storedToken}` } });
                // setUser(userResponse.data); 
                // console.log("Usuario recuperado desde token:", userResponse.data);


                // Cargar favoritos asociados al token
                console.log("Intentando cargar favoritos con token guardado...");
                const response = await apiClient.get('/favorites', {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });
                // ¡CORRECCIÓN IMPORTANTE! Tus favoritos vienen como objetos de cerros
                // La ruta GET /favorites devuelve el objeto cerro, no el ID
                const cerrosFavoritos = response.data;
                const ids = cerrosFavoritos.map(fav => fav.id);
                setFavoriteIds(new Set(ids));
                console.log("Favoritos cargados desde token:", ids);

             } catch (error) {
                 console.error("Error al cargar favoritos/validar token guardado:", error.response?.data || error.message);
                 if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.log("Token inválido o expirado, limpiando...");
                    handleLogout(); // Limpia token inválido
                 }
             }
        } else if (!storedToken) {
             console.log("No hay token guardado.");
             setFavoriteIds(new Set()); 
        }
    };
    checkToken();
  }, []); // Solo se ejecuta una vez al montar

  // --- Efecto para recargar favoritos si 'user' o 'token' cambian (ej. post-login) ---
   useEffect(() => {
     if (user && token) { 
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
     } else if (!token && favoriteIds.size > 0) { 
          console.log("Token ausente, limpiando IDs de favoritos.");
          setFavoriteIds(new Set()); 
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
    setForm({ username: '', email: '', password: '' }); 
    setIsModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    console.log("Abriendo modal de Registro");
    setIsLogin(false);
    setMessage('');
    setForm({ username: '', email: '', password: '' }); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Cerrando modal");
    setIsModalOpen(false);
    setMessage(''); 
  };

  // --- handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 
    console.log(`[App] handleSubmit called. isLogin: ${isLogin}, Form data:`, form);
    try {
      const url = isLogin ? '/auth/login' : '/auth/register';
      const dataToSend = isLogin
        ? { username: form.username, password: form.password }
        : { username: form.username, email: form.email, password: form.password }; 

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
            // Los favoritos se recargarán por el useEffect [user, token]
        } else {
             console.error("[App] Respuesta de login inesperada:", response.data);
             setMessage('❌ Error: Respuesta inesperada del servidor.');
        }
      } else { // Si fue registro
        console.log("[App] Registro exitoso.");
        setMessage('✅ Usuario registrado, ahora iniciá sesión');
        setIsLogin(true); // Cambia a modo login
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

  // --- addToFavorites ---
  const addToFavorites = async (cerroId) => {
    console.log(`[App] addToFavorites called with cerroId: ${cerroId}. Token exists: ${!!token}`); 
    if (!token) {
      console.warn("[App] No token, cannot add favorite. Opening login modal."); 
      handleOpenLoginModal();
      return;
    }
    console.log("[App] Attempting API POST request to /favorites/" + cerroId); 
    try {
      const response = await apiClient.post(`/favorites/${cerroId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[App] API POST successful:", response.data); 
      
      // La API (corregida) ahora devuelve el objeto cerro
      // const cerroAgregado = response.data; 
      
      setFavoriteIds(prevIds => {
          // Usamos el cerroId que pasamos, es más simple
          const newIds = new Set(prevIds).add(cerroId);
          console.log("[App] Updated favoriteIds state (added):", newIds); 
          return newIds;
      });
    } catch (error) {
      console.error("[App] Error adding favorite via API:", error.response?.data || error.message || error); 
       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log("[App] Auth error (401/403) detected, logging out."); 
          handleLogout();
        } else {
          setMessage(`❌ Error al añadir favorito: ${error.response?.data?.error || error.message}`);
        }
    }
  };

  // --- removeFromFavorites ---
  const removeFromFavorites = async (cerroId) => {
    console.log(`[App] removeFromFavorites called with cerroId: ${cerroId}. Token exists: ${!!token}`); 
    if (!token) {
        console.warn("[App] No token, cannot remove favorite."); 
        return;
    }
    console.log("[App] Attempting API DELETE request to /favorites/" + cerroId); 
    try {
      const response = await apiClient.delete(`/favorites/${cerroId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[App] API DELETE successful:", response.data); 
      setFavoriteIds(prevIds => {
        const newIds = new Set(prevIds);
        const deleted = newIds.delete(cerroId); 
        if (deleted) {
           console.log("[App] Updated favoriteIds state (removed):", newIds); 
        } else {
            console.warn("[App] Tried to remove ID not in set:", cerroId); 
        }
        return newIds;
      });
    } catch (error) {
      console.error("[App] Error removing favorite via API:", error.response?.data || error.message || error); 
       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log("[App] Auth error (401/403) detected, logging out."); 
          handleLogout();
        } else {
           setMessage(`❌ Error al quitar favorito: ${error.response?.data?.error || error.message}`);
        }
    }
  };

  // --- 👇 NUEVA FUNCIÓN ---
  const handleDeleteCerro = async (cerroId) => {
    console.log(`[App] handleDeleteCerro called for cerroId: ${cerroId}`);
    
    if (!token) {
      console.warn("[App] No token, cannot delete cerro. Opening login modal.");
      handleOpenLoginModal();
      return;
    }

    // ¡Preguntamos antes de borrar!
    // Usamos 'confirm' de window. Es simple y bloquea la ejecución.
    if (!window.confirm("¿Estás seguro de que quieres eliminar este cerro de la base de datos? Esta acción no se puede deshacer.")) {
      console.log("[App] Borrado cancelado por el usuario.");
      return; 
    }

    console.log(`[App] Attempting API DELETE request to /cerros/${cerroId}`);
    try {
      // 1. Llamamos a la nueva ruta del backend
      const response = await apiClient.delete(`/cerros/${cerroId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const deletedId = response.data.deletedCerroId; // Obtenemos el ID desde la respuesta
      console.log("[App] API DELETE successful:", response.data);

      // 2. Actualizamos el estado de 'cerros' (quitamos el borrado)
      setCerros(prevCerros => {
        const newCerros = prevCerros.filter(c => c.id !== deletedId);
        console.log("[App] Updated 'cerros' state (removed).");
        return newCerros;
      });

      // 3. (Limpieza) También lo quitamos del estado de favoritos si estaba
      setFavoriteIds(prevIds => {
        if (prevIds.has(deletedId)) {
          const newIds = new Set(prevIds);
          newIds.delete(deletedId);
          console.log("[App] Removed from 'favoriteIds' state as well.");
          return newIds;
        }
        return prevIds; // Devuelve los IDs sin cambios si no estaba
      });

    } catch (error) {
      console.error("[App] Error deleting cerro via API:", error.response?.data || error.message);
      setMessage(`❌ Error al eliminar cerro: ${error.response?.data?.error || error.message}`);
       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleLogout();
       }
    }
  };
  
  // --- Función para CargarCerro ---
  const handleCerroAdded = (newCerro) => {
    console.log("[App] handleCerroAdded called with:", newCerro);
    setCerros(prevCerros => {
        const updatedCerros = [...prevCerros, newCerro];
        console.log("[App] 'cerros' state updated with new cerro.");
        return updatedCerros;
    });
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
  if (loading && cerros.length === 0) { 
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontSize: '2em' }}>
        ⏳ Cargando aplicación...
      </div>
    );
  }

  // --- Filtrar favoritos ---
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
          message={message} 
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
              handleDeleteCerro={handleDeleteCerro} // <-- PROP NUEVA
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
               // Podrías pasar 'handleDeleteCerro' aquí también
               // handleDeleteCerro={handleDeleteCerro} 
            />
           }
        />
        <Route
          path="/favoritos"
          element={
            <Favoritos
              favoriteCerros={favoriteCerroObjects}
              removeFromFavorites={removeFromFavorites}
              user={user}
              onLoginClick={handleOpenLoginModal}
            />
          }
        />
        <Route 
            path="/cargar" 
            element={
                <CargarCerro 
                    onCerroAdded={handleCerroAdded} 
                    // Necesitamos pasar el token para saber si mostrar el form
                    // o pedir login.
                    token={token}
                    onLoginClick={handleOpenLoginModal}
                />
            } 
        />
        <Route path="/premium" element={<PremiumPage />} />
      </Routes>
    </div>
  );
}

export default App;