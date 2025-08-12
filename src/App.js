import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GamesList from './pages/GamesList';
import GameDetails from './pages/GameDetails';
import CreateGame from './pages/CreateGame';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<GamesList />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/create-game" element={<CreateGame />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;