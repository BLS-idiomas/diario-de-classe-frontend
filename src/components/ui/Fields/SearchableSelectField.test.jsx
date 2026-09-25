import { useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { computeAccessibleName } from 'dom-accessibility-api';
import { SearchableSelectField } from './SearchableSelectField';
import { SearchableSelectField as SearchableSelectFieldFromBarrel } from '@/components';

const OPTIONS = [
  { value: '1', label: 'João Silva' },
  { value: '2', label: 'Maria Souza' },
  { value: '3', label: 'José Santos' },
];

// jsdom não implementa scrollIntoView — stub local, não mock de módulo.
beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  Element.prototype.scrollIntoView.mockClear();
});

// Harness controlado: reflete `onChange` de volta em `value`, como um
// `use<Entidade>Form` real faria — necessário para provar que a seleção
// atualiza o texto exibido (AC-001-005), não só que `onChange` foi chamado.
const ControlledSearchableSelectField = ({
  initialValue = '',
  onChangeSpy,
  options = OPTIONS,
}) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = e => {
    onChangeSpy?.(e);
    setValue(e.target.value);
  };
  return (
    <SearchableSelectField
      htmlFor="idAluno"
      label="Aluno"
      value={value}
      onChange={handleChange}
      options={options}
    />
  );
};

