import React from 'react';
import '../../styles/Button.css'

const Button = ({ onClick, children, className, type = 'button' }) => {

  return (
    <button
      onClick={onClick}
      className={className}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
