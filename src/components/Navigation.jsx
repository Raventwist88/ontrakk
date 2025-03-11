import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div>
      {/* Change links from: */}
      <Link to="/daily">Daily</Link>

      {/* To: */}
      <Link to="daily">Daily</Link>
      {/* Remove leading slash to make it relative to basename */}
    </div>
  );
};

export default Navigation; 