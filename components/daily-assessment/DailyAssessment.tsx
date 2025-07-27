
import React from 'react';
import { useDailyAssessment } from '../../hooks/useDailyAssessment';
import AssessmentFilters from './AssessmentFilters';
import ParticipantCard from './ParticipantCard';
import InfoMessage from './InfoMessage';
import PageHeader from '../common/PageHeader';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import ClipboardListIcon from '../icons/ClipboardListIcon';
import UserGroupIcon from '../icons/UserGroupIcon';
import { getDayNumber } from '../../utils/dateUtils';

const DailyAssessment: React.FC = () => {
    const {
        selectedDate,
        setSelectedDate,
        selectedTrainingId,
        setSelectedTrainingId,
        roleFilter,
        setRoleFilter,
        trainings,
        masterTasks,
        participants,
        completedTasks,
        loading,
        error,
        selectedTraining,
        filteredParticipants,
        handleCreateCompletedTask,
        handleDeleteCompletedTask,
    } = useDailyAssessment();

    const renderContent = () => {
        if (loading.details) {
            return <div className="col-span-full"><LoadingSpinner /></div>;
        }

        if (!selectedTrainingId) {
            return <InfoMessage icon={<ClipboardListIcon />} title="Mulai Penilaian">Pilih tanggal dan batch training untuk menampilkan daftar peserta.</InfoMessage>;
        }
        
        if (participants.length === 0) {
            return <InfoMessage icon={<UserGroupIcon />} title="Tidak Ada Peserta">Batch training ini belum memiliki peserta. Tambahkan peserta di halaman Manajemen Data.</InfoMessage>;
        }

        if (filteredParticipants.length === 0) {
            return <InfoMessage icon={<UserGroupIcon />} title="Tidak Ada Hasil">Tidak ada peserta yang cocok dengan filter yang dipilih.</InfoMessage>;
        }
        
        return filteredParticipants.map(participant => {
            const dayNumber = selectedTraining ? getDayNumber(selectedTraining, selectedDate) : -1;
            const tasksForDay = dayNumber > 0 ? masterTasks.filter(
                task => task.role === participant.role && task.day_number === dayNumber
            ) : [];

            return (
                <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    tasksForDay={tasksForDay}
                    completedTasks={completedTasks}
                    dayNumber={dayNumber}
                    selectedDate={selectedDate}
                    onCreateCompletedTask={handleCreateCompletedTask}
                    onDeleteCompletedTask={handleDeleteCompletedTask}
                />
            );
        });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <PageHeader title="Penilaian Harian" />
            
            {loading.base && <LoadingSpinner />}
            {error && !loading.base && <ErrorDisplay message={error} />}

            {!loading.base && trainings.length > 0 && (
                <AssessmentFilters
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    selectedTrainingId={selectedTrainingId}
                    onTrainingChange={setSelectedTrainingId}
                    trainings={trainings}
                    roleFilter={roleFilter}
                    onRoleFilterChange={setRoleFilter}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {renderContent()}
            </div>

            {!loading.base && trainings.length === 0 && !error && (
                 <InfoMessage icon={<ClipboardListIcon />} title="Belum Ada Batch Training">
                    Silakan buat batch training terlebih dahulu di halaman Manajemen Data untuk memulai penilaian.
                 </InfoMessage>
             )}
        </div>
    );
};

export default DailyAssessment;
