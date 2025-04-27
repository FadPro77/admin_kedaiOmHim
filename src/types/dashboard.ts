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

export type Tpesanan = {
  id: number;
  status: string;
  users: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  created_at: string;
};

export type TDataResponse = {
  menu: number;
  payment: number;
  pengeluaran: number;
  pesanan: number;
  saldo: number;
  users: number;
};
