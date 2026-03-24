import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Expense } from '../types/expense.types';

export const expenseService = {
  getByBusinessId(businessId: number): Promise<ApiResponse<Expense[]>> {
    return apiFetch(`/expenses/business/${businessId}`, {
      method: 'GET'
    });
  },

  create(payload: any): Promise<ApiResponse<Expense>> {
    return apiFetch(`/expenses`, {
      method: 'POST',
      body: payload
    });
  },

  update(id: number, payload: any): Promise<ApiResponse<Expense>> {
    return apiFetch(`/expenses/${id}`, {
      method: 'PUT',
      body: payload
    });
  },

  delete(id: number): Promise<ApiResponse<null>> {
    return apiFetch(`/expenses/${id}`, {
      method: 'DELETE'
    });
  }
};
