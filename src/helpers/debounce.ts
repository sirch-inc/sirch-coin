import { useRef, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { DebouncedFunc } from 'lodash';

type Callback = () => void | Promise<void>;

interface DebouncedFunction extends DebouncedFunc<() => void | Promise<void>> {
  (): Promise<void>;
}

const useDebounce = (callback: Callback, debounceTimeMs: number = 1000): DebouncedFunction => {
  const ref = useRef<Callback>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, debounceTimeMs) as DebouncedFunction;
  }, [debounceTimeMs]);

  return debouncedCallback;
};

export default useDebounce;