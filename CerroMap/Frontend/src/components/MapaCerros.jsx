import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const center = [-33.0, -69.0];

return (
  <div style={{
    position: 'fixed',
    top: isNarrow ? '70px' : '80px',  // 👈 Empieza DESPUÉS del navbar
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  }}>
    {/* Header compacto */}
    <div style={{
      padding: isNarrow ? '15px' : '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      flexShrink: 0,
      zIndex: 10
    }}>
      <h2 style={{
        fontSize: isNarrow ? '1.3em' : '1.8em',
        margin: '0 0 8px 0',
        fontWeight: '600'
      }}>
        🗺️ Mapa Interactivo de Cerros
      </h2>
      <p style={{
        fontSize: isNarrow ? '0.8em' : '0.9em',
        margin: 0,
        opacity: 0.95
      }}>
        Haz clic en los marcadores rojos 🏔️
      </p>
    </div>

    {/* Mapa ocupa TODO el resto */}
    <div style={{
      flex: 1,
      position: 'relative',
      width: '100%',
      overflow: 'hidden'
    }}>
      <MapContainer
        center={center}
        zoom={isNarrow ? 7 : 8}
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        scrollWheelZoom={true}
      >
          <TileLayer
  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  maxZoom={19}
/>

          {cerrosConCoordenadas.map((cerro) => (
            <Marker
              key={cerro.id}
              position={[cerro.lat, cerro.lng]}
              icon={cerroIcon}
            >
              <Popup maxWidth={isNarrow ? 250 : 300}>
                <div style={{
                  minWidth: isNarrow ? '200px' : '250px',
                  padding: '10px'
                }}>
                  <img
                    src={cerro.imagen}
                    alt={cerro.nombre}
                    style={{
                      width: '100%',
                      height: isNarrow ? '120px' : '150px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      marginBottom: '10px'
                    }}
                  />
                  <h3 style={{
                    margin: '0 0 10px 0',
                    color: '#2c3e50',
                    fontSize: isNarrow ? '1.2em' : '1.4em'
                  }}>
                    {cerro.nombre}
                  </h3>
                  <p style={{
                    margin: '5px 0',
                    fontSize: isNarrow ? '1em' : '1.1em',
                    fontWeight: 'bold',
                    color: '#667eea'
                  }}>
                    📏 {cerro.altura ? cerro.altura.toLocaleString() : 'N/A'} metros
                  </p>
                  <p style={{
                    margin: '5px 0',
                    color: '#555',
                    fontSize: isNarrow ? '0.9em' : '1em'
                  }}>
                    📍 {cerro.provincia || 'N/A'}
                  </p>
                  <p style={{
                    margin: '10px 0 0 0',
                    fontSize: isNarrow ? '0.85em' : '0.9em',
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
