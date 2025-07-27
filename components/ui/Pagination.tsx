import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange, className = '' }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null;
    }

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };
    
    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={`flex items-center justify-between bg-white dark:bg-gray-800 ${className}`}>
            <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
                </p>
            </div>
            <div className="flex-1 flex justify-end">
                <Button 
                    onClick={handlePrev} 
                    disabled={currentPage === 1} 
                    variant="secondary"
                    className="mr-2"
                >
                    Previous
                </Button>
                <Button 
                    onClick={handleNext} 
                    disabled={currentPage === totalPages}
                    variant="secondary"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
