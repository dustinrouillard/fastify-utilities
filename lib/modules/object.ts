export function SanitizeData<T>(object: T, keys: string[]): T {
  for (const key of keys) delete object[key as keyof T];
  return object;
}

export function PickData<T = any>(object: T, keys: string[]): T {
  const data: T = {} as unknown as T;
  for (const key of keys) data[key as keyof T] = object[key as keyof T];
  return data;
}
