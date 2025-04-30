import { fetchApi } from '@/lib/fetch';
import { TApiResponse, TPesanan, TPesananCreate } from '@/types/pesanan';

const getAuthHeaders = (withContentTypeJson = true) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`
  };

  if (withContentTypeJson) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export const pesananService = {
  getAll: async (): Promise<TPesanan[]> => {
    const response = await fetchApi<TApiResponse<TPesanan[]>>(
      '/pesanan/admin',
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  },

  getById: async (id: number): Promise<TPesanan> => {
    const response = await fetchApi<TApiResponse<TPesanan>>(`/pesanan/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  update: async (id: Number, data: TPesananCreate): Promise<TPesanan> => {
    const formData = new FormData();
    formData.append('status', data.status);

    const response = await fetchApi<TApiResponse<TPesanan>>(`/pesanan/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(false),

      body: formData
    });

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await fetchApi<TApiResponse<void>>(`/pesanan/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};
