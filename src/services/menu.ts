import { fetchApi } from '@/lib/fetch';
import { TApiResponse, TMenu, TMenuCreate } from '@/types/menu';

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

export const menuService = {
  getAll: async (): Promise<TMenu[]> => {
    const response = await fetchApi<TApiResponse<TMenu[]>>('/menu');
    return response.data;
  },

  getById: async (id: number): Promise<TMenu> => {
    const response = await fetchApi<TApiResponse<TMenu>>(`/menu/${id}`);
    return response.data;
  },

  create: async (data: TMenuCreate): Promise<TMenu> => {
    const formData = new FormData();
    formData.append('nama', data.nama);
    formData.append('harga', String(data.harga));
    formData.append('kategori', data.kategori);
    formData.append('ketersediaan', String(data.ketersediaan));
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await fetchApi<TApiResponse<TMenu>>(`/menu`, {
      method: 'POST',
      headers: getAuthHeaders(false),

      body: formData
    });

    return response.data;
  },

  update: async (id: Number, data: TMenuCreate): Promise<TMenu> => {
    const formData = new FormData();
    formData.append('nama', data.nama);
    formData.append('harga', String(data.harga));
    formData.append('kategori', data.kategori);
    formData.append('ketersediaan', String(data.ketersediaan));
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await fetchApi<TApiResponse<TMenu>>(`/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(false),

      body: formData
    });

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await fetchApi<TApiResponse<void>>(`/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};
