import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <div>
            <Image
              className="h-full "
              src="/bls.png"
              alt="Logo da empresa BLS"
              width={50}
              height={50}
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Diário de Classe
          </h1>
        </div>
        <nav className="flex space-x-6">
          <Link
            href="#"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Sair
          </Link>
        </nav>
      </div>
    </header>
  );
};
