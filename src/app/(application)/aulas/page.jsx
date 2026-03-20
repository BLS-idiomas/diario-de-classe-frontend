'use client';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAulas } from '@/hooks/aulas/useAulas';
import { useDeletarAula } from '@/hooks/aulas/useDeletarAula';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import { Form, FormGroup, InputField, ListPage } from '@/components';
import { useEditarAndamentoAula } from '@/hooks/aulas/useEditarAndamentoAula';

export default function Aulas() {
  const { currentUser } = useUserAuth();
  const {
    aulas,
    isLoading,
    searchParams,
    handleSubmit,
    handleChange,
    formData,
  } = useAulas();
  const { handleDeleteAula } = useDeletarAula();
  const { submit, isLoading: isLoadingSubmit } = useEditarAndamentoAula();
  const { telefoneFormatter, dataFormatter } = useFormater();
  const { columns, data } = useAulasList({
    currentUser,
    aulas,
    readOnly: false,
    telefoneFormatter,
    dataFormatter,
    handleDeleteAula,
    submit,
    isLoadingSubmit,
  });

  const Filter = () => {
    return (
      <Form handleSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold text-main mb-4">Filtros</h3>
        <FormGroup cols={2}>
          <InputField
            required
            htmlFor="dataInicio"
            label="Data de início"
            type="date"
            onChange={handleChange}
            value={formData.dataInicio}
          />
          <InputField
            required
            htmlFor="dataTermino"
            label="Data de fim"
            type="date"
            onChange={handleChange}
            value={formData.dataTermino}
          />
        </FormGroup>
      </Form>
    );
  };

  return (
    <>
      <ListPage
        title="Lista de aulas"
        buttons={[
          {
            href: '/aulas/novo',
            label: 'Nova aula',
            type: 'primary',
          },
        ]}
        // search={{
        //   title: 'Buscar pelo nome do aluno ou professor...',
        //   searchParams: searchParams,
        // }}
        columns={columns}
        data={data}
        isLoading={isLoading || isLoadingSubmit}
        notFoundMessage="Nenhuma aula encontrada."
        Filter={Filter}
      />
    </>
  );
}
