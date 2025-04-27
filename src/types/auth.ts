export type TApiResponse<T> = {
  meta: {
    statusCode: number;
    message: string;
  };
  data: T;
};

export type TAuth = {
  email: string;
  password: string;
  token: string;
};

export type TUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: 1;
};
