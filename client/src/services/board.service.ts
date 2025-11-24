import api from './api';
import {
  Board,
  Phase,
  Action,
  CreatePhaseData,
  UpdatePhaseData,
  CreateActionData,
  UpdateActionData,
  HistoryEntry,
} from '@/types';

export const boardService = {
  async getBoard(clientId: string): Promise<Board> {
    const response = await api.get<Board>(`/boards/client/${clientId}`);
    return response.data;
  },

  // Phases
  async createPhase(boardId: string, data: CreatePhaseData): Promise<Phase> {
    const response = await api.post<Phase>(`/boards/board/${boardId}/phases`, data);
    return response.data;
  },

  async updatePhase(phaseId: string, data: UpdatePhaseData): Promise<Phase> {
    const response = await api.patch<Phase>(`/boards/phases/${phaseId}`, data);
    return response.data;
  },

  async deletePhase(phaseId: string): Promise<void> {
    await api.delete(`/boards/phases/${phaseId}`);
  },

  async reorderPhases(
    boardId: string,
    phaseOrders: { id: string; order: number }[]
  ): Promise<Board> {
    const response = await api.post<Board>(`/boards/board/${boardId}/phases/reorder`, {
      phaseOrders,
    });
    return response.data;
  },

  // Actions
  async createAction(phaseId: string, data: CreateActionData): Promise<Action> {
    const response = await api.post<Action>(`/boards/phases/${phaseId}/actions`, data);
    return response.data;
  },

  async updateAction(actionId: string, data: UpdateActionData): Promise<Action> {
    const response = await api.patch<Action>(`/boards/actions/${actionId}`, data);
    return response.data;
  },

  async deleteAction(actionId: string): Promise<void> {
    await api.delete(`/boards/actions/${actionId}`);
  },

  async moveAction(actionId: string, phaseId: string, order: number): Promise<Action> {
    const response = await api.post<Action>(`/boards/actions/${actionId}/move`, {
      phaseId,
      order,
    });
    return response.data;
  },

  async getActionHistory(actionId: string): Promise<HistoryEntry[]> {
    const response = await api.get<HistoryEntry[]>(`/boards/actions/${actionId}/history`);
    return response.data;
  },
};
