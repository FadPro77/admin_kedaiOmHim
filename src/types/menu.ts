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

export type TMenu = {
  id: number;
  nama: string;
  harga: number;
  ketersediaan: boolean;
  kategori: string;
  image: string;
};

export type TMenuCreate = {
  nama: string;
  harga: number;
  ketersediaan: boolean;
  kategori: string;
  image: File | string;
};
