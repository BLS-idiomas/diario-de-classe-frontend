'use client';

import { useEffect } from 'react';
import { useContratoForm } from '@/providers/ContratoFormProvider';
import { Loading } from '@/components';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getContrato } from '@/store/slices/contratosSlice';
import { useUserAuth } from '@/providers/UserAuthProvider';

export default function FormularioContrato() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { status, message, errors, current, action } = useSelector(
    state => state.contratos
  );
  const { list } = useSelector(state => state.professores);
  const { currentUser } = useUserAuth();
  const { initialFormData, getNewStepByFormData } = useContratoForm();
  const id = searchParams.get('id');
  const mode = searchParams.get('mode');
  const backUrl = searchParams.get('backUrl');
  const loadStep = mode && mode !== 'create';

  useEffect(() => {
    if (loadStep && id) {
      dispatch(getContrato({ id, withRelations: true }));
    } else {
      router.push('/contratos/formulario/step1');
    }
  }, [loadStep, router, dispatch, id]);

  useEffect(() => {
    if (!loadStep || !current || !list) {
      return;
    }

    const alunoId = current.idAluno || null;
    const aluno = current.aluno || null;
    const currentDiasAulas = current.diaAulas || [];
    const aulas = current.aulas || [];
    const firstProfessor =
      aulas.length === 0 ? null : aulas.find(aula => aula.tipo === 'PADRAO');
    const professorId = firstProfessor?.idProfessor || null;
    const professor =
      currentUser.id === professorId
        ? currentUser
        : list.find(professor => professor.id === professorId) || null;
    const contrato = {
      id: current.id,
      idAluno: current.idAluno,
      dataInicio: current.dataInicio,
      dataTermino: current.dataTermino,
      status: current.status,
      totalAulas: current.totalAulas,
      totalAulasFeitas: current.totalAulasFeitas,
      totalReposicoes: current.totalReposicoes,
      totalFaltas: current.totalFaltas,
      totalAulasCanceladas: current.totalAulasCanceladas,
      dataCriacao: current.dataCriacao,
      dataAtualizacao: current.dataAtualizacao,
    };
    const data = {
      professorId: professorId,
      professor: professor,
      alunoId: alunoId,
      aluno: aluno,
      contratoId: id,
      contrato: contrato,
      diasAulas: [],
      currentDiasAulas: currentDiasAulas,
      aulas: aulas,
    };
    initialFormData({
      initialBackUrl: backUrl,
      initialMode: mode,
      initialStep: getNewStepByFormData(data),
      initialFormData: data,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, list, id, backUrl, mode, loadStep]);

  return <Loading />;
}
