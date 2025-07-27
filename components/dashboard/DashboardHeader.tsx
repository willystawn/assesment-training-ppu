
import React, { Dispatch, SetStateAction } from 'react';
import { Training } from '../../types';
import PageHeader from '../common/PageHeader';

interface DashboardHeaderProps {
    trainings: Training[];
    selectedTrainingId: string;
    onTrainingChange: Dispatch<SetStateAction<string>>;
    loading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ trainings, selectedTrainingId, onTrainingChange, loading }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <PageHeader title="Dashboard" />
            {!loading && trainings.length > 0 &&
                 <div className="relative w-full sm:w-auto sm:max-w-xs">
                    <select
                        id="training-batch-dashboard"
                        value={selectedTrainingId}
                        onChange={e => onTrainingChange(e.target.value)}
                        className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 px-4 py-2.5 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 text-gray-800 dark:text-gray-200 cursor-pointer text-base"
                        aria-label="Pilih Batch Training"
                    >
                        {trainings.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                       <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            }
        </div>
    );
};

export default DashboardHeader;
