import React, { useState } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import "../Login/Login.css";

export const Login: React.FC = () => {
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
      <h1>Iniciar Sesion</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <Input
          label="Nombre de Usuario"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit">Iniciar Sesion</Button>
      </form>
    </div>
  );
};
