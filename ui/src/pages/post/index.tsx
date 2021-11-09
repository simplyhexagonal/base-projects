import React from 'react';
import ReactDOM from 'react-dom';

import Menu from '../../components/Menu';
import Footer from '../../components/Footer';

import './post.page.css';

ReactDOM.render(
  <React.StrictMode>
    <Menu/>
  </React.StrictMode>,
  document.getElementById('header'),
);

ReactDOM.render(
  <React.StrictMode>
    <Footer/>
  </React.StrictMode>,
  document.getElementById('footer'),
);
