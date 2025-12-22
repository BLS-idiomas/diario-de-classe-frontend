import { useAvatar } from './useAvatar';

export const Avatar = ({ text, className }) => {
  const { getTitleByText, getColorByText, getKeyByText } = useAvatar();
  const title = getTitleByText(text);
  const colorClass = getColorByText(text);
  const id = getKeyByText(text);
  const finalClassName = className || 'w-14 h-14';
  return (
    <div
      key={id}
      id={id}
      className={` rounded-full ${colorClass} flex items-center justify-center text-lg font-bold ${finalClassName}`}
      data-testid="avatar-component"
    >
      {title}
    </div>
  );
};
