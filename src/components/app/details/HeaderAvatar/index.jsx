import { Avatar } from '@/components/ui';

export const HeaderAvatar = ({ entity }) => {
  const nomeCompleto = `${entity.nome} ${entity.sobrenome}`;
  const { email } = entity;
  // TODO melhora cor da sidebar
  return (
    <div className="flex items-center gap-4 mb-3">
      <Avatar text={nomeCompleto} />
      <div>
        <div className="text-xl text-main font-semibold">{nomeCompleto}</div>
        <div className="text-sm text-muted">{email}</div>
      </div>
    </div>
  );
};
