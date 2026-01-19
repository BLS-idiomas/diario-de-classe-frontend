import Link from 'next/link';
import { PageTitle } from '@/components/ui/PageTitle';
import { PageSubTitle } from '@/components/ui/PageSubTitle';
import { CircleAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto mb-6 flex items-center justify-center h-22 w-22 rounded-full bg-red-100">
        <CircleAlert className="h-10 w-10 text-red-600" />
      </div>

      <PageTitle>Página não encontrada</PageTitle>

      <PageSubTitle>
        A página que você está tentando acessar não existe ou foi movida.
      </PageSubTitle>

      <PageSubTitle>
        Verifique o endereço ou volte para a página inicial.
      </PageSubTitle>

      <div className="mt-6">
        <div className="flex flex-wrap justify-center">
          <Link href="/" className="inline-block text-center">
            <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
              Voltar para o início
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
