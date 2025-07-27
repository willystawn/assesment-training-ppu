
import React from 'react';

const EmptyState: React.FC<{ title: string; message: string; icon: React.ReactNode }> = ({ title, message, icon }) => (
  <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700">
          {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

export default EmptyState;
