import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { DeadlineType } from '@prisma/client';

export interface DeadlineConfig {
  deadlineType: DeadlineType;
  deadlineDays?: number | null;
  deadlineDate?: Date | null;
  recurrenceDays?: number | null;
}

/**
 * Calcula a data-alvo com base na data de entrada (D0) e configuração de prazo
 */
export const calculateTargetDate = (
  entryDate: Date,
  config: DeadlineConfig
): Date | null => {
  const { deadlineType, deadlineDays, deadlineDate } = config;

  switch (deadlineType) {
    case 'RELATIVE_DAYS':
      if (deadlineDays === null || deadlineDays === undefined) {
        return null;
      }
      return addDays(startOfDay(entryDate), deadlineDays);

    case 'SPECIFIC_DATE':
      return deadlineDate ? startOfDay(deadlineDate) : null;

    case 'RECURRING':
      // Para recorrentes, a data-alvo é sempre "hoje + recorrenceDays"
      return null; // Recorrentes não têm data-alvo fixa

    default:
      return null;
  }
};

/**
 * Verifica se uma ação/fase está atrasada
 */
export const isDelayed = (
  targetDate: Date | null,
  isCompleted: boolean,
  completedAt: Date | null
): boolean => {
  if (!targetDate || isCompleted) {
    return false;
  }

  const today = startOfDay(new Date());
  return isAfter(today, targetDate);
};

/**
 * Verifica se uma ação/fase foi concluída dentro do prazo
 */
export const wasCompletedOnTime = (
  targetDate: Date | null,
  completedAt: Date | null
): boolean => {
  if (!targetDate || !completedAt) {
    return true; // Se não há prazo, considera dentro do prazo
  }

  return isBefore(startOfDay(completedAt), targetDate) ||
         startOfDay(completedAt).getTime() === targetDate.getTime();
};

/**
 * Calcula quantos dias de atraso
 */
export const getDaysDelayed = (targetDate: Date | null): number => {
  if (!targetDate) {
    return 0;
  }

  const today = startOfDay(new Date());
  if (isBefore(today, targetDate) || today.getTime() === targetDate.getTime()) {
    return 0;
  }

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Formata prazo relativo (ex: D+1, D+5, D+7)
 */
export const formatRelativeDeadline = (days: number): string => {
  return `D+${days}`;
};
