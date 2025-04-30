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

export type TPengeluaran = {
  id: number;
  keterangan: string;
  jumlah: number;
};

export type TPengeluaranCreate = {
  keterangan: string;
  jumlah: number;
};
