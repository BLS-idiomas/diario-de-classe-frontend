import { useState } from 'react';
import { DownloadCronogramaExcelService } from '@/services/cronograma/downloadCronogramaExcelService';
import { useToast } from '@/providers/ToastProvider';

export function useDownloadCronograma(idAluno) {
  const { error } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (nomeArquivo = 'cronograma') => {
    if (!idAluno) return;

    setIsDownloading(true);

    try {
      const res = await DownloadCronogramaExcelService.handle(idAluno);

      // 204: aluno sem livro em curso, não há planilha para baixar.
      if (!res?.data || res.status === 204) {
        error('Este aluno ainda não tem cronograma.');
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${nomeArquivo}.xlsx`);
      document.body.appendChild(link);
      link.click();
      // Sem remover o link e revogar a URL, cada download deixaria um nó e um
      // blob presos na memória da aba.
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      error('Erro ao baixar a planilha do cronograma.');
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    handleDownload,
  };
}
