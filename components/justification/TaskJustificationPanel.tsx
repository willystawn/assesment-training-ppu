
import React from 'react';
import { Justification, ParticipantRole } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import ScaleIcon from '../icons/ScaleIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import EmptyState from '../common/EmptyState';
import { getRoleColor } from '../../utils/colors';

interface TaskJustificationPanelProps {
    justifications: Justification[];
    loading: boolean;
    error: string | null;
    onAdd: () => void;
    onEdit: (justification: Justification) => void;
    onDelete: (id: string, description: string) => void;
}

const TaskJustificationPanel: React.FC<TaskJustificationPanelProps> = ({
    justifications, loading, error, onAdd, onEdit, onDelete
}) => {
    return (
        <Card>
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold dark:text-gray-100">Aturan Justifikasi Task</h2>
                <Button onClick={onAdd} size="sm">
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Tambah
                </Button>
            </div>
            {loading && <LoadingSpinner />}
            {error && <div className="p-4"><ErrorDisplay message={error} /></div>}
            {!loading && !error && (
                justifications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800/80">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Posisi</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Rentang Task</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Poin</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Deskripsi</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {justifications.map(j => (
                                    <tr key={j.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-800/60">
                                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(j.role as ParticipantRole)}`}>
                                                {j.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-center text-gray-500 dark:text-gray-400">{j.min_tasks} - {j.max_tasks}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-semibold text-gray-800 dark:text-gray-200">{j.score}</td>
                                        <td className="px-6 py-4 text-base text-gray-500 dark:text-gray-400">{j.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium space-x-2 text-center">
                                            <button onClick={() => onEdit(j)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><EditIcon /></button>
                                            <button onClick={() => onDelete(j.id, j.description)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-4">
                        <EmptyState title="Belum Ada Aturan" message="Klik 'Tambah' untuk membuat aturan justifikasi task." icon={<ScaleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500"/>} />
                    </div>
                )
            )}
        </Card>
    );
};

export default TaskJustificationPanel;
