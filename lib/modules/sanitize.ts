export function SanitizeData<T>(object: T, keys: string[]): T {
  for (const key of keys) delete object[key as keyof T];
  return object;
}
