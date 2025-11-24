import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardService } from '@/services/board.service';
import { clientService } from '@/services/client.service';
import { ArrowLeft, Plus } from 'lucide-react';
import PhaseColumn from '@/components/PhaseColumn';

export default function ClientBoardPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const queryClient = useQueryClient();

  const { data: client } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientService.getClient(clientId!),
    enabled: !!clientId,
  });

  const { data: board, isLoading } = useQuery({
    queryKey: ['board', clientId],
    queryFn: () => boardService.getBoard(clientId!),
    enabled: !!clientId,
  });

  const updateActionMutation = useMutation({
    mutationFn: ({ actionId, data }: { actionId: string; data: any }) =>
      boardService.updateAction(actionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', clientId] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  if (!board) {
    return <div className="text-center py-12">Quadro não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/clients"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar para clientes
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client?.name}</h1>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
              <span>{client?.product?.name}</span>
              <span>•</span>
              <span>Consultor: {client?.consultant?.name}</span>
              <span>•</span>
              <span>
                Entrada: {client?.entryDate ? new Date(client.entryDate).toLocaleDateString('pt-BR') : '-'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Progresso Geral</p>
              <div className="flex items-center mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${client?.stats?.completionPercentage || 0}%` }}
                  />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {client?.stats?.completionPercentage || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Board - Horizontal Scroll */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {board.phases.map((phase) => (
            <PhaseColumn
              key={phase.id}
              phase={phase}
              clientId={clientId!}
              clientEntryDate={client?.entryDate || ''}
              onUpdateAction={updateActionMutation.mutate}
            />
          ))}

          {/* Add Phase Button */}
          <div className="flex-shrink-0 w-80">
            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <span>Adicionar Fase</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
