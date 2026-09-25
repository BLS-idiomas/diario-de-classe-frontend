import Link from 'next/link';

export const ButtonsFields = ({
  isLoading,
  href,
  blocked = false,
  onCancel,
  savingLabel = 'Criando...',
}) => {
  return (
    <div className="flex justify-end gap-4 mt-8" data-testid="buttons-fields">
      {onCancel ? (
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
      ) : (
        <Link href={href} className="btn btn-secondary">
          Cancelar
        </Link>
      )}

      <button
        type="submit"
        disabled={isLoading || blocked}
        className={`btn btn-primary ${isLoading || blocked ? 'blocked' : ''}`}
      >
        {isLoading ? savingLabel : 'Salvar'}
      </button>
    </div>
  );
};
