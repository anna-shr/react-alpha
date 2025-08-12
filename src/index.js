import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

const repoName = '/react-alpha';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={repoName}>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);