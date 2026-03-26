import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Transaction, TransactionItem, CreateTransactionRequest, CreateTransactionItemRequest } from '../types/transaction.types';

export const transactionService = {
  getTransactionsByBusinessId(businessId: number): Promise<ApiResponse<Transaction[]>> {
    return apiFetch(`/transactions/business/${businessId}`, {
      method: 'GET'
    });
  },

  createTransaction(payload: CreateTransactionRequest): Promise<ApiResponse<Transaction>> {
    return apiFetch(`/transactions`, {
      method: 'POST',
      body: payload
    });
  },

  createTransactionItem(payload: CreateTransactionItemRequest): Promise<ApiResponse<TransactionItem>> {
    return apiFetch(`/transaction_items`, {
      method: 'POST',
      body: payload
    });
  },

  getTransactionById(id: number): Promise<ApiResponse<Transaction>> {
    return apiFetch(`/transactions/${id}`, {
      method: 'GET'
    });
  },

  getTransactionItems(transactionId: number): Promise<ApiResponse<TransactionItem[]>> {
    return apiFetch(`/transaction_items/transaction/${transactionId}`, {
      method: 'GET'
    });
  }
};
