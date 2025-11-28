'use client';
import { Form, FormGroup, InputField } from '@/components';
import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  const login = e => {
    e.preventDefault();
    // Implement login logic here
    alert('Login function not implemented yet.');
  };
  const isSubmitting = false; // Replace with actual loading state
  const isLoading = false; // Replace with actual loading state
  return (
    <Form handleSubmit={login} className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <FormGroup cols={1} className="mb-6 gap-4">
        <InputField
          htmlFor="email"
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={200}
          minLength={3}
          onChange={handleChange}
          value={formData.email}
        />
        <InputField
          htmlFor="senha"
          label="Senha"
          type="password"
          autoComplete="current-password"
          maxLength={200}
          minLength={3}
          onChange={handleChange}
          value={formData.senha}
        />
      </FormGroup>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn btn-primary w-full ${isSubmitting && 'blocked'}`}
      >
        {isLoading ? 'Carregando...' : 'Entrar'}
      </button>
    </Form>
  );
}
