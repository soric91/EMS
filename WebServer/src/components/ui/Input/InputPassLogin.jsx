import React from "react";

const InputPassLogin = ({ value, onChange, ...props }) => {
  // Cambiar tipo dinámicamente: 'text' cuando está vacío, 'password' cuando tiene contenido

  
  return (
    <input
      type="password"
      placeholder="Contraseña"
      value={value}
      onChange={onChange}
      autoComplete="current-password"
      {...props}
    />
  );
};

export default InputPassLogin;
