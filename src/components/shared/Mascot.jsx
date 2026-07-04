import React from 'react';

export const Mascot = ({ state = 'idle', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <img src={`/assets/images/mascot-${state}.svg`} alt="Mascot" className="w-32 h-32 object-contain" />
    </div>
  );
};
