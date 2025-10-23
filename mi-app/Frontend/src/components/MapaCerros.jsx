import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono personalizado para cerros - Pin rojo con montaña
const cerroIcon = L.divIcon({
  html: `
    <div style="position: relative;">
      <svg width="32" height="45" viewBox="0 0 32 45" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M16 0C7.2 0 0 7.2 0 16c0 13.2 16 29 16 29s16-15.8 16-29c0-8.8-7.2-16-16-16z" 
              fill="#e74c3c" 
              filter="url(#shadow)"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <text x="16" y="21" text-anchor="middle" font-size="16">🏔️</text>
      </svg>
    </div>
  `,
  className: 'custom-marker',
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  popupAnchor: [0, -45]
});

const MapaCerros = ({ cerros }) => {
  if (!cerros || cerros.length === 0) {
    return (
      <div style={{ 
        padding: '60px', 
        textAlign: 'center',
        fontSize: '1.5em',
        color: '#666'
      }}>
        ⏳ Cargando mapa...
      </div>
    );
  }

  const cerrosConCoordenadas = [
    { ...cerros[0], lat: -32.6532, lng: -70.0109 },
    { ...cerros[1], lat: -33.3667, lng: -69.8167 },
    { ...cerros[2], lat: -33.2167, lng: -69.7333 },
    { ...cerros[3], lat: -31.9833, lng: -70.1167 },
    { ...cerros[4], lat: -33.8167, lng: -70.0833 },
    { ...cerros[5], lat: -33.1833, lng: -69.7000 },
    { ...cerros[6], lat: -28.6667, lng: -68.7000 },
    { ...cerros[7], lat: -32.5167, lng: -69.8500 }
  ].filter(cerro => cerro && cerro.id !== undefined);

  const center = [-33.0, -69.5];

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '40px auto',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '2.5em', 
          color: '#2c3e50',
          margin: '0 0 10px 0'
        }}>
          🗺️ Mapa Interactivo de Cerros
        </h2>
        <p style={{ 
          fontSize: '1.1em', 
          color: '#666' 
        }}>
          Haz clic en los marcadores para ver la información de cada cerro
        </p>
      </div>

      <div style={{
        height: '600px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        border: '3px solid #667eea'
      }}>
        <MapContainer 
          center={center} 
          zoom={7} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {cerrosConCoordenadas.map((cerro) => (
            <Marker 
              key={cerro.id} 
              position={[cerro.lat, cerro.lng]}
              icon={cerroIcon}
            >
              <Popup>
                <div style={{ 
                  minWidth: '250px',
                  padding: '10px'
                }}>
                  <img 
                    src={cerro.imagen} 
                    alt={cerro.nombre}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      marginBottom: '10px'
                    }}
                  />
                  <h3 style={{ 
                    margin: '0 0 10px 0',
                    color: '#2c3e50',
                    fontSize: '1.4em'
                  }}>
                    {cerro.nombre}
                  </h3>
                  <p style={{
                    margin: '5px 0',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    color: '#667eea'
                  }}>
                    📏 {cerro.altura ? cerro.altura.toLocaleString() : 'N/A'} metros
                  </p>
                  <p style={{
                    margin: '5px 0',
                    color: '#555'
                  }}>
                    📍 {cerro.provincia || 'N/A'}
                  </p>
                  <p style={{
                    margin: '10px 0 0 0',
                    fontSize: '0.9em',
                    color: '#666',
                    lineHeight: '1.5'
                  }}>
                    {cerro.descripcion || 'Sin descripción'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapaCerros;