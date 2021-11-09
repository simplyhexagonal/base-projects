import React from 'react';

import './footer.component.css';

const Footer = () => {
  const currentPath = location.pathname.replace(/^\/[^\/]+?\//, '');

  return (
    <div className="footer">
      <div className="lang-selector">
        🌐 <a href={`/en/${currentPath}`}>EN</a> | <a href={`/es/${currentPath}`}>ES</a>
      </div>
      Copyright &copy; {new Date().getFullYear()}
    </div>
  );
};

export default Footer;
