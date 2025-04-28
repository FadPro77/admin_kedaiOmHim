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
  image: string; // Ini URL image yang tersimpan
};

// Perbaiki di sini: image bisa File (baru) atau string (URL lama)
export type TMenuCreate = {
  nama: string;
  harga: number;
  ketersediaan: boolean;
  kategori: string;
  image: File;
};
