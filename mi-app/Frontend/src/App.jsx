import { useState, useEffect } from 'react';
import axios from 'axios';
import CerrosList from './components/CerrosList';
import MapaCerros from './components/MapaCerros';

function App() {
  const [cerros, setCerros] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div>
      <CerrosList />
      <MapaCerros cerros={cerros} />
    </div>
  );
}

export default App;