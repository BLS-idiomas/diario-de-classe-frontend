import packageJson from '../../../../package.json';

export const Footer = () => {
  const anoAtual = new Date().getFullYear();
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center">
          <p className="text-gray-600">© {anoAtual} BLS Idiomas.</p>
          <p className="text-sm text-gray-600">v{packageJson.version}</p>
        </div>
      </div>
    </footer>
  );
};
