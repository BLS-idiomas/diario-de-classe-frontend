'use client';

import { Badge, Loading } from '@/components';
import { TIPO_AULA, DIAS_LABEL } from '@/constants';
import { useFormater } from '@/hooks/useFormater';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useContratoForm } from '@/providers/ContratoFormProvider';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function ContratoStep4() {
  const { formData, setAulas, generateAulasByContrato } = useContratoForm();
  const { showForm, showSuccess } = useSweetAlert();
  const { dataFormatter } = useFormater();
  // TODO calcular hora final igual aos outros
  // TODO Quando adicionar uma aula precisa reordenar as aulas por data
  useEffect(() => {
    if (formData.aulas.length === 0) {
      generateAulasByContrato(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleDeleteAula = aulaId => {
    const updatedAulas = formData.aulas.filter(aula => aula.id !== aulaId);
    setAulas(updatedAulas);
  };

  const handleEditAula = async aula => {
    const result = await getFormCreateAula({ aula, aulas: formData.aulas });
    if (result.isConfirmed && result.value) {
      const updatedAulas = formData.aulas.map(newAula => {
        if (newAula.id === aula.id) {
          return { ...newAula, ...result.value };
        }
        return newAula;
      });

      setAulas(updatedAulas);
      showSuccess({
        title: 'Aula atualizada!',
        text: 'As informações da aula foram atualizadas com sucesso.',
      });
    }
  };

  const createAula = async () => {
    const result = await getFormCreateAula({ aulas: formData.aulas });
    if (result.isConfirmed && result.value) {
      const newAula = {
        id: formData.aulas.length + 1,
        ...result.value,
      };

      setAulas([...formData.aulas, newAula]);
      showSuccess({
        title: 'Aula criada!',
        text: 'A nova aula foi adicionada com sucesso.',
      });
    }
  };

  const getFormCreateAula = async ({ aula, aulas }) => {
    const title = aula ? 'Editar Aula' : 'Nova Aula';
    const formateDateValue = dateStr => {
      if (!dateStr) return '';
      return dateStr.split('T')[0];
    };
    aula = {
      dataAula: formateDateValue(aula?.dataAula),
      horaInicial: aula?.horaInicial || '',
      horaFinal: aula?.horaFinal || '',
      tipo: aula?.tipo || 'PADRAO',
      observacao: aula?.observacao || '',
    };
    return await showForm({
      title: title,
      html: `
                        <div style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
                          <div>
                            <label for="dataAula" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Data da Aula</label>
                            <input id="dataAula" type="date" class="swal2-input" value="${aula.dataAula}" style="margin: 0; width: 100%;">
                          </div>
                          <div>
                            <label for="horaInicial" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Hora Inicial</label>
                            <input id="horaInicial" type="time" class="swal2-input" value="${aula.horaInicial}" style="margin: 0; width: 100%;">
                          </div>
                          <div>
                            <label for="horaFinal" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Hora Final</label>
                            <input id="horaFinal" type="time" class="swal2-input" value="${aula.horaFinal}" style="margin: 0; width: 100%;">
                          </div>
                          <div>
                            <label for="tipo" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Tipo</label>
                            <select id="tipo" class="swal2-input" style="margin: 0; width: 100%;">
                              <option value="PADRAO" ${aula.tipo === 'PADRAO' ? 'selected' : ''}>${TIPO_AULA.PADRAO}</option>
                              <option value="REPOSICAO" ${aula.tipo === 'REPOSICAO' ? 'selected' : ''}>${TIPO_AULA.REPOSICAO}</option>
                              <option value="OUTRA" ${aula.tipo === 'OUTRA' ? 'selected' : ''}>${TIPO_AULA.OUTRA}</option>
                            </select>
                          </div>
                          <div>
                            <label for="observacao" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Observação (opcional)</label>
                            <input id="observacao" type="text" class="swal2-input" placeholder="Digite uma observação..." value="${aula.observacao || ''}" style="margin: 0; width: 100%;">
                          </div>
                        </div>
                      `,
      preConfirm: () => {
        const dataAula = document.getElementById('dataAula').value;
        const horaInicial = document.getElementById('horaInicial').value;
        const horaFinal = document.getElementById('horaFinal').value;
        const tipo = document.getElementById('tipo').value;
        const observacao = document.getElementById('observacao').value;

        if (!dataAula || !horaInicial || !horaFinal || !tipo) {
          Swal.showValidationMessage(
            'Por favor, preencha todos os campos obrigatórios'
          );
          return false;
        }

        if (aula.dataAula != dataAula) {
          const aulaExistente = aulas.find(
            a => formateDateValue(a.dataAula) === dataAula
          );

          if (aulaExistente) {
            Swal.showValidationMessage(
              'Já existe uma aula cadastrada para esta data.'
            );
            return false;
          }
        }

        return {
          dataAula: new Date(dataAula).toISOString(),
          horaInicial,
          horaFinal,
          tipo,
          observacao,
        };
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p>Total de {formData.aulas.length} aulas.</p>
      <div>
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2"
          onClick={createAula}
        >
          <Plus strokeWidth={2} size={20} />
          Nova Aula
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,500px))] gap-4">
        {formData && formData.aulas && formData.aulas.length > 0 ? (
          formData.aulas.map(aula => (
            <div
              key={aula.id}
              className="border border-gray-300 rounded-md p-4"
            >
              <div className="flex flex-row  items-start gap-2 justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const date = new Date(
                        aula.dataAula.split('T')[0] + 'T12:00:00'
                      );
                      const dias = [
                        'DOMINGO',
                        'SEGUNDA',
                        'TERCA',
                        'QUARTA',
                        'QUINTA',
                        'SEXTA',
                        'SABADO',
                      ];
                      return DIAS_LABEL[dias[date.getDay()]];
                    })()}
                  </p>
                  <p>
                    <strong>Aula:</strong> {dataFormatter(aula.dataAula)}{' '}
                    {aula.horaInicial} - {aula.horaFinal}
                  </p>

                  {aula.tipo && aula.tipo !== 'PADRAO' && (
                    <Badge
                      icon="calendar"
                      color="alert"
                      text={TIPO_AULA[aula.tipo]}
                    />
                  )}
                  {aula.observacao && (
                    <p>
                      <strong>Observação:</strong> {aula.observacao}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-outline btn-outline-secondary"
                    onClick={() => handleEditAula(aula)}
                  >
                    <Pencil strokeWidth={1} size={16} stroke="gray" />
                  </button>

                  <button
                    className="btn-outline btn-outline-danger"
                    onClick={() => handleDeleteAula(aula.id)}
                  >
                    <Trash2 strokeWidth={1} size={16} stroke="red" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
