import { fetchApi } from '@/lib/fetch';
import { TApiResponse, Tpesanan, TDataResponse } from '@/types/dashboard';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const dashboardService = {
  getAll: async (): Promise<Tpesanan[]> => {
    const response = await fetchApi<TApiResponse<Tpesanan[]>>(
      '/pesanan/admin',
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );
    return response.data;
  },

  getTotal: async (): Promise<TApiResponse<TDataResponse>> => {
    const response = await fetchApi<TApiResponse<TDataResponse>>(
      '/admin/count',
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );
    return response;
  }
};
