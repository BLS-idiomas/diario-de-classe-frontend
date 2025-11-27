'use client';

import Link from 'next/link';
import { useNovoProfessor } from '@/hooks/professores/useNovoProfessor';
import { isAdmin } from '@/utils/isAdmin';
import {
  ButtonGroup,
  Container,
  Form,
  InputField,
  PageContent,
  PageSubTitle,
  PageTitle,
  SelectField,
} from '@/components';

export default function NovoProfessor() {
  const {
    formData,
    message,
    errors,
    isLoading,
    isSubmitting,
    isError,
    isSenhaError,
    handleChange,
    handleSubmit,
  } = useNovoProfessor();

  return (
    <Container>
      <PageContent>
        <PageTitle>Novo Professor</PageTitle>

        <PageSubTitle>
          Preencha os dados para criar um novo professor
        </PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/professores" className="btn btn-secondary">
          ← Voltar
        </Link>
      </ButtonGroup>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2">
            {message || (isSenhaError ? 'As senhas não coincidem' : '')}:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <InputField
            required
            htmlFor="nome"
            label="Nome"
            placeholder="Digite o nome"
            maxLength={200}
            minLength={3}
            onChange={handleChange}
            value={formData.nome}
          />

          {/* Sobrenome */}
          <InputField
            required
            htmlFor="sobrenome"
            label="Sobrenome"
            placeholder="Digite o sobrenome"
            maxLength={200}
            minLength={3}
            onChange={handleChange}
            value={formData.sobrenome}
          />

          {/* Email */}
          <InputField
            required
            htmlFor="email"
            label="Email"
            placeholder="Digite o email"
            maxLength={200}
            minLength={3}
            onChange={handleChange}
            value={formData.email}
          />

          {/* Telefone */}
          <InputField
            htmlFor="telefone"
            label="Telefone"
            placeholder="(11) 99999-9999"
            maxLength={11}
            onChange={handleChange}
            value={formData.telefone}
          />

          {/* Senha */}
          <InputField
            required
            type="password"
            htmlFor="senha"
            label="Senha"
            placeholder="Digite a senha"
            minLength={6}
            maxLength={100}
            onChange={handleChange}
            value={formData.senha}
          />

          {/* Repetir Senha */}
          <InputField
            required
            type="password"
            htmlFor="repetirSenha"
            label="Repetir Senha"
            placeholder="Confirme a senha"
            minLength={6}
            maxLength={100}
            onChange={handleChange}
            value={formData.repetirSenha}
          />

          {/* Permissão — apenas administradores podem ver */}
          {isAdmin() && (
            <SelectField
              required
              htmlFor="permissao"
              label="Permissão"
              placeholder="Selecione a Permissão"
              onChange={handleChange}
              value={formData.permissao}
              options={[
                { value: 'professor', label: 'Professor' },
                { value: 'admin', label: 'Administrador' },
              ]}
            />
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary ${isSubmitting && 'blocked'}`}
          >
            {isLoading ? 'Criando...' : 'Salvar'}
          </button>

          <Link href="/professores" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </Form>
    </Container>
  );
}
