import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Creamos una instancia de axios
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
});

// --- 👇 Recibimos 'token' y 'onLoginClick' ---
const CargarCerro = ({ onCerroAdded, token, onLoginClick }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    altura: '',
    provincia: '',
    descripcion: '',
    imagen: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); // Hook para redirigir

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!token) {
        setError('Debes estar logueado para cargar un cerro.');
        onLoginClick(); // Abre el modal de login
        return;
    }

    if (!formData.nombre || !formData.altura) {
      setError('El nombre y la altura son obligatorios.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setMessage('');

    console.log("Enviando datos al backend:", formData);

    try {
      // Usamos la ruta POST /cerros
      // La API ahora requiere un token, así que lo añadimos
      const response = await apiClient.post('/cerros', formData, {
         headers: { Authorization: `Bearer ${token}` } // <-- ¡IMPORTANTE!
      });
      
      const newCerro = response.data;
      console.log("Respuesta del backend (nuevo cerro):", newCerro);
      
      // Llamamos a la función de App.jsx para actualizar el estado global
      onCerroAdded(newCerro);
      setMessage(`✅ ¡Cerro "${newCerro.nombre}" guardado con éxito!`);
      
      setFormData({
        nombre: '', altura: '', provincia: '', descripcion: '', imagen: ''
      });

      setTimeout(() => {
        navigate('/senderos');
      }, 2000);

    } catch (err) {
      console.error("Error al guardar el cerro:", err.response || err.message);
      // El error 401 (No autorizado) o 403 (Prohibido) vendrá aquí
      setError(err.response?.data?.error || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Estilos ---
  const formStyle = {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  };
  
  const inputStyle = {
    display: 'block',
    width: '100%',
    margin: '10px 0 20px 0',
    padding: '12px',
    fontSize: '1em',
    border: '2px solid #ddd',
    borderRadius: '10px',
    boxSizing: 'border-box'
   };
   
  const btnStyle = {
    backgroundColor: isLoading ? '#ccc' : '#4a5c36', 
    color: 'white',
    border: 'none',
    padding: '12px 15px',
    borderRadius: '10px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    marginTop: '10px',
    width: '100%',
    fontSize: '1.1em',
    fontWeight: 'bold',
    boxSizing: 'border-box'
  };
  
  const loginButtonStyle = {
       color: '#8b5a2b',
       background: 'none',
       border: 'none',
       textDecoration: 'underline',
       cursor: 'pointer',
       fontSize: '1em',
       padding: 0, 
       fontWeight: 'bold'
   };

  // --- 👇 VERIFICACIÓN DE TOKEN ---
  // Si no hay token, no mostramos el formulario
  if (!token) {
     return (
       <div style={{ padding: '40px', maxWidth: '700px', margin: '40px auto', textAlign: 'center', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
         <h1 style={{color: '#4a5c36', marginBottom: '20px'}}>🏔️ Cargar Nuevo Cerro</h1>
         <p style={{fontSize: '1.1em', color: '#555'}}>
           Debes <button onClick={onLoginClick} style={loginButtonStyle}>iniciar sesión</button> para poder cargar un nuevo cerro.
         </p>
       </div>
     );
  }

  // Si SÍ hay token, mostramos el formulario
  return (
    <div style={formStyle}>
      <h1 style={{ textAlign: 'center', color: '#4a5c36' }}>🏔️ Cargar Nuevo Cerro</h1>
      <p style={{ textAlign: 'center', color: '#555', marginTop: '-10px', marginBottom: '30px' }}>
        Añade un nuevo sendero a la base de datos.
      </p>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre del Cerro *</label>
        <input
          type="text"
          name="nombre"
          id="nombre"
          value={formData.nombre}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Ej: Cerro Aconcagua"
        />
        
        <label htmlFor="altura">Altura (en metros) *</label>
        <input
          type="number"
          name="altura"
          id="altura"
          value={formData.altura}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Ej: 6960"
        />
        
        <label htmlFor="provincia">Provincia</label>
        <input
          type="text"
          name="provincia"
          id="provincia"
          value={formData.provincia}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Ej: Mendoza"
        />
        
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          name="descripcion"
          id="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          style={{...inputStyle, height: '100px', resize: 'vertical'}}
          placeholder="Una breve descripción del sendero..."
        />
        
        <label htmlFor="imagen">URL de la Imagen</label>
        <input
          type="text"
          name="imagen"
          id="imagen"
          value={formData.imagen}
          onChange={handleChange}
          style={inputStyle}
          placeholder="https://images.unsplash.com/..."
        />

        <button type="submit" style={btnStyle} disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Cerro'}
        </button>

        {/* --- Mensajes de estado --- */}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>❌ Error: {error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '15px' }}>{message}</p>}
      </form>
    </div>
  );
};

export default CargarCerro;