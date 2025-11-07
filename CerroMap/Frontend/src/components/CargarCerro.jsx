import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Creamos una instancia de axios para este componente
// (Apunta a la misma URL base que tu App.jsx)
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
});

// Recibimos la prop 'onCerroAdded' desde App.jsx
const CargarCerro = ({ onCerroAdded }) => {
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
    e.preventDefault(); // Evita que la página se recargue
    
    // Validación simple
    if (!formData.nombre || !formData.altura) {
      setError('El nombre y la altura son obligatorios.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setMessage('');

    console.log("Enviando datos al backend:", formData);

    try {
      // Usamos la ruta POST /cerros que creamos en el backend
      const response = await apiClient.post('/cerros', formData);
      
      // Si la API responde bien (201)...
      const newCerro = response.data;
      console.log("Respuesta del backend (nuevo cerro):", newCerro);
      
      // 1. Llamamos a la función de App.jsx para actualizar el estado global
      onCerroAdded(newCerro);

      // 2. Mostramos un mensaje de éxito
      setMessage(`✅ ¡Cerro "${newCerro.nombre}" guardado con éxito!`);
      
      // 3. Limpiamos el formulario
      setFormData({
        nombre: '', altura: '', provincia: '', descripcion: '', imagen: ''
      });

      // 4. (Opcional) Redirigimos a la lista de senderos después de 2 segundos
      setTimeout(() => {
        navigate('/senderos');
      }, 2000);

    } catch (err) {
      console.error("Error al guardar el cerro:", err.response || err.message);
      setError(err.response?.data?.error || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Estilos (similares a los de tu AuthModal) ---
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
    backgroundColor: isLoading ? '#ccc' : '#4a5c36', // Verde oscuro
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