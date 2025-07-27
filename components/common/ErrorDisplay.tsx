
import React from 'react';

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-red-600 bg-red-100 p-3 rounded-md text-sm dark:bg-red-900/30 dark:text-red-400">
        Error: {message}
    </div>
);

export default ErrorDisplay;
