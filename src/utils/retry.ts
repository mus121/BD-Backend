import sleep from './sleep';

export default async function retry<T>(
  func: () => T,
  attempts: number,
  interval?: number,
) {
  try {
    return await func();
  } catch (error) {
    if (attempts - 1 < 0) throw error;
    interval && (await sleep(interval));
    return await retry(func, attempts - 1, interval);
  }
}
