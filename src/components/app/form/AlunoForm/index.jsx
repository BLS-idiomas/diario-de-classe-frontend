import {
  ButtonsFields,
  Form,
  FormError,
  FormGroup,
  InputField,
  TextAreaField,
} from '@/components';
import { useUserAuth } from '@/providers/UserAuthProvider';

export const AlunoForm = ({
  handleSubmit,
  message,
  errors,
  handleChange,
  formData,
  isLoading,
}) => {
  const { isAdmin } = useUserAuth();
  return (
    <Form handleSubmit={handleSubmit}>
      <FormError title={message} errors={errors} />

      <div className="grid gap-6">
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
        </FormGroup>

        {isAdmin() && (
          <TextAreaField
            htmlFor="material"
            label="Material"
            placeholder="Digite o material"
            maxLength={2000}
            onChange={handleChange}
            value={formData.material}
          />
        )}
      </div>

      {/* Botões */}
      <ButtonsFields isLoading={isLoading} href="/aulas" />
    </Form>
  );
};
