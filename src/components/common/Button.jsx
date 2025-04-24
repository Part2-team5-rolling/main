import React from 'react';
import '../../styles/Button.css'

const Button = ({ onClick, children, className, type = 'button' , disabled = false}) => {

  return (
    <button
      onClick={onClick}
      className={className}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
