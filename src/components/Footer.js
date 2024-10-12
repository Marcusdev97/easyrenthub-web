// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '10px 20px', borderTop: '1px solid #ddd', textAlign: 'center', marginTop: '20px' }}>
      <p>&copy; {new Date().getFullYear()} 易租屋. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
