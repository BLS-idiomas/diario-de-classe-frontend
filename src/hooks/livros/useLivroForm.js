import { useState } from 'react';
import { IDIOMA } from '@/constants';
import { proximoNivelLivro } from '@/utils/proximoNivelLivro';

/**
 * Estado do formulário de livro.
 *
 * Os valores iniciais saem do `useState`, sem efeito de sincronização: quem
 * edita só monta o formulário depois que o livro chegou do servidor, e quem
 * cria só monta depois que o catálogo carregou (ver as páginas). Reidratar via
 * `useEffect` provocaria renders em cascata e é o que a regra
 * `react-hooks/set-state-in-effect` bloqueia neste projeto.
 *
 * Ao criar, o idioma vem preenchido com inglês e o nível com o próximo livre na
 * trilha daquele idioma. São apenas defaults -- o banco não tem unicidade em
 * (idioma, nivel) e o usuário pode trocar os dois.
 */
export function useLivroForm({ id = null, submit, livro = null, livros = [] }) {
  const idiomaInicial = livro?.idioma || IDIOMA.INGLES;
  const nivelSugeridoInicial = livro
    ? null
    : proximoNivelLivro(livros, idiomaInicial);

  const [formData, setFormData] = useState(() => ({
    nome: livro?.nome || '',
    idioma: idiomaInicial,
    nivel: livro ? (livro.nivel ?? '') : nivelSugeridoInicial,
    ativo: livro?.ativo ?? true,
  }));

  // Guarda a última sugestão para saber se o usuário mexeu no nível à mão: se
  // mexeu, trocar o idioma não pode sobrescrever a escolha dele.
  const [nivelSugerido, setNivelSugerido] = useState(nivelSugeridoInicial);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const valorNovo = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const proximo = { ...prev, [name]: valorNovo };

      // Nível é a ordem do livro dentro do idioma, então trocar o idioma
      // ressugere o nível -- só na criação e só se o campo ainda está com a
      // sugestão anterior intacta.
      if (name === 'idioma' && !livro && Number(prev.nivel) === nivelSugerido) {
        const sugestao = proximoNivelLivro(livros, valorNovo);
        setNivelSugerido(sugestao);
        proximo.nivel = sugestao;
      }

      return proximo;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    submit({
      id,
      dataToSend: {
        ...formData,
        // O campo é texto no input mas número na API. Vazio precisa virar
        // `null`, e não `undefined`: undefined é descartado do corpo JSON, o
        // backend trata o campo como ausente e o nível antigo permanece
        // gravado -- ou seja, não havia como limpar o nível na edição.
        nivel:
          formData.nivel === '' || formData.nivel === null
            ? null
            : Number(formData.nivel),
      },
    });
  };

  return {
    formData,
    handleSubmit,
    handleChange,
    setFormData,
  };
}
