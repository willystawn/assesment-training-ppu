
import React from 'react';
import BuildingLibraryIcon from '../icons/BuildingLibraryIcon';

const RightPanelPlaceholder = () => (
    <div className="h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
        <BuildingLibraryIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Pilih Batch Training</h3>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">Pilih batch di sebelah kiri untuk mengelola peserta dan master task.</p>
    </div>
);

export default RightPanelPlaceholder;
