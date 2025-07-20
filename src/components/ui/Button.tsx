import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`button ${className}`}
    disabled={disabled}
  >
    {children}
  </button>
);
