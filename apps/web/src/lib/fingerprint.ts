export function getClientUUID(): string {
  if (typeof window === 'undefined') return '';

  const STORAGE_KEY = 'shodasha_client_uuid';
  let uuid = localStorage.getItem(STORAGE_KEY);

  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, uuid);
  }

  return uuid;
}
