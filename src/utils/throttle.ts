export const throttle = <T extends (...args: any[]) => void>(
  fn: T,
  limit: number,
): T => {
  let inThrottle = false;

  const throttled = (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };

  return throttled as T;
};
