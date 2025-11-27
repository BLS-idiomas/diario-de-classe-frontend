'use client';

import Link from 'next/link';
import { useNovoProfessor } from '@/hooks/professores/useNovoProfessor';
import { isAdmin } from '@/utils/isAdmin';
import {
  ButtonGroup,
  ButtonsFields,
  Container,
  Form,
  FormError,
  FormGroup,
  InputField,
  PageContent,
  PageSubTitle,
  PageTitle,
  SelectField,
} from '@/components';
import { useProfessorForm } from '@/hooks/professores/useProfessorForm';

export default function NovoProfessor() {
  const { message, errors, isLoading, isSubmitting, submit } =
    useNovoProfessor();
  const { formData, isSenhaError, handleChange, handleSubmit } =
    useProfessorForm({ submit });

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

      <Form handleSubmit={handleSubmit}>
        <FormError
          title={message || (isSenhaError ? 'As senhas não coincidem' : '')}
          errors={errors}
        />

        <FormGroup>
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
        </FormGroup>

        {/* Botões */}
        <ButtonsFields
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          href="/professores"
        />
      </Form>
    </Container>
  );
}
