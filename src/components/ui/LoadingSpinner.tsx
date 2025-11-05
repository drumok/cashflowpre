'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        
        {/* Rows */}
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-100">
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}