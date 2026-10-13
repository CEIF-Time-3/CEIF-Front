type FetchOptions = RequestInit & {};

interface ApiErrorResponse {
  message?: string;
  success?: boolean;
  [key: string]: unknown;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
  }
}

export async function http<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new HttpError(
      response.status,
      errorData.message || "Erro na requisição",
      errorData
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
