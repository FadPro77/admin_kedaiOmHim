export type TApiResponse<T> = {
  meta: {
    statusCode: number;
    message: string;
    pagination:
      | null
      | {
          // tambahkan struktur pagination jika ada
        };
  };
  data: T;
};

export type TPesanan = {
  id: number;
  status: string;
  user_id: number;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  pesanan_items: {
    jumlah: number;
    subtotal: number;
    menu: {
      nama: string;
      kategori: string;
      image: string;
    };
  }[];
};

export type TPesananCreate = {
  status: string;
};
