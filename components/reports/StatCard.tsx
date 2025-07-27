import React from 'react';
import { getGradeBadgeStyle } from './ReportShared';

export const StatCard: React.FC<{
  title: string;
  value: string | number;
  description: string;
  progress?: number;
  colorClass: string;
  footerLabel?: string;
  footerValue?: string | number;
  children?: React.ReactNode;
  descriptionAsBadge?: boolean;
}> = ({ title, value, description, progress, colorClass, footerLabel, footerValue, children, descriptionAsBadge = false }) => {
  
  const hasFooterContent = progress !== undefined || (footerLabel && footerValue !== undefined) || children;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Main content, stays at top */}
      <div>
        <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className="mt-2">
            {descriptionAsBadge ? (
                 <div>
                    <span className={`text-4xl font-bold ${colorClass}`}>{value}</span>
                    <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeBadgeStyle(description)}`}>
                            {description}
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    <span className={`text-4xl font-bold ${colorClass}`}>{value}</span>
                    <p className="text-base text-gray-600 dark:text-gray-300 mt-1">{description}</p>
                </>
            )}
        </div>
      </div>
      
      {hasFooterContent && (
        <div className="mt-auto pt-4 space-y-4">
          {progress !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          {footerLabel && footerValue !== undefined && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{footerLabel}</p>
                <p className={`text-lg font-bold ${colorClass}`}>{footerValue}</p>
              </div>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
};


export default StatCard;