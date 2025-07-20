import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="input-group">
    {label && <label htmlFor={props.id || props.name}>{label}</label>}
    <input className="input-field" {...props} />
  </div>
);
