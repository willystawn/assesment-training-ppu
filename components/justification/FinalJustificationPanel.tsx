
import React from 'react';
import { FinalJustification } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import ScaleIcon from '../icons/ScaleIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import EmptyState from '../common/EmptyState';

interface FinalJustificationPanelProps {
    finalJustifications: FinalJustification[];
    loading: boolean;
    error: string | null;
    onAdd: () => void;
    onEdit: (justification: FinalJustification) => void;
    onDelete: (id: string, description: string) => void;
}

const FinalJustificationPanel: React.FC<FinalJustificationPanelProps> = ({
    finalJustifications, loading, error, onAdd, onEdit, onDelete
}) => {
    return (
        <Card>
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold dark:text-gray-100">Aturan Justifikasi Akhir</h2>
                <Button onClick={onAdd} size="sm">
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Tambah
                </Button>
            </div>
            {loading && <LoadingSpinner />}
            {error && <div className="p-4"><ErrorDisplay message={error} /></div>}
            {!loading && !error && (
                finalJustifications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800/80">
                                <tr>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Rentang Nilai</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Deskripsi</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {finalJustifications.map(fj => (
                                    <tr key={fj.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-800/60">
                                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-center text-gray-900 dark:text-gray-100">{fj.min_score} - {fj.max_score}</td>
                                        <td className="px-6 py-4 text-base text-gray-500 dark:text-gray-400">{fj.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium space-x-2 text-center">
                                            <button onClick={() => onEdit(fj)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><EditIcon /></button>
                                            <button onClick={() => onDelete(fj.id, fj.description)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-4">
                        <EmptyState title="Belum Ada Aturan" message="Klik 'Tambah' untuk membuat aturan justifikasi akhir." icon={<ScaleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500"/>} />
                    </div>
                )
            )}
        </Card>
    );
};

export default FinalJustificationPanel;
