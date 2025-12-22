'use client';

import { useToast } from '@/providers/ToastProvider';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, GraduationCap, Users } from 'lucide-react';

export default function AuthLayout({ children }) {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useUserAuth();
  const { success } = useToast();

  useEffect(() => {
    async function checkAuth() {
      if (await isAuthenticated()) {
        success(`Bem-vindo de volta, ${currentUser.nome}!`);
        router.push('/');
        return;
      }
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Lado Esquerdo - Imagem/Ilustração */}
          <div className="lg:w-1/2 bg-linear-to-br from-blue-600 to-indigo-700 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
            {/* Decoração de fundo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>

            <div className="relative z-10 text-center space-y-8">
              {/* Ícone principal */}
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-6 rounded-full backdrop-blur-sm">
                  <BookOpen size={64} strokeWidth={1.5} />
                </div>
              </div>

              <div>
                <h1 className="text-4xl font-bold mb-3">Diário de Classe</h1>
                <p className="text-lg text-blue-100 mb-8">
                  Sistema de Registro de Aulas
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6 text-left max-w-md mx-auto">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <GraduationCap size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Gerencie suas Aulas
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Registre e acompanhe o conteúdo de cada aula ministrada
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <Users size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Controle de Alunos
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Mantenha registro completo de frequência e progresso
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <div className="lg:w-1/2 p-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              {children}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Sistema exclusivo para professores da instituição</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
