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

export type TPayment = {
  id: number;
  pesanan_id: number;
  metode: string;
  status: string;
  transaksi_id: string;
  jumlah: number;
  tanggal: string;
  midtrans_order_id: string;
  snap_token: string;
};

export type TPaymentCreate = {
  pesanan_id: number;
  metode: string;
  status: string;
};
