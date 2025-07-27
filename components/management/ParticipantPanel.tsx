
import React, { useState, useMemo } from 'react';
import { Participant, Training } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import UserGroupIcon from '../icons/UserGroupIcon';
import { getRoleColor } from '../../utils/colors';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import EmptyState from '../common/EmptyState';

const ITEMS_PER_PAGE = 5;

interface ParticipantPanelProps {
    participants: Participant[];
    selectedTraining: Training | null;
    onAdd: () => void;
    onEdit: (participant: Participant) => void;
    onDelete: (id: string, name: string) => void;
    loading: boolean;
    error: string | null;
}

const ParticipantPanel: React.FC<ParticipantPanelProps> = ({
    participants,
    selectedTraining,
    onAdd,
    onEdit,
    onDelete,
    loading,
    error
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    
    const paginatedParticipants = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return participants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [participants, currentPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [participants]);

    return (
        <Card>
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <UserGroupIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-semibold dark:text-gray-100 truncate">
                        Peserta {selectedTraining ? `- ${selectedTraining.name}` : ''}
                    </h2>
                </div>
                <Button onClick={onAdd} disabled={!selectedTraining} size="sm">
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Tambah
                </Button>
            </div>
            {loading && <LoadingSpinner />}
            {error && <div className="p-4"><ErrorDisplay message={error} /></div>}
            {selectedTraining && !loading && !error && (
                paginatedParticipants.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-800/80">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Nama Peserta</th>
                                        <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Posisi</th>
                                        <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {paginatedParticipants.map(p => (
                                        <tr key={p.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-800/60">
                                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 dark:text-gray-100">{p.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(p.role)}`}>
                                                    {p.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium space-x-2">
                                                <button onClick={() => onEdit(p)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><EditIcon /></button>
                                                <button onClick={() => onDelete(p.id, p.name)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={participants.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                            className="p-4 border-t dark:border-gray-700"
                        />
                    </>
                ) : (
                    <div className="p-4">
                        <EmptyState title="Belum Ada Peserta" message="Klik 'Tambah' untuk mendaftarkan peserta ke batch ini." icon={<UserGroupIcon className="h-8 w-8 text-gray-400 dark:text-gray-500"/>} />
                    </div>
                )
            )}
        </Card>
    );
};

export default ParticipantPanel;
