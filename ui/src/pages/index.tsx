import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Menu from '../components/Menu';
import App from '../components/App';
import Footer from '../components/Footer';

import './index.css';

const HomePage = () => {
  return (
    <App>
      <>
        <h1>__('title')</h1>
        <p>
          __('welcomeParagraph')
        </p>
      </>
    </App>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Menu/>
  </React.StrictMode>,
  document.getElementById('header'),
);

ReactDOM.render(
  <React.StrictMode>
    <HomePage/>
  </React.StrictMode>,
  document.getElementById('app'),
);

ReactDOM.render(
  <React.StrictMode>
    <Footer/>
  </React.StrictMode>,
  document.getElementById('footer'),
);
