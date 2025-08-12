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
          <Route path="/products" element={<GamesList />} />
          <Route path="/products/:id" element={<GameDetails />} />
          <Route path="/create-product" element={<CreateGame />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;