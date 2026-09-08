import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLivro } from '@/store/slices/livrosSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

export function useLivro(id) {
  const dispatch = useDispatch();
  const { current, conteudos, message, status, statusError, action } =
    useSelector(state => state.livros);
  const isAction = action === 'getLivro';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);
  const isSuccess = isAction && status === STATUS.SUCCESS;
  const isFailed = isAction && status === STATUS.FAILED;
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current &&
    isAction;

  useEffect(() => {
    if (id) dispatch(getLivro(id));
  }, [dispatch, id]);

  return {
    livro: current,
    conteudos,
    message,
    isLoading,
    isSuccess,
    isFailed,
    isNotFound,
  };
}
