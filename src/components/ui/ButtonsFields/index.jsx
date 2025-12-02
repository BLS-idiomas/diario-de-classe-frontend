import Link from 'next/link';

export const ButtonsFields = ({ isSubmitting, isLoading, href }) => {
  return (
    <div className="flex justify-end gap-4 mt-8">
      <Link href={href} className="btn btn-secondary">
        Cancelar
      </Link>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn btn-primary ${isSubmitting && 'blocked'}`}
      >
        {isLoading ? 'Criando...' : 'Salvar'}
      </button>
    </div>
  );
};
