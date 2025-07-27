
import React from 'react';

interface PageHeaderProps {
    title: string;
    children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
            {children && <div>{children}</div>}
        </div>
    );
};

export default PageHeader;
