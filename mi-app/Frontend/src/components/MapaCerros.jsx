// mi-app/src/components/MapaCerros.jsx (REEMPLAZAR CON ESTO)

import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

// --- Estilos del contenedor del mapa ---
const containerStyle = {
  height: '600px',
  width: '100%', // Lo dejamos 100% para que sea responsivo
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  border: '3px solid #667eea'
};

// Coordenadas de Mendoza para centrar
const center = {
  lat: -33.0,
  lng: -69.5
};

const MapaCerros = ({ cerros }) => {
  // Aquí simulamos las coordenadas de nuevo
  const cerrosConCoordenadas = [
    { ...cerros[0], lat: -32.6532, lng: -70.0109 }, // Aconcagua
    { ...cerros[1], lat: -33.3667, lng: -69.8167 }, // Tupungato
    { ...cerros[2], lat: -33.2167, lng: -69.7333 }, // El Plata
    { ...cerros[3], lat: -31.9833, lng: -70.1167 }, // Mercedario
    { ...cerros[4], lat: -33.8167, lng: -70.0833 }, // Maipo
    // ...etc
  ].filter(cerro => cerro && cerro.id !== undefined && cerro.lat);


  // --- 👇 AQUÍ SE USA LA API KEY ---
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDWnyfrdhiNq1PzraDGPim17RUNMqRX08w" // 👈 PEGA TU API KEY AQUÍ
  });

  if (!isLoaded) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.5em' }}>
        ⏳ Cargando mapa de Google...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      {/* Título (sin cambios) */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2.5em', color: '#2c3e50' }}>
          🗺️ Mapa Interactivo de Cerros
        </h2>
        <p style={{ fontSize: '1.1em', color: '#666' }}>
          Ubicaciones de los principales cerros
        </p>
      </div>

      {/* Contenedor del mapa */}
      <div style={containerStyle}>
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={7}
          // 👇 Aquí le decimos que use el mapa "Terrain" (relieve), que es 'p'
          mapTypeId='terrain' 
        >
          {/* Mapeamos los cerros para crear los marcadores */}
          {cerrosConCoordenadas.map((cerro) => (
            <MarkerF
              key={cerro.id}
              position={{ lat: cerro.lat, lng: cerro.lng }}
              title={cerro.nombre} // Texto que aparece al pasar el mouse
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapaCerros;