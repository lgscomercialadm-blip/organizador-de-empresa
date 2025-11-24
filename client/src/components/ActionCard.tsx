import { Action, ActionStatus } from '@/types';
import { CheckCircle2, Circle, Clock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { addDays, format, isAfter, startOfDay } from 'date-fns';
import { cn } from '@/utils/cn';

interface ActionCardProps {
  action: Action;
  clientEntryDate: string;
  onUpdate: (data: any) => void;
}

export default function ActionCard({ action, clientEntryDate, onUpdate }: ActionCardProps) {
  const isInternal = action.visibility === 'INTERNAL';
  const isCompleted = action.status === 'COMPLETED';
  const isInProgress = action.status === 'IN_PROGRESS';
  const isBlocked = action.status === 'BLOCKED';

  // Calculate target date and delayed status
  let targetDate: Date | null = null;
  let isDelayed = false;

  if (action.deadlineType === 'RELATIVE_DAYS' && action.deadlineDays) {
    const entryDate = new Date(clientEntryDate);
    targetDate = addDays(entryDate, action.deadlineDays);
  } else if (action.deadlineType === 'SPECIFIC_DATE' && action.deadlineDate) {
    targetDate = new Date(action.deadlineDate);
  }

  if (targetDate && !isCompleted) {
    const today = startOfDay(new Date());
    isDelayed = isAfter(today, targetDate);
  }

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle2 className="w-5 h-5 text-success-600" />;
    }
    if (isInProgress) {
      return <Clock className="w-5 h-5 text-warning-600" />;
    }
    if (isBlocked) {
      return <AlertCircle className="w-5 h-5 text-danger-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const handleStatusChange = () => {
    const statusFlow: ActionStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
    const currentIndex = statusFlow.indexOf(action.status);
    const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length];
    onUpdate({ status: nextStatus });
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg p-3 shadow-sm border transition-all cursor-pointer hover:shadow-md',
        isDelayed && !isCompleted && 'border-danger-300 bg-danger-50',
        isCompleted && 'opacity-75',
        isBlocked && 'border-danger-500'
      )}
      onClick={handleStatusChange}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2 flex-1">
          {getStatusIcon()}
          <div className="flex-1">
            <h4
              className={cn(
                'text-sm font-medium text-gray-900',
                isCompleted && 'line-through text-gray-500'
              )}
            >
              {action.title}
            </h4>
            {action.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {action.description}
              </p>
            )}
          </div>
        </div>
        {isInternal ? (
          <EyeOff className="w-3 h-3 text-gray-400 flex-shrink-0 ml-2" />
        ) : (
          <Eye className="w-3 h-3 text-primary-600 flex-shrink-0 ml-2" />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        {targetDate && (
          <div
            className={cn(
              'text-xs',
              isDelayed && !isCompleted ? 'text-danger-600 font-medium' : 'text-gray-600'
            )}
          >
            {isDelayed && !isCompleted && '⚠️ '}
            {action.deadlineType === 'RELATIVE_DAYS'
              ? `D+${action.deadlineDays}`
              : format(targetDate, 'dd/MM')}
          </div>
        )}

        {action.assignee && (
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-700">
              {action.assignee.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-2">
        {isCompleted && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800">
            Concluída
          </span>
        )}
        {isInProgress && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-100 text-warning-800">
            Em Andamento
          </span>
        )}
        {isBlocked && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-danger-100 text-danger-800">
            Bloqueada
          </span>
        )}
      </div>
    </div>
  );
}
