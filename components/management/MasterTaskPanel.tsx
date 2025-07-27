

import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'https://esm.sh/xlsx';
import { MasterTask, ParticipantRole, MasterTaskData } from '../../types';
import { PARTICIPANT_ROLES } from '../../constants';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import ClipboardListIcon from '../icons/ClipboardListIcon';
import ArrowUpTrayIcon from '../icons/ArrowUpTrayIcon';
import ArrowDownTrayIcon from '../icons/ArrowDownTrayIcon';
import { getRoleColor, getBacklogColor } from '../../utils/colors';
import { exportMasterTasksToExcel, downloadMasterTaskSample } from '../../utils/exportUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import EmptyState from '../common/EmptyState';

const ITEMS_PER_PAGE = 5;

interface MasterTaskPanelProps {
    masterTasks: MasterTask[];
    onAdd: () => void;
    onEdit: (task: MasterTask) => void;
    onDelete: (id: string, name: string) => void;
    onImport: (tasks: MasterTaskData[]) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const MasterTaskPanel: React.FC<MasterTaskPanelProps> = ({
    masterTasks,
    onAdd,
    onEdit,
    onDelete,
    onImport,
    loading,
    error
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState<'all' | ParticipantRole>('all');
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importStatus, setImportStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const filteredMasterTasks = useMemo(() => {
        return roleFilter === 'all'
            ? masterTasks
            : masterTasks.filter(task => task.role === roleFilter);
    }, [masterTasks, roleFilter]);
    
    const paginatedMasterTasks = useMemo(() => {
        const sortedTasks = [...filteredMasterTasks].sort((a, b) => a.day_number - b.day_number);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredMasterTasks, currentPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [roleFilter]);

    const handleExport = () => {
        setIsExporting(true);
        try {
            exportMasterTasksToExcel(masterTasks);
        } catch (e: any) {
             setImportStatus({ message: 'Gagal mengekspor data: ' + e.message, type: 'error' });
        } finally {
            setIsExporting(false);
        }
    };
    
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        setImportStatus(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json<any>(worksheet);

                if (json.length === 0) {
                    throw new Error("File Excel kosong atau tidak ada data di sheet pertama.");
                }

                const newTasks: MasterTaskData[] = json.map((row, index) => {
                    const { day_number, backlog, user_story, role, target_points } = row;
                    if (!day_number || !user_story || !role || target_points === undefined) {
                        throw new Error(`Baris ${index + 2}: Kolom wajib (day_number, user_story, role, target_points) tidak boleh kosong.`);
                    }
                     if (!PARTICIPANT_ROLES.includes(role)) {
                        throw new Error(`Baris ${index + 2}: Nilai 'role' tidak valid. Harus '${ParticipantRole.FRONTEND}' atau '${ParticipantRole.BACKEND}'.`);
                    }
                    return {
                        day_number: Number(day_number),
                        backlog: backlog || '',
                        user_story: String(user_story),
                        role: role as ParticipantRole,
                        target_points: Number(target_points)
                    };
                });
                
                await onImport(newTasks);
                setImportStatus({ message: `Berhasil mengimpor ${newTasks.length} task.`, type: 'success' });

            } catch (err: any) {
                setImportStatus({ message: 'Gagal mengimpor: ' + err.message, type: 'error' });
            } finally {
                setIsImporting(false);
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const renderContent = () => {
        if (loading) return <LoadingSpinner />;
        if (error) return <div className="p-4"><ErrorDisplay message={error} /></div>;
        if (masterTasks.length === 0 && !isImporting) {
             return (
                <div className="p-4">
                    <EmptyState title="Belum Ada Master Task" message="Klik 'Tambah' atau 'Import' untuk membuat daftar task." icon={<ClipboardListIcon className="h-8 w-8 text-gray-400 dark:text-gray-500"/>} />
                </div>
            );
        }
        if (paginatedMasterTasks.length === 0 && !isImporting) {
            return (
                <div className="p-4">
                    <EmptyState title="Tidak Ada Hasil" message="Tidak ada task yang cocok dengan filter yang dipilih." icon={<ClipboardListIcon className="h-8 w-8 text-gray-400 dark:text-gray-500"/>} />
                </div>
            );
        }
        return (
            <>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800/80">
                            <tr>
                                {["Day", "Backlog", "User Story", "Posisi", "Poin", "Aksi"].map(header => (
                                    <th key={header} scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {paginatedMasterTasks.map(task => (
                                <tr key={task.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-800/60">
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-center text-gray-500 dark:text-gray-400">{task.day_number}</td>
                                    <td className="px-6 py-4 text-base font-medium text-gray-900 dark:text-gray-100">
                                        {task.backlog ? (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBacklogColor(task.backlog)}`}>
                                                {task.backlog}
                                            </span>
                                        ) : <span className="text-gray-400 dark:text-gray-500">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-base text-gray-500 dark:text-gray-400 max-w-xs truncate" title={task.user_story}>{task.user_story}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(task.role)}`}>
                                            {task.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-center font-semibold text-gray-800 dark:text-gray-200">{task.target_points}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium space-x-2">
                                        <button onClick={() => onEdit(task)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><EditIcon /></button>
                                        <button onClick={() => onDelete(task.id, task.user_story)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredMasterTasks.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    className="p-4 border-t dark:border-gray-700"
                />
            </>
        );
    };

    return (
        <Card>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <ClipboardListIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-semibold dark:text-gray-100">Master Task</h2>
                </div>
                <div className="w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex items-center gap-2 flex-grow">
                             <div className="relative z-0 inline-flex shadow-sm rounded-md flex-grow sm:flex-grow-0">
                                <button type="button" onClick={() => setRoleFilter('all')} className={`relative inline-flex items-center justify-center px-3 py-1.5 rounded-l-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 flex-1 ${roleFilter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>All</button>
                                <button type="button" onClick={() => setRoleFilter(ParticipantRole.FRONTEND)} className={`-ml-px relative inline-flex items-center justify-center px-3 py-1.5 border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 flex-1 ${roleFilter === ParticipantRole.FRONTEND ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>FE</button>
                                <button type="button" onClick={() => setRoleFilter(ParticipantRole.BACKEND)} className={`-ml-px relative inline-flex items-center justify-center px-3 py-1.5 rounded-r-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 flex-1 ${roleFilter === ParticipantRole.BACKEND ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>BE</button>
                            </div>
                            <Button onClick={onAdd} size="sm">
                                <PlusIcon className="h-5 w-5" />
                            </Button>
                        </div>
                         <div className="flex items-center gap-2 flex-grow">
                            <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx,.xls,.csv" />
                            <Button onClick={downloadMasterTaskSample} variant="secondary" size="sm" className="w-full sm:w-auto" title="Download Sample">
                                <ArrowDownTrayIcon className="h-5 w-5" />
                            </Button>
                            <Button onClick={handleImportClick} variant="secondary" size="sm" disabled={isImporting} className="w-full sm:w-auto" title="Import from Excel">
                                <ArrowUpTrayIcon className="h-5 w-5" />
                            </Button>
                            <Button onClick={handleExport} variant="secondary" size="sm" disabled={isExporting || masterTasks.length === 0} className="w-full sm:w-auto" title="Export to Excel">
                                <ArrowDownTrayIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
             {isImporting && <LoadingSpinner />}
             {importStatus && (
                <div className={`p-4 m-4 rounded-md text-sm ${importStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {importStatus.message}
                </div>
             )}
            {renderContent()}
        </Card>
    );
};

export default MasterTaskPanel;