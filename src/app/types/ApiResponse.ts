type ApiResponse<T> = {
  data: T[];
  message: string;
  status: string;
  errors?: {
    filed: string,
    message: string
  }[];
  _links?: string[];
}

export default ApiResponse;
