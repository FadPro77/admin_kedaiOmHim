import { fetchApi } from '@/lib/fetch';
import {
  TApiResponse,
  TPengeluaran,
  TPengeluaranCreate
} from '@/types/pengeluaran';

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

export const pengeluaranService = {
  getAll: async (): Promise<TPengeluaran[]> => {
    const response = await fetchApi<TApiResponse<TPengeluaran[]>>(
      '/pengeluaran',
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  },

  getById: async (id: number): Promise<TPengeluaran> => {
    const response = await fetchApi<TApiResponse<TPengeluaran>>(
      `/pengeluaran/${id}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  },

  create: async (data: TPengeluaranCreate): Promise<TPengeluaran> => {
    const formData = new FormData();
    formData.append('keterangan', data.keterangan);
    formData.append('jumlah', String(data.jumlah));

    const response = await fetchApi<TApiResponse<TPengeluaran>>(
      `/pengeluaran`,
      {
        method: 'POST',
        headers: getAuthHeaders(false),
        body: formData
      }
    );

    return response.data;
  },

  update: async (
    id: Number,
    data: TPengeluaranCreate
  ): Promise<TPengeluaran> => {
    const formData = new FormData();
    formData.append('keterangan', data.keterangan);
    formData.append('jumlah', String(data.jumlah));

    const response = await fetchApi<TApiResponse<TPengeluaran>>(
      `/pengeluaran/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(false),

        body: formData
      }
    );

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await fetchApi<TApiResponse<void>>(`/pengeluaran/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};
