
import React, { useState } from 'react';
import { LeaderboardEntry } from '../../types';
import { useParticipantReport } from '../../hooks/useParticipantReport';
import { exportParticipantReportToExcel } from '../../utils/exportUtils';
import Button from '../ui/Button';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import TableCellsIcon from '../icons/TableCellsIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import StatCard from './StatCard';
import { getGradeColor } from './ReportShared';
import TaskDetailTable from './TaskDetailTable';

interface ParticipantReportProps {
  participantId: string;
  trainingId: string;
  leaderboardEntry: LeaderboardEntry;
  onBack: () => void;
}

const ReportHeader: React.FC<{
    participantName: string;
    role: string;
    trainingName: string;
}> = ({ participantName, role, trainingName }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full flex flex-col justify-center border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{participantName}</h2>
        <p className="text-lg text-indigo-600 dark:text-indigo-400 font-semibold">{role}</p>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-1">{trainingName}</p>
    </div>
);

const ParticipantReport: React.FC<ParticipantReportProps> = ({ participantId, trainingId, leaderboardEntry, onBack }) => {
    const { participant, training, detailedTasks, stats, loading, error, setError } = useParticipantReport(participantId, trainingId);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (!participant || !training || detailedTasks.length === 0 || isExporting) return;
        setIsExporting(true);
        setError(null);
        try {
            exportParticipantReportToExcel(participant, training, detailedTasks, leaderboardEntry);
        } catch (e: any) {
            setError('Gagal mengekspor data: ' + e.message);
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) return <div className="min-h-screen w-full flex justify-center items-center"><LoadingSpinner /></div>;
    if (error) return <div className="p-8"><ErrorDisplay message={error} /></div>;
    if (!participant || !training) return <div className="p-8"><ErrorDisplay message="Data tidak ditemukan." /></div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Button onClick={onBack} variant="secondary" size="sm">
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Kembali
                    </Button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate text-center">
                        Laporan Peserta
                    </h1>
                    <Button onClick={handleExport} disabled={isExporting} variant="secondary" size="sm">
                        <TableCellsIcon className="h-5 w-5 mr-2" />
                        {isExporting ? 'Mengekspor...' : 'Export'}
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <ReportHeader participantName={participant.name} role={participant.role} trainingName={training.name} />
                    </div>
                    <div className="lg:col-span-1">
                        <StatCard 
                            title="Nilai Akhir" 
                            value={leaderboardEntry.finalGrade} 
                            description={leaderboardEntry.description} 
                            colorClass={getGradeColor(leaderboardEntry.description)}
                            descriptionAsBadge={true}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <StatCard 
                        title="Task Selesai" 
                        value={`${stats.totalCompletedCount}/${stats.totalAssignedTasks}`} 
                        description="Total task yang diselesaikan" 
                        progress={stats.completionPercentage} 
                        colorClass="text-blue-500 dark:text-blue-400"
                        footerLabel="Poin Task Selesai"
                        footerValue={leaderboardEntry.taskCompletionScore}
                    />
                    <StatCard 
                        title="Task Tepat Waktu" 
                        value={`${stats.onTimeCount}/${stats.totalCompletedCount}`} 
                        description="Dari task yang selesai" 
                        progress={stats.onTimePercentage} 
                        colorClass="text-green-500 dark:text-green-400"
                        footerLabel="Poin Tepat Waktu"
                        footerValue={leaderboardEntry.onTimeScore}
                    />
                </div>
                
                <TaskDetailTable tasks={detailedTasks} />
            </main>
        </div>
    );
};

export default ParticipantReport;