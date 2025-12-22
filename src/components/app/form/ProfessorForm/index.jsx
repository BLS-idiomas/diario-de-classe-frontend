import { PERMISSAO } from '@/constants';
import {
  ButtonsFields,
  Form,
  FormError,
  FormGroup,
  InputField,
  PasswordField,
  SelectField,
} from '@/components';
import { useUserAuth } from '@/providers/UserAuthProvider';

export const ProfessorForm = ({
  handleSubmit,
  message,
  isSenhaError,
  errors,
  handleChange,
  formData,
  isLoading,
  isEdit = false,
}) => {
  const { currentUser } = useUserAuth();
  const getShowPasswordFields = () => {
    if (!isEdit) return true;
    if (isEdit && formData.id === currentUser.id) return true;
    return false;
  };
  const showPasswordFields = getShowPasswordFields();
  // TODO adicionar uma seção para dias aulas, outra para informações básicas e outras para disponibvildiade na criação
  return (
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

        {showPasswordFields && (
          <>
            {/* Senha */}
            <PasswordField
              required={!isEdit}
              htmlFor="senha"
              label="Senha"
              placeholder="Digite a senha"
              minLength={6}
              maxLength={100}
              onChange={handleChange}
              value={formData.senha}
              autoComplete={isEdit ? 'off' : 'new-password'}
            />
            {/* Repetir Senha */}
            <PasswordField
              required={!isEdit}
              htmlFor="repetirSenha"
              label="Repetir Senha"
              placeholder="Confirme a senha"
              minLength={6}
              maxLength={100}
              onChange={handleChange}
              value={formData.repetirSenha}
              autoComplete={'off'}
            />
          </>
        )}
        {/* Permissão */}
        <SelectField
          required
          htmlFor="permissao"
          label="Permissão"
          onChange={handleChange}
          value={formData.permissao}
          options={[
            { value: PERMISSAO.MEMBER, label: 'Professor' },
            { value: PERMISSAO.ADMIN, label: 'Administrador' },
          ]}
        />
      </FormGroup>

      {/* Botões */}
      <ButtonsFields isLoading={isLoading} href="/professores" />
    </Form>
  );
};
