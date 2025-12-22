'use client';

import { Form, FormGroup, InputField, PasswordField } from '@/components';
import { useLogin } from '@/hooks/auth/useLogin';

export default function Login() {
  const { formData, handleChange, handleSubmit, isLoading } = useLogin();
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo!</h2>
        <p className="text-gray-600">
          Entre com suas credenciais para acessar o sistema
        </p>
      </div>

      <Form handleSubmit={handleSubmit} className="w-full">
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
          <PasswordField
            htmlFor="senha"
            label="Senha"
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
          className={`btn btn-primary w-full text-base py-3 ${isLoading && 'blocked'}`}
        >
          {isLoading ? 'Carregando...' : 'Entrar'}
        </button>
      </Form>
    </>
  );
}
