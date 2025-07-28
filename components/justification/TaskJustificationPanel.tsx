

import React, { useMemo, useState, useRef } from 'react';
import * as XLSX from 'https://esm.sh/xlsx';
import { Justification, ParticipantRole, JustificationData } from '../../types';
import { PARTICIPANT_ROLES } from '../../constants';
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
import { exportJustificationsToExcel, downloadJustificationSample } from '../../utils/exportUtils';
import ArrowUpTrayIcon from '../icons/ArrowUpTrayIcon';
import ArrowDownTrayIcon from '../icons/ArrowDownTrayIcon';


interface TaskJustificationPanelProps {
    justifications: Justification[];
    loading: boolean;
    error: string | null;
    onAdd: () => void;
    onEdit: (justification: Justification) => void;
    onDelete: (id: string, description: string) => void;
    onImport: (justifications: JustificationData[]) => Promise<void>;
}

const TaskJustificationPanel: React.FC<TaskJustificationPanelProps> = ({
    justifications, loading, error, onAdd, onEdit, onDelete, onImport
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importStatus, setImportStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const groupedJustifications = useMemo(() => {
        const initialGroups: { [key in ParticipantRole]?: { [category: string]: Justification[] } } = {};
        
        const groups = justifications.reduce((acc, j) => {
            const role = j.role;
            const category = j.description || 'Tanpa Kategori';
            
            if (!acc[role]) {
                acc[role] = {};
            }
            if (!acc[role]![category]) {
                acc[role]![category] = [];
            }
            acc[role]![category].push(j);
            return acc;
        }, initialGroups);

        // Sort rules inside each category by raw score
        for (const role in groups) {
            for (const category in groups[role as ParticipantRole]) {
                groups[role as ParticipantRole]![category]!.sort((a, b) => a.min_tasks - b.min_tasks);
            }
        }

        return groups;
    }, [justifications]);

    const handleExport = () => {
        setIsExporting(true);
        try {
            exportJustificationsToExcel(justifications);
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

                const newJustifications: JustificationData[] = json.map((row, index) => {
                    const { skor_mentah, nilai_konversi, deskripsi, role } = row;
                    if (skor_mentah === undefined || nilai_konversi === undefined || !deskripsi || !role) {
                        throw new Error(`Baris ${index + 2}: Kolom wajib (skor_mentah, nilai_konversi, deskripsi, role) tidak boleh kosong.`);
                    }
                     if (!PARTICIPANT_ROLES.includes(role)) {
                        throw new Error(`Baris ${index + 2}: Nilai 'role' tidak valid. Harus '${ParticipantRole.FRONTEND}' atau '${ParticipantRole.BACKEND}'.`);
                    }
                    return {
                        min_tasks: Number(skor_mentah),
                        max_tasks: Number(skor_mentah),
                        score: Number(nilai_konversi),
                        description: String(deskripsi),
                        role: role as ParticipantRole,
                    };
                });
                
                await onImport(newJustifications);
                setImportStatus({ message: `Berhasil mengimpor ${newJustifications.length} aturan justifikasi.`, type: 'success' });

            } catch (err: any) {
                setImportStatus({ message: 'Gagal mengimpor: ' + err.message, type: 'error' });
            } finally {
                setIsImporting(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };


    return (
        <Card>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold dark:text-gray-100">Aturan Konversi Skor Task</h2>
                <div className="flex items-center gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx,.xls,.csv" />
                    <Button onClick={downloadJustificationSample} variant="secondary" size="sm" title="Download Sample">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                    </Button>
                    <Button onClick={handleImportClick} variant="secondary" size="sm" disabled={isImporting} title="Import from Excel">
                        <ArrowUpTrayIcon className="h-5 w-5" />
                    </Button>
                    <Button onClick={handleExport} variant="secondary" size="sm" disabled={isExporting || justifications.length === 0} title="Export to Excel">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                    </Button>
                    <Button onClick={onAdd} size="sm">
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Tambah
                    </Button>
                </div>
            </div>
            {isImporting && <LoadingSpinner />}
            {importStatus && (
                <div className={`p-3 m-4 rounded-md text-sm ${importStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {importStatus.message}
                </div>
            )}
            {loading && <LoadingSpinner />}
            {error && <div className="p-4"><ErrorDisplay message={error} /></div>}
            {!loading && !error && !isImporting && (
                justifications.length > 0 ? (
                    <div className="space-y-6 p-4">
                        {Object.entries(groupedJustifications).map(([role, categories]) => (
                            <div key={role}>
                                <h3 className={`text-lg font-semibold mb-3 p-2 rounded-md ${getRoleColor(role as ParticipantRole)}`}>{role}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(categories).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([category, rules]) => (
                                        <div key={category} className="border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800/50">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{category}</h4>
                                            <ul className="space-y-1 max-h-60 overflow-y-auto pr-2">
                                                {rules.map(rule => (
                                                    <li key={rule.id} className="flex justify-between items-center text-sm p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                                        <span>
                                                            <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">{rule.min_tasks}</span>
                                                            <span className="mx-2 text-gray-400 dark:text-gray-500">&rarr;</span>
                                                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-1.5 py-0.5 rounded">{rule.score}</span>
                                                        </span>
                                                        <span className="space-x-1">
                                                            <button onClick={() => onEdit(rule)} className="p-1 rounded text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><EditIcon className="h-4 w-4"/></button>
                                                            <button onClick={() => onDelete(rule.id, `${rule.min_tasks} -> ${rule.score}`)} className="p-1 rounded text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon className="h-4 w-4"/></button>
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4">
                        <EmptyState title="Belum Ada Aturan" message="Klik 'Tambah' atau 'Import' untuk membuat aturan konversi skor." icon={<ScaleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500"/>} />
                    </div>
                )
            )}
        </Card>
    );
};

export default TaskJustificationPanel;