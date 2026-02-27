export function useFormater() {
  const telefoneFormatter = telefone => {
    if (!telefone) return '-';

    telefone = telefone.replace(/\D/g, '');

    const ddd = `(${telefone.slice(0, 2)})`;
    const parte1 =
      telefone.length === 11 ? telefone.slice(2, 7) : telefone.slice(2, 6);

    const parte2 =
      telefone.length === 11 ? telefone.slice(7) : telefone.slice(6);

    return `${ddd} ${parte1}-${parte2}`;
  };

  const dataFormatter = dataCriacao => {
    if (!dataCriacao) return '-';
    const [ano, mes, dia] = dataCriacao.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatForInput = iso => (iso ? iso.split('T')[0] : '');

  return { telefoneFormatter, dataFormatter, formatForInput };
}
