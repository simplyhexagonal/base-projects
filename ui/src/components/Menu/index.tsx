import React from 'react';

import './menu.component.css';

const lang = process.env.LANGUAGE;

const Menu = () => {
  const currentPath = location.pathname.replace(/^\/[^\/]+?\//, '');

  return (
    <div className="menu">
      <div className="logo">
        <a href={`/${lang}/`}>
          <img src="/logo.svg" className="App-logo" alt="logo" width="80"/>
        </a>
      </div>
      <ul>
        <li>
          <a href={`/${lang}/`}>
            Home
          </a>
        </li>
        <li>
          <a href={`/${lang}/about/`}>
            About
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
