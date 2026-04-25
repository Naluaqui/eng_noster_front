export type ApiResponse<TData> = {
  data: TData;
  message?: string;
};

export type ApiError = {
  code: string;
  message: string;
};
