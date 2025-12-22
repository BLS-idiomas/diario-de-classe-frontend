import { render, screen } from '@testing-library/react';
import { Avatar } from './index';
import { useAvatar } from './useAvatar';

// Mock do hook useAvatar
jest.mock('./useAvatar');

describe('Avatar', () => {
  const mockGetTitleByText = jest.fn();
  const mockGetColorByText = jest.fn();
  const mockGetKeyByText = jest.fn();

  beforeEach(() => {
    // Configura o mock do hook
    useAvatar.mockReturnValue({
      getTitleByText: mockGetTitleByText,
      getColorByText: mockGetColorByText,
      getKeyByText: mockGetKeyByText,
    });

    // Limpa os mocks antes de cada teste
    mockGetTitleByText.mockClear();
    mockGetColorByText.mockClear();
    mockGetKeyByText.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render avatar with correct title', () => {
    mockGetTitleByText.mockReturnValue('JS');
    mockGetColorByText.mockReturnValue('bg-blue-500 text-white');
    mockGetKeyByText.mockReturnValue('João-Silva-avatar-key');

    render(<Avatar text="João Silva" />);

    const avatar = screen.getByTestId('avatar-component');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent('JS');
  });

  it('should call useAvatar hooks with provided text', () => {
    mockGetTitleByText.mockReturnValue('MA');
    mockGetColorByText.mockReturnValue('bg-red-400 text-white');
    mockGetKeyByText.mockReturnValue('Maria-Santos-avatar-key');

    render(<Avatar text="Maria Santos" />);

    expect(mockGetTitleByText).toHaveBeenCalledWith('Maria Santos');
    expect(mockGetColorByText).toHaveBeenCalledWith('Maria Santos');
    expect(mockGetKeyByText).toHaveBeenCalledWith('Maria Santos');
  });

  it('should apply correct color classes', () => {
    mockGetTitleByText.mockReturnValue('PC');
    mockGetColorByText.mockReturnValue('bg-purple-500 text-white');
    mockGetKeyByText.mockReturnValue('Pedro-Costa-avatar-key');

    render(<Avatar text="Pedro Costa" />);

    const avatar = screen.getByTestId('avatar-component');
    expect(avatar).toHaveClass('bg-purple-500');
    expect(avatar).toHaveClass('text-white');
  });

  it('should apply base styling classes', () => {
    mockGetTitleByText.mockReturnValue('AC');
    mockGetColorByText.mockReturnValue('bg-green-500 text-white');
    mockGetKeyByText.mockReturnValue('Ana-Costa-avatar-key');

    render(<Avatar text="Ana Costa" />);

    const avatar = screen.getByTestId('avatar-component');
    expect(avatar).toHaveClass('w-14');
    expect(avatar).toHaveClass('h-14');
    expect(avatar).toHaveClass('rounded-full');
    expect(avatar).toHaveClass('flex');
    expect(avatar).toHaveClass('items-center');
    expect(avatar).toHaveClass('justify-center');
    expect(avatar).toHaveClass('text-lg');
    expect(avatar).toHaveClass('font-bold');
  });

  it('should set correct id and key attributes', () => {
    mockGetTitleByText.mockReturnValue('CE');
    mockGetColorByText.mockReturnValue('bg-yellow-600 text-white');
    mockGetKeyByText.mockReturnValue('Carlos-Eduardo-avatar-key');

    render(<Avatar text="Carlos Eduardo" />);

    const avatar = screen.getByTestId('avatar-component');
    expect(avatar).toHaveAttribute('id', 'Carlos-Eduardo-avatar-key');
  });

  it('should render with different color for different text', () => {
    mockGetTitleByText.mockReturnValue('LO');
    mockGetColorByText.mockReturnValue('bg-teal-500 text-white');
    mockGetKeyByText.mockReturnValue('Lucas-Oliveira-avatar-key');

    render(<Avatar text="Lucas Oliveira" />);

    const avatar = screen.getByTestId('avatar-component');
    expect(avatar).toHaveTextContent('LO');
    expect(avatar).toHaveClass('bg-teal-500');
  });

  it('should handle single word names', () => {
    mockGetTitleByText.mockReturnValue('JO');
    mockGetColorByText.mockReturnValue('bg-pink-500 text-white');
    mockGetKeyByText.mockReturnValue('João-avatar-key');

    render(<Avatar text="João" />);

    const avatar = screen.getByTestId('avatar-component');
    expect(avatar).toHaveTextContent('JO');
  });

  it('should handle names with multiple words', () => {
    mockGetTitleByText.mockReturnValue('JP');
    mockGetColorByText.mockReturnValue('bg-indigo-500 text-white');
    mockGetKeyByText.mockReturnValue('João-Pedro-Silva-avatar-key');

    render(<Avatar text="João Pedro Silva" />);

    const avatar = screen.getByTestId('avatar-component');
    expect(avatar).toHaveTextContent('JP');
    expect(mockGetTitleByText).toHaveBeenCalledTimes(1);
  });

  it('should render with empty text', () => {
    mockGetTitleByText.mockReturnValue('');
    mockGetColorByText.mockReturnValue('bg-blue-500 text-white');
    mockGetKeyByText.mockReturnValue('-avatar-key');

    render(<Avatar text="" />);

    const avatar = screen.getByTestId('avatar-component');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent('');
  });

  it('should call all hook methods exactly once', () => {
    mockGetTitleByText.mockReturnValue('TS');
    mockGetColorByText.mockReturnValue('bg-orange-500 text-white');
    mockGetKeyByText.mockReturnValue('Test-User-avatar-key');

    render(<Avatar text="Test User" />);

    expect(mockGetTitleByText).toHaveBeenCalledTimes(1);
    expect(mockGetColorByText).toHaveBeenCalledTimes(1);
    expect(mockGetKeyByText).toHaveBeenCalledTimes(1);
  });

  it('should maintain consistent rendering with same text', () => {
    mockGetTitleByText.mockReturnValue('FS');
    mockGetColorByText.mockReturnValue('bg-cyan-500 text-white');
    mockGetKeyByText.mockReturnValue('Fernando-Santos-avatar-key');

    const { rerender } = render(<Avatar text="Fernando Santos" />);

    const avatar1 = screen.getByTestId('avatar-component');
    expect(avatar1).toHaveTextContent('FS');
    expect(avatar1).toHaveClass('bg-cyan-500');

    // Re-renderiza com o mesmo texto
    rerender(<Avatar text="Fernando Santos" />);

    const avatar2 = screen.getByTestId('avatar-component');
    expect(avatar2).toHaveTextContent('FS');
    expect(avatar2).toHaveClass('bg-cyan-500');
  });

  it('should update when text prop changes', () => {
    // Primeiro render
    mockGetTitleByText.mockReturnValue('AB');
    mockGetColorByText.mockReturnValue('bg-red-400 text-white');
    mockGetKeyByText.mockReturnValue('Ana-Beatriz-avatar-key');

    const { rerender } = render(<Avatar text="Ana Beatriz" />);

    let avatar = screen.getByTestId('avatar-component');
    expect(avatar).toHaveTextContent('AB');
    expect(avatar).toHaveClass('bg-red-400');

    // Segundo render com texto diferente
    mockGetTitleByText.mockReturnValue('CD');
    mockGetColorByText.mockReturnValue('bg-green-500 text-white');
    mockGetKeyByText.mockReturnValue('Carlos-Diego-avatar-key');

    rerender(<Avatar text="Carlos Diego" />);

    avatar = screen.getByTestId('avatar-component');
    expect(avatar).toHaveTextContent('CD');
    expect(avatar).toHaveClass('bg-green-500');
  });

  describe('visual appearance', () => {
    it('should have circular shape', () => {
      mockGetTitleByText.mockReturnValue('RO');
      mockGetColorByText.mockReturnValue('bg-blue-500 text-white');
      mockGetKeyByText.mockReturnValue('Roberto-avatar-key');

      render(<Avatar text="Roberto" />);

      const avatar = screen.getByTestId('avatar-component');
      expect(avatar).toHaveClass('rounded-full');
    });

    it('should have fixed size', () => {
      mockGetTitleByText.mockReturnValue('MI');
      mockGetColorByText.mockReturnValue('bg-purple-500 text-white');
      mockGetKeyByText.mockReturnValue('Mariana-avatar-key');

      render(<Avatar text="Mariana" />);

      const avatar = screen.getByTestId('avatar-component');
      expect(avatar).toHaveClass('w-14');
      expect(avatar).toHaveClass('h-14');
    });

    it('should center content', () => {
      mockGetTitleByText.mockReturnValue('GF');
      mockGetColorByText.mockReturnValue('bg-teal-500 text-white');
      mockGetKeyByText.mockReturnValue('Gabriel-Ferreira-avatar-key');

      render(<Avatar text="Gabriel Ferreira" />);

      const avatar = screen.getByTestId('avatar-component');
      expect(avatar).toHaveClass('flex');
      expect(avatar).toHaveClass('items-center');
      expect(avatar).toHaveClass('justify-center');
    });

    it('should have bold text', () => {
      mockGetTitleByText.mockReturnValue('LS');
      mockGetColorByText.mockReturnValue('bg-yellow-600 text-white');
      mockGetKeyByText.mockReturnValue('Laura-Silva-avatar-key');

      render(<Avatar text="Laura Silva" />);

      const avatar = screen.getByTestId('avatar-component');
      expect(avatar).toHaveClass('font-bold');
      expect(avatar).toHaveClass('text-lg');
    });
  });

  describe('integration with useAvatar hook', () => {
    it('should properly integrate title generation', () => {
      mockGetTitleByText.mockReturnValue('RC');
      mockGetColorByText.mockReturnValue('bg-indigo-500 text-white');
      mockGetKeyByText.mockReturnValue('Rafael-Costa-avatar-key');

      render(<Avatar text="Rafael Costa" />);

      expect(mockGetTitleByText).toHaveBeenCalledWith('Rafael Costa');
      const avatar = screen.getByTestId('avatar-component');
      expect(avatar).toHaveTextContent('RC');
    });

    it('should properly integrate color generation', () => {
      mockGetTitleByText.mockReturnValue('BM');
      mockGetColorByText.mockReturnValue('bg-pink-500 text-white');
      mockGetKeyByText.mockReturnValue('Beatriz-Martins-avatar-key');

      render(<Avatar text="Beatriz Martins" />);

      expect(mockGetColorByText).toHaveBeenCalledWith('Beatriz Martins');
      const avatar = screen.getByTestId('avatar-component');
      expect(avatar).toHaveClass('bg-pink-500');
      expect(avatar).toHaveClass('text-white');
    });

    it('should properly integrate key generation', () => {
      mockGetTitleByText.mockReturnValue('TN');
      mockGetColorByText.mockReturnValue('bg-orange-500 text-white');
      mockGetKeyByText.mockReturnValue('Thiago-Nunes-avatar-key');

      render(<Avatar text="Thiago Nunes" />);

      expect(mockGetKeyByText).toHaveBeenCalledWith('Thiago Nunes');
      const avatar = screen.getByTestId('avatar-component');
      expect(avatar).toHaveAttribute('id', 'Thiago-Nunes-avatar-key');
    });
  });
});
