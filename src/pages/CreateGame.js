import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addGame } from '../store/gamesSlice';
import './CreateGame.css';

const CreateGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    publisher: '',
    image: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Название обязательно';
    if (!formData.description.trim()) newErrors.description = 'Описание обязательно';
    if (formData.description.length < 10) newErrors.description = 'Минимум 10 символов';
    if (!formData.genre.trim()) newErrors.genre = 'Жанр обязателен';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(addGame({
      title: formData.title,
      description: formData.description,
      genre: formData.genre,
      publisher: formData.publisher,
      image: formData.image
    }));
    navigate('/products');
  };

  return (
    <div className="create-product-container">
      <h2>Добавить новую игру</h2>
      <form onSubmit={handleSubmit} className="game-form">
        <div className="form-group">
          <label>Название игры*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Описание* (минимум 10 символов)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label>Жанр*</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className={errors.genre ? 'error' : ''}
          />
          {errors.genre && <span className="error-message">{errors.genre}</span>}
        </div>

        <div className="form-group">
          <label>Издатель</label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Ссылка на изображение</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button type="submit" className="submit-btn">
          Добавить игру
        </button>
      </form>
    </div>
  );
};

export default CreateGame;