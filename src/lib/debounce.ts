type Debounce<T extends unknown[]> = {
  callback: (...args: T) => void;
  delay?: number;
  immediate?: boolean;
};

export default function debounce<T extends unknown[]>({
  callback,
  delay = 1000,
  immediate = false,
}: Debounce<T>) {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: T) => {
    const later = () => {
      timeout = null;
      if (!immediate) {
        callback(...args);
      }
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, delay);

    if (callNow) {
      callback(...args);
    }
  };
}
