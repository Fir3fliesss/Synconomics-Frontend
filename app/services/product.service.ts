import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Product } from '../types/product.types';

export const productService = {
  getByBusinessId(businessId: number): Promise<ApiResponse<Product[]>> {
    return apiFetch(`/products/business/${businessId}`, {
      method: 'GET'
    });
  },

  create(payload: any): Promise<ApiResponse<Product>> {
    return apiFetch(`/products`, {
      method: 'POST',
      body: payload
    });
  },

  update(id: number, payload: any): Promise<ApiResponse<Product>> {
    return apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: payload
    });
  },

  delete(id: number): Promise<ApiResponse<null>> {
    return apiFetch(`/products/${id}`, {
      method: 'DELETE'
    });
  }
};
