export function useInfoCard() {
  const getClassName = (index, column) => {
    const className = ['text-sm'];
    const { type } = column;

    switch (index) {
      case 0:
        className.push('');
      case 1:
        className.push('mt-2');
      default:
        className.push('mt-1');
    }

    switch (type) {
      case 'header':
        className.push('text-main');
      case 'bold':
        className.push('font-medium');
      default:
        className.push('text-muted');
    }

    return className.join(' ');
  };

  const getBgColor = color => {
    const colors = {
      gray: 'bg-secondary', // TODO renomear para secondary
      white: 'bg-main', // TODO renomear para main
    };

    return colors[color] || colors.gray;
  };

  return {
    getClassName,
    getBgColor,
  };
}
