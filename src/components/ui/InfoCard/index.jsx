import { useInfoCard } from './useInfoCard';

export const InfoCard = ({ columns, bgColor }) => {
  const { getClassName, getBgColor } = useInfoCard();
  return (
    <div
      className={`p-3 rounded-md ${getBgColor(bgColor)} shadow-sm`}
      data-testid="info-card"
    >
      {columns.map((column, index) => (
        <div key={index} className={getClassName(index, column)}>
          {column.text}
        </div>
      ))}
    </div>
  );
};
