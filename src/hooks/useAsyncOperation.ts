import { useState, useCallback } from 'react';
import { toast } from '../pages/Main/_common/ToastNotification';

/**
 * Custom hook for handling async operations with loading states and error handling
 * 
 * Provides consistent error handling, loading states, and user feedback
 * across async operations in the application.
 */
export function useAsyncOperation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: string) => void;
      successMessage?: string;
      suppressErrorToast?: boolean;
    }
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      
      return result;
    } catch (exception) {
      const errorMessage = exception instanceof Error ? exception.message : String(exception);
      console.error("Async operation failed:", errorMessage);
      
      setError(errorMessage);
      
      if (options?.onError) {
        options.onError(errorMessage);
      }
      
      if (!options?.suppressErrorToast) {
        toast.error(errorMessage);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { 
    isLoading, 
    error, 
    execute, 
    reset 
  };
}
