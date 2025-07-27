
import React from 'react';
import { Training } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import BuildingLibraryIcon from '../icons/BuildingLibraryIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import EmptyState from '../common/EmptyState';

interface TrainingListProps {
    trainings: Training[];
    selectedTraining: Training | null;
    onSelectTraining: (training: Training) => void;
    onAdd: () => void;
    onEdit: (training: Training) => void;
    onDelete: (id: string, name: string) => void;
    loading: boolean;
    error: string | null;
}

const TrainingList: React.FC<TrainingListProps> = ({
    trainings,
    selectedTraining,
    onSelectTraining,
    onAdd,
    onEdit,
    onDelete,
    loading,
    error
}) => {
    return (
        <Card className="h-full">
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <BuildingLibraryIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-semibold dark:text-gray-100">Batch Training</h2>
                </div>
                <Button onClick={onAdd} size="sm">
                    <PlusIcon className="h-5 w-5" />
                </Button>
            </div>
            {loading && <LoadingSpinner />}
            {error && <div className="p-4"><ErrorDisplay message={error} /></div>}
            {!loading && !error && (
                <div className="p-2 space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                    {trainings.length > 0 ? trainings.map(t => (
                        <button
                            key={t.id}
                            onClick={() => onSelectTraining(t)}
                            className={`w-full group text-left p-3 rounded-lg border-2 transition-all duration-200 ${selectedTraining?.id === t.id ? 'bg-indigo-50 dark:bg-gray-800 border-indigo-500 shadow-md' : 'bg-white dark:bg-gray-800/50 border-transparent hover:border-indigo-400 dark:hover:bg-gray-700/50'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.start_date} &rarr; {t.end_date}</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => onEdit(t)} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><EditIcon className="h-4 w-4"/></button>
                                    <button onClick={() => onDelete(t.id, t.name)} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon className="h-4 w-4"/></button>
                                </div>
                            </div>
                        </button>
                    )) : (
                         <EmptyState title="Belum Ada Batch" message="Klik tombol '+' untuk membuat batch training baru." icon={<BuildingLibraryIcon className="h-8 w-8 text-gray-400 dark:text-gray-500"/>} />
                    )}
                </div>
            )}
        </Card>
    );
};

export default TrainingList;
