const BASE_URL = 'http://localhost:3001';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`Falha operacional na API: ${response.statusText}`);
  }
  return response.json();
}

export const apiService = {
  get: <T>(end: string) => request<T>(end),
  post: <T>(end: string, data: any) => request<T>(end, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
};
