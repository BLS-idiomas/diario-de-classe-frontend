import Link from 'next/link';

export const ButtonsFields = ({ isLoading, href, blocked = false }) => {
  return (
    <div className="flex justify-end gap-4 mt-8">
      <Link href={href} className="btn btn-secondary">
        Cancelar
      </Link>

      <button
        type="submit"
        disabled={isLoading || blocked}
        className={`btn btn-primary ${isLoading && 'blocked'}`}
      >
        {isLoading ? 'Criando...' : 'Salvar'}
      </button>
    </div>
  );
};
