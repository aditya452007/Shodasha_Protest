import { getClientUUID } from './fingerprint';
import { ApiResponse } from '@shodasha/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const clientUuid = getClientUUID();
  if (clientUuid) {
    headers.set('X-Client-UUID', clientUuid);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include HTTP-Only cookies
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `Request failed with status ${response.status}`);
  }

  return data;
}
