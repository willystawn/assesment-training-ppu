
import React from 'react';

const LoadingSpinner: React.FC<{ className?: string }> = ({ className = "flex justify-center items-center p-4" }) => (
    <div className={className}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
    </div>
);

export default LoadingSpinner;
