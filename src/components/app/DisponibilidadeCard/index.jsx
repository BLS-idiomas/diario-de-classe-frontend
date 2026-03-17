import { DIAS_LABEL } from '@/constants';
import { Pencil, ArrowLeft } from 'lucide-react';
import { FormGroup, InputField } from '@/components/ui';
import { useState } from 'react';

export const DisponibilidadeCard = ({
  handleChange = () => {},
  formData,
  dia,
  isEdit = false,
}) => {
  const [editMode, setEditMode] = useState(false);
  const handleCheckboxChange = (name, value) => {
    if (isEdit) {
      const target = { name, value };
      handleChange({ target });
    }
  };
  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  if (!formData || !formData[dia]) {
    return null;
  }

  const { diaSemana, horaInicial, horaFinal, ativo } = formData[dia];
  return (
    <div
      className="p-3 rounded-md bg-main shadow-sm"
      data-testid={`disponibilidade-card-${dia}`}
    >
      <div className="font-medium" data-testid={`dia-label-${dia}`}>
        {DIAS_LABEL[diaSemana]}
      </div>

      {isEdit && editMode ? (
        <div data-testid={`edit-mode-${dia}`}>
          <FormGroup cols={2}>
            <InputField
              disabled={!ativo}
              htmlFor={`${diaSemana}.horaInicial`}
              label="Hora inicial"
              type="time"
              onChange={handleChange}
              value={horaInicial}
            />

            <InputField
              disabled={!ativo}
              htmlFor={`${diaSemana}.horaFinal`}
              label="Hora final"
              type="time"
              onChange={handleChange}
              value={horaFinal}
            />
          </FormGroup>
        </div>
      ) : (
        <div className="text-sm text-muted" data-testid={`view-mode-${dia}`}>
          {horaInicial} - {horaFinal}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div
          className={`mt-2 inline-block px-2 py-0.5 text-xs rounded-full ${isEdit ? 'cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md' : ''} ${ativo ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
          onClick={() => handleCheckboxChange(`${diaSemana}.ativo`, !ativo)}
          data-testid={`status-badge-${dia}`}
        >
          {ativo ? 'Ativo' : 'Inativo'}
        </div>
        <button
          type="button"
          className="mt-2 p-1 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-200"
          title={editMode ? 'Voltar' : 'Editar horário'}
          onClick={handleEditClick}
          hidden={!isEdit}
          data-testid={`edit-button-${dia}`}
        >
          {editMode ? (
            <ArrowLeft
              size={14}
              className="text-gray-600 hover:text-gray-800"
            />
          ) : (
            <Pencil size={14} className="text-gray-600 hover:text-gray-800" />
          )}
        </button>
      </div>
    </div>
  );
};
