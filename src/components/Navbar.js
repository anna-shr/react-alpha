import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="game-navbar">
      <div className="game-navbar-container">
        <Link to="/" className="game-nav-btn home-btn">
          <i className="fas fa-home"></i>
          <span>Главная</span>
        </Link>
        
        <Link to="/create-product" className="game-nav-btn add-btn">
          <i className="fas fa-plus-circle"></i>
          <span>Добавить игру</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;