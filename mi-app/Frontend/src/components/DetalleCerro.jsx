// mi-app/src/components/DetalleCerro.jsx (¡ARCHIVIO NUEVO!)
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DetalleCerro = () => {
  const [cerro, setCerro] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // <- Obtiene el 'id' de la URL

  useEffect(() => {
    setLoading(true);
    // Hacemos la llamada al backend para un cerro específico
    axios.get(`http://localhost:3001/cerros/${id}`)
      .then(response => {
        setCerro(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar el cerro:', error);
        // Si falla, intentamos buscarlo en los datos de respaldo
        // (Esto es opcional, pero basado en tu CerrosList, parece útil)
        const cerroRespaldo = cerrosRespaldo.find(c => c.id.toString() === id);
        if (cerroRespaldo) {
          setCerro(cerroRespaldo);
        }
        setLoading(false);
      });
  }, [id]); // <- Este efecto se ejecuta cada vez que el 'id' cambie

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.5em' }}>
        ⏳ Cargando información del cerro...
      </div>
    );
  }

  if (!cerro) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>❌ No se encontró el cerro</h2>
        <Link to="/" style={linkStyle}>{"< Volver a la lista"}</Link>
      </div>
    );
  }

  // Si todo salió bien, mostramos el detalle
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      {/* Botón para volver */}
      <Link to="/" style={linkStyle}>
        {"< Volver a la lista"}
      </Link>

      {/* Título */}
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '3em', 
        color: '#2c3e50',
        margin: '20px 0 30px 0'
      }}>
        {cerro.nombre}
      </h1>

      {/* Imagen Principal */}
      <img 
        src={cerro.imagen} 
        alt={cerro.nombre} 
        style={{
          width: '100%',
          height: '500px',
          objectFit: 'cover',
          borderRadius: '15px',
          marginBottom: '30px'
        }} 
      />

      {/* Info Rápida */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '30px'
      }}>
        <InfoBox label="Altura" value={`${cerro.altura.toLocaleString()}m`} icon="📏" />
        <InfoBox label="Provincia" value={cerro.provincia} icon="📍" />
        <InfoBox label="Dificultad" value={cerro.dificultad || 'No definida'} icon="⛰️" />
      </div>

      {/* Descripción Larga */}
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
        Descripción
      </h2>
      <p style={{
        fontSize: '1.1em',
        lineHeight: '1.8',
        color: '#555'
      }}>
        {/* Usamos 'descripcion_larga' si existe, sino la normal */}
        {cerro.descripcion_larga || cerro.descripcion}
        
        {/* Texto de ejemplo si tu backend solo tiene la descripción corta */}
        <br /><br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
        Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu 
        tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus 
        molestie magna non est bibendum non venenatis nisl tempor.
      </p>

      {/* Aquí podrías agregar más info: mapa, clima, etc. */}
      
    </div>
  );
};

// Componente pequeño para las cajas de info
const InfoBox = ({ label, value, icon }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '1.5em', marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '0.9em', color: '#777', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#2c3e50' }}>{value}</div>
  </div>
);

// Estilo para el link de volver
const linkStyle = {
  display: 'inline-block',
  padding: '10px 15px',
  background: '#667eea',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '10px',
  fontWeight: 'bold',
  marginBottom: '20px',
  transition: 'background 0.3s'
};

// Datos de respaldo (copiados de tu CerrosList, por si falla el fetch)
const cerrosRespaldo = [
  { id: 1, nombre: "Aconcagua", altura: 6960, provincia: "Mendoza", descripcion: "El pico más alto de América y del hemisferio sur. Conocido como el 'Coloso de América', atrae a montañistas de todo el mundo.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Aconcagua2016.jpg/1200px-Aconcagua2016.jpg" },
  { id: 2, nombre: "Tupungato", altura: 6570, provincia: "Mendoza", descripcion: "Estratovolcán ubicado en la frontera entre Argentina y Chile. Su nombre significa 'mirador de las estrellas'.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tupungato.jpg/1200px-Tupungato.jpg" },
  { id: 3, nombre: "Cerro El Plata", altura: 5968, provincia: "Mendoza", descripcion: "Ubicado en el Cordón del Plata, muy popular para ascensos de entrenamiento y accesible durante gran parte del año.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cordon_del_Plata.jpg/1200px-Cordon_del_Plata.jpg" },
  { id: 4, nombre: "Cerro Mercedario", altura: 6720, provincia: "San Juan", descripcion: "El pico más alto de San Juan y el cuarto de los Andes argentinos. Menos frecuentado que el Aconcagua pero igualmente hermoso.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Cerro_Mercedario.jpg/1200px-Cerro_Mercedario.jpg" },
  { id: 5, nombre: "Volcán Maipo", altura: 5264, provincia: "Mendoza", descripcion: "Volcán activo en la frontera argentino-chilena. Su última erupción fue en 1826. Popular por su accesibilidad.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Volcan_Maipo.jpg/1200px-Volcan_Maipo.jpg" },
  { id: 6, nombre: "Cerro Tolosa", altura: 5432, provincia: "Mendoza", descripcion: "Parte del Cordón del Plata, cerro técnico que requiere experiencia en escalada con vistas panorámicas increíbles.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Cordillera_de_los_Andes.jpg/1200px-Cordillera_de_los_Andes.jpg" },
  { id: 7, nombre: "Cerro Bonete", altura: 6759, provincia: "La Rioja", descripcion: "Uno de los picos más altos de La Rioja. Su ubicación remota conserva su belleza prístina.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Andes_Mountains.jpg/1200px-Andes_Mountains.jpg" },
  { id: 8, nombre: "Cerro de la Ramada", altura: 6410, provincia: "Mendoza/San Juan", descripcion: "En el límite entre Mendoza y San Juan. Su ascenso combina glaciares y roca.", imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Cordillera_Principal.jpg/1200px-Cordillera_Principal.jpg" }
];

export default DetalleCerro;