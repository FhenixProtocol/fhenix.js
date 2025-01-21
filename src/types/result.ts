export type Result<T, E = string> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: E };

export const ResultErr = <T, E>(error: E): Result<T, E> => ({
  success: false,
  data: null,
  error,
});

export const ResultOk = <T, E>(data: T): Result<T, E> => ({
  success: true,
  data,
  error: null,
});
