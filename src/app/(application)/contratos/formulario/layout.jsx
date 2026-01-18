'use client';

import Link from 'next/link';
import {
  ContratoFormProvider,
  useContratoForm,
} from '@/providers/ContratoFormProvider';
import { Form, FormError, PageSubTitle, PageTitle } from '@/components';
import {
  UserCircle,
  Calendar,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Loader2,
} from 'lucide-react';

const STEPS_CONFIG = [
  {
    number: 1,
    title: 'Aluno',
    description: 'Selecione o aluno',
    icon: UserCircle,
  },
  {
    number: 2,
    title: 'Dias de Aula',
    description: 'Defina os dias da semana',
    icon: Calendar,
  },
  {
    number: 3,
    title: 'Período',
    description: 'Início e término',
    icon: CalendarDays,
  },
  {
    number: 4,
    title: 'Aulas',
    description: 'Visualize as aulas',
    icon: ClipboardList,
  },
  {
    number: 5,
    title: 'Confirmação',
    description: 'Revisar e finalizar',
    icon: CheckCircle2,
  },
];

function FormularioContratoContent({ children }) {
  const {
    isLoading,
    pageTitle,
    pageSubTitle,
    step,
    titleError,
    formErrors,
    handleSubmit,
    back,
  } = useContratoForm();

  return (
    <>
      {/* Header com botão cancelar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <PageTitle>{pageTitle}</PageTitle>
          <PageSubTitle>{pageSubTitle}</PageSubTitle>
        </div>
        <Link
          href="/contratos"
          className="btn btn-outline btn-outline-secondary flex items-center gap-2"
        >
          <X size={18} />
          Cancelar
        </Link>
      </div>
      {/* Formulário */}
      <Form handleSubmit={handleSubmit}>
        {/* Stepper Visual */}
        <div className="mb-10">
          {/* Desktop Stepper */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between">
              {STEPS_CONFIG.map((stepConfig, index) => {
                const Icon = stepConfig.icon;
                const isCompleted = step > stepConfig.number;
                const isActive = step === stepConfig.number;
                const isUpcoming = step < stepConfig.number;

                return (
                  <div
                    key={stepConfig.number}
                    className="flex items-center flex-1"
                  >
                    <div className="flex flex-col items-center flex-1">
                      {/* Ícone e número */}
                      <div
                        className={`
                      relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all
                      ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : ''}
                      ${isActive ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-lg scale-110' : ''}
                      ${isUpcoming ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                    `}
                      >
                        {isCompleted ? (
                          <Check size={28} strokeWidth={3} />
                        ) : (
                          <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
                        )}
                      </div>

                      {/* Título e descrição */}
                      <div className="mt-3 text-center">
                        <div
                          className={`font-semibold ${isActive ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}
                        >
                          {stepConfig.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {stepConfig.description}
                        </div>
                      </div>
                    </div>

                    {/* Linha conectora */}
                    {index < STEPS_CONFIG.length - 1 && (
                      <div className="flex-1 h-0.5 mx-4 -mt-8">
                        <div
                          className={`h-full transition-all ${isCompleted ? 'bg-blue-500' : 'bg-gray-300'}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile/Tablet Stepper */}
          <div className="lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-4">
              {STEPS_CONFIG.map(stepConfig => {
                const isCompleted = step > stepConfig.number;
                const isActive = step === stepConfig.number;

                return (
                  <div
                    key={stepConfig.number}
                    className={`
                    h-2 rounded-full flex-1 transition-all
                    ${isCompleted ? 'bg-blue-500' : ''}
                    ${isActive ? 'bg-blue-400' : ''}
                    ${!isCompleted && !isActive ? 'bg-gray-300' : ''}
                  `}
                  />
                );
              })}
            </div>

            {/* Step atual mobile */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-3 bg-blue-50 px-6 py-3 rounded-full">
                {(() => {
                  const Icon = STEPS_CONFIG[step - 1].icon;
                  return <Icon size={24} className="text-blue-600" />;
                })()}
                <div>
                  <div className="text-sm font-semibold text-blue-600">
                    Passo {step} de 5
                  </div>
                  <div className="text-xs text-gray-600">
                    {STEPS_CONFIG[step - 1].title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FormError title={titleError} errors={formErrors} />
        {children}

        {/* Botões de navegação */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <div>
            {step > 1 && (
              <button
                onClick={back}
                className="btn btn-outline btn-outline-secondary flex items-center gap-2 w-full sm:w-auto"
              >
                <ArrowLeft size={18} />
                Voltar
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary flex items-center gap-2 justify-center w-full sm:w-auto ${isLoading && 'opacity-75 cursor-not-allowed'}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : step === 5 ? (
              <>
                <Check size={18} />
                Finalizar
              </>
            ) : (
              <>
                Próximo
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </Form>
    </>
  );
}

export default function FormularioContratoLayout({ children }) {
  return (
    <ContratoFormProvider>
      <FormularioContratoContent>{children}</FormularioContratoContent>
    </ContratoFormProvider>
  );
}
