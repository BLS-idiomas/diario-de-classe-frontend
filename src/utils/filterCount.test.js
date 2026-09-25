import { countAppliedFilters } from './filterCount';

// Shape de defaultFormData — fonte: src/hooks/aulas/useAulas.js:17-25.
const defaultFormData = {
  dataInicio: '2026-09-17',
  dataTermino: '2026-12-17',
  tipo: '',
  status: '',
  idAluno: '',
  idProfessor: '',
  q: '',
};

describe('countAppliedFilters', () => {
  it('retorna 0 quando nenhum campo difere do default', () => {
    const formData = { ...defaultFormData };

    expect(countAppliedFilters(formData, defaultFormData)).toBe(0);
  });

  it('retorna N quando N campos diferem do default', () => {
    const formData = {
      ...defaultFormData,
      tipo: 'REGULAR',
      idAluno: '42',
      idProfessor: '7',
    };

    expect(countAppliedFilters(formData, defaultFormData)).toBe(3);
  });

  it('nunca conta "q" alterado sozinho, mesmo sem excluí-lo explicitamente', () => {
    const formData = { ...defaultFormData, q: 'busca qualquer' };

    expect(
      countAppliedFilters(formData, defaultFormData, { exclude: [] })
    ).toBe(0);
  });

  it('exclude customizado soma o campo indicado à exclusão padrão de "q"', () => {
    const formData = {
      ...defaultFormData,
      q: 'busca qualquer',
      tipo: 'REGULAR',
      idAluno: '42',
    };

    expect(
      countAppliedFilters(formData, defaultFormData, { exclude: ['tipo'] })
    ).toBe(1);
  });
});
