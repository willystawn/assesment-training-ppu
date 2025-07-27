
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 dark:border dark:border-gray-700 shadow-md rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default Card;
