import { fetchApi } from '@/lib/fetch';
import { TApiResponse, TSaldo, TSaldoCreate } from '@/types/saldo';

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

export const saldoService = {
  getAll: async (): Promise<{ data: TSaldo[]; total: number }> => {
    const response = await fetchApi<
      TApiResponse<{ data: TSaldo[]; total: number }>
    >('/saldo', {
      headers: getAuthHeaders()
    });
    console.log('📦 SaldoService.getAll data:', response.data); // <-- log di sini
    return response.data;
  },

  getById: async (id: number): Promise<{ data: TSaldo[]; total: number }> => {
    const response = await fetchApi<
      TApiResponse<{ data: TSaldo[]; total: number }>
    >(`/saldo/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  create: async (data: TSaldoCreate): Promise<TSaldo> => {
    const formData = new FormData();
    formData.append('keterangan', data.keterangan);
    formData.append('jumlah', String(data.jumlah));
    formData.append('tipe', data.tipe);

    const response = await fetchApi<TApiResponse<TSaldo>>(`/saldo`, {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData
    });

    return response.data;
  },

  update: async (id: Number, data: TSaldoCreate): Promise<TSaldo> => {
    const formData = new FormData();
    formData.append('keterangan', data.keterangan);
    formData.append('jumlah', String(data.jumlah));
    formData.append('tipe', data.tipe);

    const response = await fetchApi<TApiResponse<TSaldo>>(`/saldo/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(false),

      body: formData
    });

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await fetchApi<TApiResponse<void>>(`/saldo/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};
