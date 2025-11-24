import { Phase } from '@/types';
import { Plus, Eye, EyeOff } from 'lucide-react';
import ActionCard from './ActionCard';
import { addDays, format } from 'date-fns';

interface PhaseColumnProps {
  phase: Phase;
  clientId: string;
  clientEntryDate: string;
  onUpdateAction: (params: { actionId: string; data: any }) => void;
}

export default function PhaseColumn({
  phase,
  clientId,
  clientEntryDate,
  onUpdateAction,
}: PhaseColumnProps) {
  const isInternal = phase.visibility === 'INTERNAL';
  const completedActions = phase.actions.filter((a) => a.status === 'COMPLETED').length;
  const totalActions = phase.actions.length;

  // Calculate target date
  let targetDateStr = '';
  if (phase.deadlineType === 'RELATIVE_DAYS' && phase.deadlineDays) {
    const entryDate = new Date(clientEntryDate);
    const targetDate = addDays(entryDate, phase.deadlineDays);
    targetDateStr = format(targetDate, 'dd/MM/yyyy');
  } else if (phase.deadlineType === 'SPECIFIC_DATE' && phase.deadlineDate) {
    targetDateStr = format(new Date(phase.deadlineDate), 'dd/MM/yyyy');
  }

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-100 rounded-lg p-4">
        {/* Phase Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-gray-900">{phase.name}</h3>
            {isInternal ? (
              <EyeOff className="w-4 h-4 text-gray-400" title="Somente interno" />
            ) : (
              <Eye className="w-4 h-4 text-primary-600" title="Visível ao cliente" />
            )}
          </div>

          {phase.description && (
            <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              {completedActions}/{totalActions} concluídas
            </span>
            {targetDateStr && (
              <span className="text-primary-600 font-medium">
                Meta: {targetDateStr}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-2 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary-600 h-1.5 rounded-full transition-all"
              style={{
                width: `${totalActions > 0 ? (completedActions / totalActions) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Actions List */}
        <div className="space-y-2 mb-3">
          {phase.actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              clientEntryDate={clientEntryDate}
              onUpdate={(data) => onUpdateAction({ actionId: action.id, data })}
            />
          ))}

          {phase.actions.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">
              Nenhuma ação nesta fase
            </div>
          )}
        </div>

        {/* Add Action Button */}
        <button className="w-full py-2 px-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center">
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Ação
        </button>
      </div>
    </div>
  );
}
