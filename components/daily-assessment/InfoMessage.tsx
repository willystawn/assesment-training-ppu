
import React from 'react';

interface InfoMessageProps {
    icon: React.ReactElement<{ className?: string }>; 
    title: string; 
    children: React.ReactNode
}

const InfoMessage: React.FC<InfoMessageProps> = ({ icon, title, children }) => (
    <div className="text-center p-8 rounded-lg col-span-full">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700">
            {React.cloneElement(icon, { className: "h-6 w-6 text-gray-500 dark:text-gray-400"})}
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{children}</p>
    </div>
);

export default InfoMessage;
