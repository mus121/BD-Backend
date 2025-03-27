import sleep from './sleep';

export default async function retry<T>(
  func: () => Promise<T>,
  attempts: number,
  interval?: number,
): Promise<T> {
  try {
    return await func();
  } catch (error) {
    if (attempts - 1 < 0) throw error;
    if (interval) await sleep(interval);
    return retry(func, attempts - 1, interval);
  }
}
