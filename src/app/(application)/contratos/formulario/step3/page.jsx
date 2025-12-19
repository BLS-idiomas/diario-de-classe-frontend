'use client';

import { useContratoForm } from '@/providers/ContratoFormProvider';
import { FormGroup, InputField } from '@/components';

export default function ContratoStep3() {
  const { formData, handleChange } = useContratoForm();
  return (
    <FormGroup cols={2}>
      <InputField
        required
        htmlFor="dataInicio"
        label="Data de inicio do contrato"
        type="date"
        onChange={handleChange}
        value={formData.dataInicio}
      />
      <InputField
        required
        htmlFor="dataTermino"
        label="Data de término do contrato"
        type="date"
        onChange={handleChange}
        value={formData.dataTermino}
      />
    </FormGroup>
  );
}
