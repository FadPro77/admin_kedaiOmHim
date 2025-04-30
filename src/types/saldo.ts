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

export type TSaldo = {
  id: number;
  keterangan: string;
  jumlah: number;
  tanggal: string;
  payment_id: number;
  pengeluaran_id: number;
  tipe: string;
};

export type TSaldoCreate = {
  keterangan: string;
  jumlah: number;
  tanggal: string;
  payment_id: number;
  pengeluaran_id: number;
  tipe: string;
};
