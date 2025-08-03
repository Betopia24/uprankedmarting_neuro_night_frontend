
export type UserRole = "ADMIN" | "EDITOR" | "MODERATOR" | "USER";

export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
};

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};

export type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};
