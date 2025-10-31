'use client';

import { useHealth } from '@/hooks/useHealth';

export const HealthCheck = () => {
  const { data, isLoading, error, refetch } = useHealth({
    retry: 1,
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });

  const getStatusColor = () => {
    if (isLoading) return 'text-yellow-600';
    if (error) return 'text-red-600';
    if (data) return 'text-green-600';
    return 'text-gray-600';
  };

  const getStatusText = () => {
    if (isLoading) return 'Verificando...';
    if (error) return 'API Offline';
    if (data) return 'API Online';
    return 'Desconhecido';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Status da API</h3>
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          {data && (
            <p className="text-xs text-gray-500 mt-1">
              Última verificação: {new Date().toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end">
          <div
            className={`w-3 h-3 rounded-full ${
              isLoading
                ? 'bg-yellow-400 animate-pulse'
                : error
                  ? 'bg-red-400'
                  : data
                    ? 'bg-green-400'
                    : 'bg-gray-400'
            }`}
          ></div>

          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verificando...' : 'Verificar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-700">
            <strong>Erro:</strong> {error.message}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Verifique se o servidor está rodando em{' '}
            <code className="bg-red-100 px-1 rounded">
              {process.env.NEXT_PUBLIC_API_URL}
            </code>
          </p>
        </div>
      )}

      {data && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700">
            <strong>Resposta:</strong>
          </p>
          <pre className="text-xs text-green-600 mt-1 bg-green-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
