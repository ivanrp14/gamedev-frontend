import React, { useState } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import "../Login/Login.css";

export const SignUp: React.FC = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div className="signup-container">
      <h1>Crear Cuenta</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group1">
          <Input
            label="Nombre Completo"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Nombre de Usuario"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group2">
          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit">Registrarse</Button>
        </div>
      </form>
    </div>
  );
};
