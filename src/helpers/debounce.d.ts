interface DebouncedFunction {
  (): Promise<void>;
  cancel: () => void;
}

declare function useDebounce(callback: () => void | Promise<void>, debounceTimeMs?: number): DebouncedFunction;
export default useDebounce;