describe('SearchableSelectField', () => {
  it('AC-001-001: aparece como o novo seletor pesquisável, sem mecanismo de múltipla seleção, seleção provada por contagem', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value="1"
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    expect(input).toHaveAttribute('role', 'combobox');
    expect(input).toHaveValue('João Silva');
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();

    // Prova por contagem: marcar aria-selected em todas as opções, ou
    // aria-multiselectable no listbox, teria que derrubar esta asserção.
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    const listbox = screen.getByRole('listbox');
    expect(listbox).not.toHaveAttribute('aria-multiselectable');
    expect(screen.getAllByRole('option', { selected: true })).toHaveLength(1);
  });

  it('AC-001-009: nunca renderiza mais opções do que `options` recebida', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    await user.click(screen.getByLabelText('Aluno'));
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length);
  });

  it('AC-001-002: isLoading exibe Loading; opções completas aparecem assim que `options` chega, sem digitação', () => {
    const { rerender } = render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={[]}
        isLoading
      />
    );
    fireEvent.click(screen.getByLabelText('Aluno'));
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    rerender(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
        isLoading={false}
      />
    );
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length);
  });

  it('FR-001-003: digitar diretamente, sem clique prévio, também abre e filtra o seletor', () => {
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    fireEvent.change(input, { target: { value: 'maria' } });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'Maria Souza',
    ]);
  });

  it('AC-001-003 (i): a cada tecla, estreita a lista às opções que correspondem, sem mínimo de caracteres', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.type(input, 'jo');
    const options = screen.getAllByRole('option');
    expect(options.map(option => option.textContent)).toEqual([
      'João Silva',
      'José Santos',
    ]);
  });

  it('AC-001-003 (i), caso de 1 único caractere: um mutante que exige 2+ caracteres não passa despercebido', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.type(input, 'j');
    const options = screen.getAllByRole('option');
    expect(options.map(option => option.textContent)).toEqual([
      'João Silva',
      'José Santos',
    ]);
  });

  it('AC-001-003 (ii): com errorMessage, mantém a última lista válida, mostra o erro e o input continua editável', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
        errorMessage="Erro ao buscar alunos"
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    const errorText = screen.getByText('Erro ao buscar alunos');
    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveAttribute('role', 'status');
    expect(errorText.classList.contains('text-danger')).toBe(true);
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length);
    expect(input).not.toBeDisabled();
    await user.type(input, 'x');
    expect(input).toHaveValue('x');
  });

  it('AC-001-004: texto sem correspondência exibe estado vazio informativo, sem ação adicional', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.type(input, 'zzz');
    expect(
      screen.getByText('Nenhum resultado encontrado.')
    ).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('AC-001-004: erro presente com options=[] mostra só o erro, sem o vazio (não carregou nada ainda)', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={[]}
        errorMessage="Erro ao buscar alunos"
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    expect(screen.getByText('Erro ao buscar alunos')).toBeInTheDocument();
    expect(
      screen.queryByText('Nenhum resultado encontrado.')
    ).not.toBeInTheDocument();
  });

  it('AC-001-004: erro presente com options preenchida e busca sem match mostra os dois (erro e vazio)', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
        errorMessage="Erro ao buscar alunos"
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.type(input, 'zzz');
    expect(screen.getByText('Erro ao buscar alunos')).toBeInTheDocument();
    expect(
      screen.getByText('Nenhum resultado encontrado.')
    ).toBeInTheDocument();
  });

  it('AC-001-005: clique numa opção fecha o seletor, atualiza o texto exibido e chama onChange com o value exato', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<ControlledSearchableSelectField onChangeSpy={onChangeSpy} />);
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.click(screen.getByRole('option', { name: 'Maria Souza' }));

    expect(onChangeSpy).toHaveBeenCalledWith({
      target: { name: 'idAluno', value: '2' },
    });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('Maria Souza');
  });

  it('AC-001-005/AC-001-006: Enter sobre a opção destacada por teclado confirma a seleção correta', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<ControlledSearchableSelectField onChangeSpy={onChangeSpy} />);
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    // Sem destaque por padrão ao abrir: a primeira seta estabelece o
    // destaque em João(0); as duas seguintes avançam para Maria(1) e José(2).
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onChangeSpy).toHaveBeenCalledWith({
      target: { name: 'idAluno', value: '3' },
    });
    expect(input).toHaveValue('José Santos');
  });

  it('AC-001-006: Enter ou espaço abrem o seletor com o campo focado', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    input.focus();

    await user.keyboard('{Enter}');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.keyboard(' ');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('espaço abre o seletor por um caminho que só o espaço produz (não vira texto digitado)', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    input.focus();

    await user.keyboard(' ');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    // Distinto de digitar literalmente um espaço como busca: o espaço de
    // abertura não vira texto.
    expect(input).toHaveValue('');
  });

  it('AC-001-006: ArrowDown repetido no último item permanece nele, não dá a volta', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<ControlledSearchableSelectField onChangeSpy={onChangeSpy} />);
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onChangeSpy).toHaveBeenCalledWith({
      target: { name: 'idAluno', value: '3' },
    });
  });

  it('AC-001-006: ArrowUp repetido no primeiro item permanece nele, não dá a volta', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<ControlledSearchableSelectField onChangeSpy={onChangeSpy} />);
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    // Estabelece o destaque no primeiro item (João, index 0) antes de testar
    // o clamp — não há destaque por padrão ao abrir.
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowUp}{ArrowUp}');
    await user.keyboard('{Enter}');

    expect(onChangeSpy).toHaveBeenCalledWith({
      target: { name: 'idAluno', value: '1' },
    });
  });

  it('AC-001-006: Esc fecha sem chamar onChange, e um caso irmão prova que o mesmo mock dispararia com Enter (controle positivo)', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    const { unmount } = render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value="1"
        onChange={onChangeSpy}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.keyboard('{Escape}');

    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(input).toHaveValue('João Silva');
    unmount();

    // Controle positivo: o mesmo spy, no mesmo cenário, dispara se a tecla
    // apertada for Enter em vez de Esc (per lição
    // controle-positivo-e-por-assercao-nao-por-mecanismo).
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value="1"
        onChange={onChangeSpy}
        options={OPTIONS}
      />
    );
    const secondInput = screen.getByLabelText('Aluno');
    await user.click(secondInput);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('sem item destacado por padrão ao abrir ou ao filtrar (nenhuma opção com destaque até a primeira seta)', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    expect(
      screen.queryByRole('option', { selected: true })
    ).not.toBeInTheDocument();

    await user.type(input, 'a');
    expect(
      screen.queryByRole('option', { selected: true })
    ).not.toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('option', { selected: true })).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'João Silva' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('sem item destacado por padrão ao abrir mesmo quando value já tem uma opção selecionada', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value="2"
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    // Antes de qualquer seta: nenhuma opção destacada, nem a de `value`.
    expect(
      screen.queryByRole('option', { selected: true })
    ).not.toBeInTheDocument();
  });

  it('ArrowDown a partir de "nenhum destaque" vai para o primeiro item filtrado', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<ControlledSearchableSelectField onChangeSpy={onChangeSpy} />);
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChangeSpy).toHaveBeenCalledWith({
      target: { name: 'idAluno', value: '1' },
    });
  });

  it('ArrowUp a partir de "nenhum destaque" vai para o último item filtrado', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<ControlledSearchableSelectField onChangeSpy={onChangeSpy} />);
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.keyboard('{ArrowUp}{Enter}');

    expect(onChangeSpy).toHaveBeenCalledWith({
      target: { name: 'idAluno', value: '3' },
    });
  });

  it('hover do mouse escreve no mesmo estado de destaque do teclado (única fonte de "ativo" por vez)', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    await user.keyboard('{ArrowDown}'); // destaque do teclado em João (index 0)
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    await user.hover(options[1]); // mouse parado sobre Maria (index 1)
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    // Só uma fonte de "ativo" por vez — nunca dois destacados ao mesmo tempo.
    expect(screen.getAllByRole('option', { selected: true })).toHaveLength(1);
  });

  it('mudar o índice destacado (seta) aciona scrollIntoView sobre o item correspondente', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    await user.keyboard('{ArrowDown}');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: 'nearest',
    });
  });

  it('scrollIntoView é chamado sobre o item correto, não só "foi chamado"', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    // Duas setas seguidas: destaque avança de João(0) para Maria(1).
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(Element.prototype.scrollIntoView.mock.contexts.at(-1)).toBe(
      screen.getByRole('option', { name: 'Maria Souza' })
    );
  });

  it('NFR-001-001: com fixture de 1.000 opções, a lista reflete cada tecla em até ~300ms', () => {
    const bigOptions = Array.from({ length: 1000 }, (_, index) => ({
      value: String(index),
      label: `Opção número ${index} João`,
    }));
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={bigOptions}
      />
    );
    const input = screen.getByLabelText('Aluno');
    fireEvent.click(input);

    const keystrokes = ['j', 'jo', 'joã', 'joão', 'joão 1', 'joão 12'];
    keystrokes.forEach(text => {
      const start = performance.now();
      fireEvent.change(input, { target: { value: text } });
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(300);
    });
  });

  it('AC required: passado como true, o BaseField sufixa o rótulo com *', () => {
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        required
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    expect(screen.getByText('Aluno *')).toBeInTheDocument();
  });

  it('AC required: omitido ou false, sem sufixo no rótulo', () => {
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    expect(screen.getByText('Aluno')).toBeInTheDocument();
    expect(screen.queryByText('Aluno *')).not.toBeInTheDocument();
  });

  it('default de `options` é [] — renderiza sem lançar erro e abre em estado vazio', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
      />
    );
    const input = screen.getByLabelText('Aluno');
    await user.click(input);
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(
      screen.getByText('Nenhum resultado encontrado.')
    ).toBeInTheDocument();
  });

  it('`placeholder` aparece como atributo quando passado; omitido, não aparece com valor fixo', () => {
    const { rerender } = render(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
        placeholder="Buscar aluno"
      />
    );
    expect(screen.getByLabelText('Aluno')).toHaveAttribute(
      'placeholder',
      'Buscar aluno'
    );

    rerender(
      <SearchableSelectField
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    expect(screen.getByLabelText('Aluno')).not.toHaveAttribute('placeholder');
  });

  it('index.js reexporta SearchableSelectField e o barrel `@/components` resolve', () => {
    render(
      <SearchableSelectFieldFromBarrel
        htmlFor="idAluno"
        label="Aluno"
        value=""
        onChange={jest.fn()}
        options={OPTIONS}
      />
    );
    expect(screen.getByLabelText('Aluno')).toBeInTheDocument();
  });

  describe('AC-001-012: ação de limpar', () => {
    it('clique no botão de limpar chama onChange com valor vazio e não abre o seletor', async () => {
      const user = userEvent.setup();
      const onChangeSpy = jest.fn();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value="1"
          onChange={onChangeSpy}
          options={OPTIONS}
        />
      );
      const clearButton = screen.getByRole('button', {
        name: 'Limpar seleção',
      });
      await user.click(clearButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        target: { name: 'idAluno', value: '' },
      });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('após limpar (o botão desmonta), o foco volta ao input de busca em vez de cair no body, sem reabrir a lista', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchableSelectField initialValue="1" />);
      const clearButton = screen.getByRole('button', {
        name: 'Limpar seleção',
      });
      await user.click(clearButton);

      expect(
        screen.queryByRole('button', { name: 'Limpar seleção' })
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText('Aluno')).toHaveFocus();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('o botão de limpar carrega o token btn-icon, o anel de foco visível e não usa .input-field', () => {
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value="1"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const clearButton = screen.getByRole('button', {
        name: 'Limpar seleção',
      });
      expect(clearButton.classList.contains('btn-icon')).toBe(true);
      expect(clearButton.classList.contains('focus-visible:ring-2')).toBe(true);
      expect(clearButton.classList.contains('focus-visible:ring-inset')).toBe(
        true
      );
      expect(clearButton.classList.contains('input-field')).toBe(false);
    });

    it('input com value ganha pr-20 (espaço para o botão de limpar não sobrepor texto longo); sem value, pr-10', () => {
      const { rerender } = render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value="1"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      expect(screen.getByLabelText('Aluno').classList.contains('pr-20')).toBe(
        true
      );

      rerender(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      expect(screen.getByLabelText('Aluno').classList.contains('pr-10')).toBe(
        true
      );
    });

    it('sem value selecionado, o botão de limpar não é renderizado', () => {
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      expect(
        screen.queryByRole('button', { name: 'Limpar seleção' })
      ).not.toBeInTheDocument();
    });
  });

  describe('AC-001-013: blur sem seleção descarta o texto digitado', () => {
    it('Tab com texto digitado e nenhuma opção selecionada descarta o texto, não chama onChange e mantém a seleção anterior', async () => {
      const user = userEvent.setup();
      const onChangeSpy = jest.fn();
      render(
        <ControlledSearchableSelectField
          initialValue="1"
          onChangeSpy={onChangeSpy}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.type(input, 'zzz');
      await user.tab();

      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(input).toHaveValue('João Silva');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('clique fora com texto digitado e nenhuma opção selecionada descarta o texto, não chama onChange e mantém a seleção anterior', async () => {
      const user = userEvent.setup();
      const onChangeSpy = jest.fn();
      render(
        <ControlledSearchableSelectField
          initialValue="1"
          onChangeSpy={onChangeSpy}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.type(input, 'zzz');
      await user.click(document.body);

      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(input).toHaveValue('João Silva');
    });

    it('Enter sem nenhum item destacado não seleciona nada — controle positivo: Enter sobre o destaque seleciona (mesmo mock dispararia se regredisse)', async () => {
      const user = userEvent.setup();
      const onChangeSpy = jest.fn();
      const { unmount } = render(
        <ControlledSearchableSelectField onChangeSpy={onChangeSpy} />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.keyboard('{Enter}');
      expect(onChangeSpy).not.toHaveBeenCalled();
      unmount();

      render(<ControlledSearchableSelectField onChangeSpy={onChangeSpy} />);
      const secondInput = screen.getByLabelText('Aluno');
      await user.click(secondInput);
      await user.keyboard('{ArrowDown}{Enter}');
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('sem seleção implícita por texto parecido: estreitar a lista a exatamente 1 opção e sair sem clicar/Enter não seleciona', async () => {
      const user = userEvent.setup();
      const onChangeSpy = jest.fn();
      render(
        <ControlledSearchableSelectField
          initialValue=""
          onChangeSpy={onChangeSpy}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.type(input, 'Maria Souza');
      expect(screen.getAllByRole('option')).toHaveLength(1);
      await user.tab();

      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  describe('AC-001-008: rótulo fora da lista carregada (selectedLabel)', () => {
    it('value fora de options e selectedLabel definido usa selectedLabel', () => {
      render(
        <SearchableSelectField
          htmlFor="idContrato"
          label="Contrato"
          value="99"
          selectedLabel="Contrato #99 (não elegível)"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      expect(screen.getByLabelText('Contrato')).toHaveValue(
        'Contrato #99 (não elegível)'
      );
    });

    it('value fora de options sem selectedLabel cai no value bruto, nunca string vazia', () => {
      render(
        <SearchableSelectField
          htmlFor="idContrato"
          label="Contrato"
          value="99"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      expect(screen.getByLabelText('Contrato')).toHaveValue('99');
    });

    it('value dentro de options ignora selectedLabel, usa o rótulo real da opção', () => {
      render(
        <SearchableSelectField
          htmlFor="idContrato"
          label="Contrato"
          value="2"
          selectedLabel="Rótulo que não deveria aparecer"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      expect(screen.getByLabelText('Contrato')).toHaveValue('Maria Souza');
    });
  });

  describe('marca do valor atual na lista aberta', () => {
    it('abrir com value correspondendo a uma opção marca só essa opção (ícone + peso de fonte), sem tocar aria-selected/option-highlighted', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value="2"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);

      const options = screen.getAllByRole('option');
      expect(options[1]).toHaveAttribute('data-current', 'true');
      expect(options[0]).not.toHaveAttribute('data-current');
      expect(options[2]).not.toHaveAttribute('data-current');
      // A marca não usa aria-selected nem option-highlighted — exclusivos do
      // destaque de navegação, que continua -1 até a 1ª seta/hover.
      expect(options[1]).toHaveAttribute('aria-selected', 'false');
      expect(options[1]).not.toHaveClass('option-highlighted');
      expect(
        screen.getByTestId('searchable-select-field-current-mark')
      ).toBeInTheDocument();
      // Alternativa para leitor de tela, nunca "selecionado" (colidiria
      // semanticamente com aria-selected/aria-activedescendant).
      expect(
        within(options[1]).getByTestId(
          'searchable-select-field-current-mark-sr-text'
        )
      ).toHaveTextContent('valor atual');
    });

    it('ao abrir com value presente em options, rola até a opção atual via scrollIntoView — sobre o elemento certo, não só "foi chamado"', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value="3"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        block: 'nearest',
      });
      expect(Element.prototype.scrollIntoView.mock.contexts.at(-1)).toBe(
        screen.getByRole('option', { name: /José Santos/ })
      );
      expect(
        screen.queryByRole('option', { selected: true })
      ).not.toBeInTheDocument();
    });

    it('abrir digitando diretamente (mesmo lote que abre a lista) rola para a opção atual no espaço de índice de filteredOptions, não da lista completa', () => {
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value="3"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      // "jo" filtra para [João, José] — José muda de posição 2 (lista
      // completa) para 1 (lista filtrada); optionRefs é indexado pela lista
      // filtrada, então usar o índice da lista completa apontaria para um
      // ref inexistente e scrollIntoView nunca seria chamado sobre a opção
      // certa.
      fireEvent.change(input, { target: { value: 'jo' } });

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        block: 'nearest',
      });
      expect(Element.prototype.scrollIntoView.mock.contexts.at(-1)).toBe(
        screen.getByRole('option', { name: /José Santos/ })
      );
    });

    it('ao filtrar de forma que a opção marcada saia da lista, a marca some (nenhuma opção marcada)', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value="2"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.type(input, 'joão');

      expect(
        screen.queryByTestId('searchable-select-field-current-mark')
      ).not.toBeInTheDocument();
    });

    it('com value fora de options (caso do selectedLabel), nenhuma opção é marcada', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value="99"
          selectedLabel="Fora da lista"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);

      expect(
        screen.queryByTestId('searchable-select-field-current-mark')
      ).not.toBeInTheDocument();
    });
  });

  describe('disabledReason (FR-001-008/AC-001-007, contrato de prop)', () => {
    it('presente: exibe a mensagem no lugar da lista ao abrir, distinta do estado vazio (testid e texto próprios)', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idContrato"
          label="Contrato"
          value=""
          onChange={jest.fn()}
          options={[]}
          disabledReason="Selecione um Aluno antes"
        />
      );
      const input = screen.getByLabelText('Contrato');
      await user.click(input);

      expect(screen.getByText('Selecione um Aluno antes')).toBeInTheDocument();
      expect(
        screen.getByTestId('searchable-select-field-disabled-reason')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('searchable-select-field-disabled-icon')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('searchable-select-field-empty')
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('com a lista aberta, ArrowDown/Enter não têm efeito (sem opções renderizadas) e Escape ainda fecha', async () => {
      const user = userEvent.setup();
      const onChangeSpy = jest.fn();
      render(
        <SearchableSelectField
          htmlFor="idContrato"
          label="Contrato"
          value=""
          onChange={onChangeSpy}
          options={OPTIONS}
          disabledReason="Selecione um Aluno antes"
        />
      );
      const input = screen.getByLabelText('Contrato');
      await user.click(input);
      await user.keyboard('{ArrowDown}{ArrowUp}{Enter}');

      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(input).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('ausente: comportamento padrão de abertura inalterado', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idContrato"
          label="Contrato"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Contrato');
      await user.click(input);

      expect(
        screen.queryByTestId('searchable-select-field-disabled-reason')
      ).not.toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length);
    });
  });

  describe('requiredError (AC-001-014, contrato de prop — a lógica de quando popular é das TASK-002-006/007)', () => {
    it('definido: renderiza o texto com role="alert", aria-describedby aponta para ele, aria-invalid="true" no input', () => {
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
          requiredError="Campo obrigatório"
        />
      );
      const input = screen.getByLabelText('Aluno');
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Campo obrigatório');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', alert.id);
      expect(alert.classList.contains('text-danger')).toBe(true);
    });

    it('ausente: nenhum dos três (role="alert", aria-describedby, aria-invalid) aparece', () => {
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(input).not.toHaveAttribute('aria-invalid');
      expect(input).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('required chega como aria-required (nunca o atributo nativo)', () => {
    it('required: combobox tem aria-required="true", sem o atributo required nativo', () => {
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          required
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).not.toHaveAttribute('required');
    });

    it('omitido ou false: sem aria-required', () => {
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-required');
    });
  });

  describe('AC-001-015: leitor de tela', () => {
    it('nome acessível inclui o label — medido com computeAccessibleName (dom-accessibility-api), nunca deduzido da especificação', () => {
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      expect(computeAccessibleName(input)).toBe('Aluno');
    });

    it('aria-expanded reflete aberto/fechado', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('a opção destacada por teclado tem aria-selected="true" só nela', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
      expect(options[1]).toHaveAttribute('aria-selected', 'false');
      expect(options[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('o input tem aria-activedescendant apontando para o id estável da opção destacada por teclado, ausente sem destaque', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      expect(input).not.toHaveAttribute('aria-activedescendant');

      await user.keyboard('{ArrowDown}');
      const options = screen.getAllByRole('option');
      expect(input).toHaveAttribute('aria-activedescendant', options[0].id);

      await user.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-activedescendant', options[1].id);
    });

    it('depois de selecionar uma opção (ArrowDown+Enter), o input não tem mais aria-activedescendant', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      const options = screen.getAllByRole('option');
      expect(input).toHaveAttribute('aria-activedescendant', options[0].id);

      await user.keyboard('{Enter}');
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('depois de destacar por teclado e fechar com Escape, o input não tem mais aria-activedescendant', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      const options = screen.getAllByRole('option');
      expect(input).toHaveAttribute('aria-activedescendant', options[0].id);

      await user.keyboard('{Escape}');
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('durante isLoading sem erro, mesmo com destaque prévio, o input não tem aria-activedescendant (lista não renderizada)', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      const options = screen.getAllByRole('option');
      expect(input).toHaveAttribute('aria-activedescendant', options[0].id);

      rerender(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
          isLoading
        />
      );
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('aria-busy reflete isLoading', () => {
      const { rerender } = render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={[]}
          isLoading
        />
      );
      expect(screen.getByLabelText('Aluno')).toHaveAttribute(
        'aria-busy',
        'true'
      );

      rerender(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
          isLoading={false}
        />
      );
      expect(screen.getByLabelText('Aluno')).not.toHaveAttribute('aria-busy');
    });

    it('o estado vazio é anunciado — região com role="status" (alcançável por aria-live implícito)', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value=""
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      await user.click(input);
      await user.type(input, 'zzz');
      expect(screen.getByRole('status')).toHaveTextContent(
        'Nenhum resultado encontrado.'
      );
    });
  });

  describe('guarda de não-regressão: alvos de toque e temas (parte de AC-001-010 — medição real de layout é gate 9)', () => {
    it('input de busca, botão de limpar, container da listbox e cada opção carregam tap-target/.input-field; rótulo de opção tem break-words', async () => {
      const user = userEvent.setup();
      render(
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          value="1"
          onChange={jest.fn()}
          options={OPTIONS}
        />
      );
      const input = screen.getByLabelText('Aluno');
      expect(input.classList.contains('tap-target')).toBe(true);
      expect(input.classList.contains('input-field')).toBe(true);

      const clearButton = screen.getByRole('button', {
        name: 'Limpar seleção',
      });
      expect(clearButton.classList.contains('tap-target')).toBe(true);

      await user.click(input);

      const dropdown = screen.getByTestId('searchable-select-field-dropdown');
      expect(dropdown.classList.contains('input-field')).toBe(true);

      const options = screen.getAllByRole('option');
      options.forEach(option => {
        expect(option.classList.contains('tap-target')).toBe(true);
        // Espaço do ícone reservado em toda opção, marcada ou não, para o
        // rótulo alinhar na mesma coluna.
        expect(
          within(option).getByTestId('searchable-select-field-option-icon-slot')
        ).toBeInTheDocument();
      });

      const labelSpan = within(options[0]).getByTestId(
        'searchable-select-field-option-label'
      );
      expect(labelSpan.classList.contains('break-words')).toBe(true);
    });
  });
});
