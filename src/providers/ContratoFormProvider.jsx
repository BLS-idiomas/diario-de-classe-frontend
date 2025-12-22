'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserAuth } from './UserAuthProvider';
import { useToast } from './ToastProvider';
import { useGenerateAulasByContrato } from '@/hooks/contratos/useGenerateAulasByContrato';
import { useStep1Form } from '@/hooks/contratos/useStep1Form';
import { useStep2Form } from '@/hooks/contratos/useStep2Form';
import { useStep3Form } from '@/hooks/contratos/useStep3Form';
import { useStep4Form } from '@/hooks/contratos/useStep4Form';
import { useStep5Form } from '@/hooks/contratos/useStep5Form';

const ContratoFormContext = createContext();

export function ContratoFormProvider({ children }) {
  const router = useRouter();
  const { currentUser } = useUserAuth();
  const { success, error, warning, info } = useToast();
  const [backUrl, setBackUrl] = useState('/contratos');
  const [mode, setMode] = useState('create');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    professorId: currentUser.id || null,
    professor: currentUser || null,
    alunoId: null,
    aluno: null,
    contratoId: null,
    contrato: null,
    diasAulas: [],
    currentDiasAulas: [],
    aulas: [],
  });
  const [errors, setErrors] = useState({
    titleError: null,
    formErrors: {},
  });

  const successSubmit = () => {
    if (step > 5) {
      error('Etapa inválida');
      router.push(backUrl);
      return;
    }
    if (step === 5) {
      success('Contrato criado com sucesso!');
      router.push(`/contratos/${formData.contratoId}`);
      return;
    }

    const newStep = step + 1;
    setStep(newStep);
    setIsLoading(false);
    moveToStep(newStep);
  };

  const errorSubmit = ({ message, errors }) => {
    setErrors({ titleError: message, formErrors: errors });
    setIsLoading(false);
    warning('Existem erros no formulário. Verifique e tente novamente.');
  };

  const clearError = () => {
    setErrors({ titleError: null, formErrors: {} });
  };

  const commonPropsToStep = {
    successSubmit,
    errorSubmit,
    clearError,
    setFormData,
  };

  const { submitStep1 } = useStep1Form(commonPropsToStep);
  const { submitStep2 } = useStep2Form(commonPropsToStep);
  const { submitStep3 } = useStep3Form(commonPropsToStep);
  const { submitStep4 } = useStep4Form(commonPropsToStep);
  const { submitStep5 } = useStep5Form(commonPropsToStep);
  const { generateAulasByContrato } =
    useGenerateAulasByContrato(commonPropsToStep);

  const initialFormData = ({
    initialBackUrl,
    initialMode,
    initialStep,
    initialFormData,
  }) => {
    if (initialBackUrl) {
      setBackUrl(initialBackUrl);
    }
    if (initialMode) {
      setMode(initialMode);
    }
    if (initialFormData) {
      setFormData(initialFormData);
    }
    if (initialStep) {
      setStep(initialStep);
      moveToStep(initialStep);
    }
  };

  const getPageTitle = () => {
    return mode === 'create' ? 'Novo Contrato' : 'Atualização do contrato';
  };

  const getPageSubTitle = () => {
    return mode === 'create'
      ? 'Preencha os dados para criar um novo contrato'
      : 'Atualize os dados do contrato';
  };

  const setAluno = aluno => {
    setFormData(prev => ({
      ...prev,
      aluno,
    }));
  };

  const setProfessor = professor => {
    setFormData(prev => ({
      ...prev,
      professor,
    }));
  };

  const setDiasAulas = diasAulas => {
    setFormData(prev => ({
      ...prev,
      diasAulas,
    }));
  };

  const setAulas = aulas => {
    setFormData(prev => ({
      ...prev,
      aulas,
    }));
  };

  const back = () => {
    const newStep = step - 1;
    setStep(newStep);
    moveToStep(newStep);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setIsLoading(true);

    const actions = {
      1: submitStep1,
      2: submitStep2,
      3: submitStep3,
      4: submitStep4,
      5: submitStep5,
    };
    actions[step](formData);
  };

  const getNewStepByFormData = formData => {
    const {
      professorId,
      alunoId,
      aluno,
      contratoId,
      contrato,
      currentDiasAulas,
      aulas,
    } = formData;
    const step2 = contratoId && contrato && professorId && alunoId && aluno;
    const step3 = step2 && currentDiasAulas && currentDiasAulas.length > 0;
    const step4 = step3 && contrato.dataInicio && contrato.dataTermino;
    const step5 = step4 && aulas && aulas.length > 0;
    if (Boolean(step5)) return 5;
    if (Boolean(step4)) return 4;
    if (Boolean(step3)) return 3;
    if (Boolean(step2)) return 2;
    return 1;
  };

  const moveToStep = stepNumber => {
    return router.push(`/contratos/formulario/step${stepNumber}`);
  };

  return (
    <ContratoFormContext.Provider
      value={{
        pageTitle: getPageTitle(),
        pageSubTitle: getPageSubTitle(),
        step,
        isLoading,
        mode: mode,
        backUrl: backUrl,
        formData,
        titleError: errors.titleError,
        formErrors: errors.formErrors,
        setProfessor,
        setAluno,
        setDiasAulas,
        setAulas,
        generateAulasByContrato,
        handleChange,
        initialFormData,
        handleSubmit,
        back,
        getNewStepByFormData,
      }}
    >
      {children}
    </ContratoFormContext.Provider>
  );
}

export function useContratoForm() {
  return useContext(ContratoFormContext);
}
