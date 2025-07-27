
import React, { useState } from 'react';
import { LeaderboardEntry } from '../../types';
import { useDashboardData } from '../../hooks/useDashboardData';
import { exportLeaderboardToExcel } from '../../utils/exportUtils';
import DashboardHeader from './DashboardHeader';
import StatCards from './StatCards';
import LeaderboardTable from './LeaderboardTable';
import Card from '../ui/Card';
import PageHeader from '../common/PageHeader';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

interface DashboardProps {
    onSelectParticipant: (trainingId: string, entry: LeaderboardEntry) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectParticipant }) => {
    const {
        trainings,
        masterTasks,
        selectedTrainingId,
        setSelectedTrainingId,
        participants,
        leaderboard,
        loading,
        error,
        setError,
        selectedTraining,
    } = useDashboardData();

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (!selectedTraining || participants.length === 0 || isExporting) return;
        setIsExporting(true);
        setError(null);
        try {
            await exportLeaderboardToExcel(leaderboard, participants, masterTasks, selectedTraining);
        } catch (e: any) {
            setError("Gagal membuat file Excel: " + e.message);
        } finally {
            setIsExporting(false);
        }
    };

    const renderContent = () => {
        if (loading.leaderboard) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <ErrorDisplay message={error} />;
        }
        if (selectedTrainingId) {
            return (
                <>
                    <StatCards leaderboard={leaderboard} participantCount={participants.length} />
                    <LeaderboardTable
                        leaderboard={leaderboard}
                        trainingName={selectedTraining?.name || ''}
                        onExport={handleExport}
                        isExporting={isExporting}
                        canExport={!!selectedTraining && participants.length > 0 && !loading.leaderboard}
                        onSelectParticipant={(entry) => onSelectParticipant(selectedTrainingId, entry)}
                    />
                </>
            );
        }
        return (
            <Card>
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                    Pilih batch training untuk melihat dashboard performa.
                </p>
            </Card>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <DashboardHeader
                trainings={trainings}
                selectedTrainingId={selectedTrainingId}
                onTrainingChange={setSelectedTrainingId}
                loading={loading.base}
            />
            
            {loading.base ? <LoadingSpinner /> : (
                <div className="space-y-6">
                    {renderContent()}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
