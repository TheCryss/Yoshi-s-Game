import './App.css';
import Map from './World/map';
import { useState } from 'react';
import DificultadSelector from './World/selector';

function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Facil' | 'Intermedio' | 'Dificil' | undefined >(undefined);

  const handleSelectDifficulty = (difficulty: 'Facil' | 'Intermedio' | 'Dificil' | undefined ) => {
    setSelectedDifficulty(difficulty);
  };

  return (
    <>
      {selectedDifficulty === undefined ? (
        <DificultadSelector onSelectDifficulty={handleSelectDifficulty} />
      ) : (
        <>
          
          <Map difficulty={selectedDifficulty} />     
        </>
      )}
    </>
  )
}

export default App
