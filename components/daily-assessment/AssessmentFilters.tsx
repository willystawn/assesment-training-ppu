
import React from 'react';
import { Training, ParticipantRole } from '../../types';
import Card from '../ui/Card';

interface AssessmentFiltersProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    selectedTrainingId: string;
    onTrainingChange: (id: string) => void;
    trainings: Training[];
    roleFilter: 'all' | ParticipantRole;
    onRoleFilterChange: (filter: 'all' | ParticipantRole) => void;
}

const AssessmentFilters: React.FC<AssessmentFiltersProps> = ({
    selectedDate,
    onDateChange,
    selectedTrainingId,
    onTrainingChange,
    trainings,
    roleFilter,
    onRoleFilterChange
}) => {
    return (
        <Card>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Filter Penilaian</h2>
            </div>
            <div className="p-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-grow">
                     <div>
                        <label htmlFor="assessment-date" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal
                        </label>
                        <input
                            id="assessment-date"
                            type="date"
                            value={selectedDate}
                            onChange={e => onDateChange(e.target.value)}
                            autoComplete="off"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="training-batch" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Batch Training
                        </label>
                         <div className="relative">
                            <select
                                id="training-batch"
                                value={selectedTrainingId}
                                onChange={e => onTrainingChange(e.target.value)}
                                className="appearance-none block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="" disabled>Pilih Batch</option>
                                {trainings.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0">
                   <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Filter Posisi
                    </label>
                    <div className="relative z-0 inline-flex shadow-sm rounded-md">
                        <button type="button" onClick={() => onRoleFilterChange('all')} className={`relative inline-flex items-center px-4 py-2 rounded-l-md border text-base font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 ${roleFilter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>All</button>
                        <button type="button" onClick={() => onRoleFilterChange(ParticipantRole.FRONTEND)} className={`-ml-px relative inline-flex items-center px-4 py-2 border text-base font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 ${roleFilter === ParticipantRole.FRONTEND ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>FE</button>
                        <button type="button" onClick={() => onRoleFilterChange(ParticipantRole.BACKEND)} className={`-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border text-base font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 ${roleFilter === ParticipantRole.BACKEND ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>BE</button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AssessmentFilters;
