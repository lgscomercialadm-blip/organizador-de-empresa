import api from './api';
import { Client, CreateClientData, UpdateClientData } from '@/types';

export const clientService = {
  async getClients(): Promise<Client[]> {
    const response = await api.get<Client[]>('/clients');
    return response.data;
  },

  async getClient(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  async createClient(data: CreateClientData): Promise<Client> {
    const response = await api.post<Client>('/clients', data);
    return response.data;
  },

  async updateClient(id: string, data: UpdateClientData): Promise<Client> {
    const response = await api.patch<Client>(`/clients/${id}`, data);
    return response.data;
  },

  async deleteClient(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  },
};
