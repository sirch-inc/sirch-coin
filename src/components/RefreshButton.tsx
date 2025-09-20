import React from 'react';
import { Button } from '@heroui/react';

interface RefreshButtonProps {
  onRefresh: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'flat' | 'bordered' | 'shadow' | 'solid' | 'faded' | 'ghost';
  isDisabled?: boolean;
  isLoading?: boolean;
  title?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  className = '',
  size = 'sm',
  variant = 'light',
  isDisabled = false,
  isLoading = false,
  title = 'Refresh quote',
  color = 'default',
}) => {
  const handlePress = () => {
    onRefresh();
  };

  return (
    <Button
      isIconOnly
      size={size}
      variant={variant}
      color={color}
      onPress={handlePress}
      isDisabled={isDisabled}
      isLoading={isLoading}
      className={`min-w-5 min-h-5 w-5 h-5 text-gray-400 hover:text-white transition-colors ${className}`}
      title={title}
      aria-label={title}
    >
      {!isLoading && (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="block"
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="m20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </svg>
      )}
    </Button>
  );
};

export default RefreshButton;