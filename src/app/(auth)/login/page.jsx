'use client';

import { Form, FormGroup, InputField } from '@/components';
import { useLogin } from '@/hooks/auth/useLogin';

export default function Login() {
  const { formData, handleChange, handleSubmit, isLoading } = useLogin();
  return (
    <Form handleSubmit={handleSubmit} className="w-full">
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
        disabled={isLoading}
        className={`btn btn-primary w-full ${isLoading && 'blocked'}`}
      >
        {isLoading ? 'Carregando...' : 'Entrar'}
      </button>
    </Form>
  );
}
