import { useRef, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';


const useDebounce = (callback, debounceTimeMs = 1000) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, debounceTimeMs);
  }, [debounceTimeMs]);

  return debouncedCallback;
};

export default useDebounce;