import { fetchApi } from '@/lib/fetch';
import { TApiResponse, TPayment, TPaymentCreate } from '@/types/payment';

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

export const paymentService = {
  getAll: async (): Promise<TPayment[]> => {
    const response = await fetchApi<TApiResponse<TPayment[]>>('/payment', {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  getById: async (id: number): Promise<TPayment> => {
    const response = await fetchApi<TApiResponse<TPayment>>(`/payment/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  create: async (data: TPaymentCreate): Promise<TPayment> => {
    const formData = new FormData();
    formData.append('pesanan_id', String(data.pesanan_id));
    formData.append('metode', data.metode);
    formData.append('status', data.status);

    const response = await fetchApi<TApiResponse<TPayment>>(`/payment`, {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData
    });

    return response.data;
  },

  update: async (id: Number, data: TPaymentCreate): Promise<TPayment> => {
    const formData = new FormData();
    formData.append('pesanan_id', String(data.pesanan_id));
    formData.append('metode', data.metode);
    formData.append('status', data.status);

    const response = await fetchApi<TApiResponse<TPayment>>(`/payment/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(false),

      body: formData
    });

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await fetchApi<TApiResponse<void>>(`/payment/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};
