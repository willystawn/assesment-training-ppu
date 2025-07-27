


import React, { useState } from 'react';
import { Training, Participant, MasterTask, TrainingData, ParticipantData, MasterTaskData } from '../../types';
import { useManagementData } from '../../hooks/useManagementData';
import TrainingList from './TrainingList';
import ParticipantPanel from './ParticipantPanel';
import MasterTaskPanel from './MasterTaskPanel';
import RightPanelPlaceholder from './RightPanelPlaceholder';
import TrainingModal from '../modals/TrainingModal';
import ParticipantModal from '../modals/ParticipantModal';
import MasterTaskModal from '../modals/MasterTaskModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import PageHeader from '../common/PageHeader';

const Management = () => {
    const {
        trainings,
        participants,
        masterTasks,
        selectedTraining,
        setSelectedTraining,
        loading,
        error,
        handleTrainingSubmit,
        handleDeleteTraining,
        handleParticipantSubmit,
        handleDeleteParticipant,
        handleTaskSubmit,
        handleDeleteTask,
        handleTaskImport,
    } = useManagementData();

    // Modal states
    const [isTrainingModalOpen, setTrainingModalOpen] = useState(false);
    const [editingTraining, setEditingTraining] = useState<Training | null>(null);

    const [isParticipantModalOpen, setParticipantModalOpen] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<MasterTask | null>(null);

    const [confirmation, setConfirmation] = useState<{ isOpen: boolean; title: string; message: React.ReactNode; onConfirm: () => void; confirmVariant?: 'primary' | 'danger'; } | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    // Modal Triggers
    const openTrainingModal = (training: Training | null) => {
        setEditingTraining(training);
        setTrainingModalOpen(true);
    };

    const openParticipantModal = (participant: Participant | null) => {
        setEditingParticipant(participant);
        setParticipantModalOpen(true);
    };
    
    const openTaskModal = (task: MasterTask | null) => {
        setEditingTask(task);
        setTaskModalOpen(true);
    };

    // CRUD Handlers with Confirmation
    const submitTraining = async (data: TrainingData) => {
        await handleTrainingSubmit(data, editingTraining);
    };

    const confirmDeleteTraining = (id: string, name: string) => {
        setConfirmation({
            isOpen: true,
            title: 'Hapus Batch Training',
            message: <>Apakah Anda yakin ingin menghapus <strong>{name}</strong>? Tindakan ini akan menghapus semua data terkait.</>,
            onConfirm: async () => {
                setIsConfirming(true);
                try {
                    await handleDeleteTraining(id);
                } finally {
                    setIsConfirming(false);
                    setConfirmation(null);
                }
            },
            confirmVariant: 'danger'
        });
    };

    const submitParticipant = async (data: ParticipantData) => {
        await handleParticipantSubmit(data, editingParticipant);
    };
    
    const confirmDeleteParticipant = (id: string, name: string) => {
         setConfirmation({
            isOpen: true,
            title: 'Hapus Peserta',
            message: <>Apakah Anda yakin ingin menghapus <strong>{name}</strong>?</>,
            onConfirm: async () => {
                setIsConfirming(true);
                try {
                    await handleDeleteParticipant(id);
                } finally {
                    setIsConfirming(false);
                    setConfirmation(null);
                }
            },
            confirmVariant: 'danger'
        });
    };
    
    const submitTask = async (data: MasterTaskData) => {
        await handleTaskSubmit(data, editingTask);
    };

    const confirmDeleteTask = (id: string, name: string) => {
        setConfirmation({
            isOpen: true,
            title: 'Hapus Master Task',
            message: <>Apakah Anda yakin ingin menghapus task <strong>{name}</strong>?</>,
            onConfirm: async () => {
                setIsConfirming(true);
                try {
                    await handleDeleteTask(id);
                } finally {
                    setIsConfirming(false);
                    setConfirmation(null);
                }
            },
            confirmVariant: 'danger'
        });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <PageHeader title="Manajemen Data Master" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 xl:col-span-4">
                    <TrainingList
                        trainings={trainings}
                        selectedTraining={selectedTraining}
                        onSelectTraining={setSelectedTraining}
                        onAdd={() => openTrainingModal(null)}
                        onEdit={openTrainingModal}
                        onDelete={confirmDeleteTraining}
                        loading={loading.trainings}
                        error={error.trainings}
                    />
                </div>
                
                <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                    {!selectedTraining && !loading.trainings ? (
                        <RightPanelPlaceholder />
                    ) : (
                        <>
                            <ParticipantPanel
                                participants={participants}
                                selectedTraining={selectedTraining}
                                onAdd={() => openParticipantModal(null)}
                                onEdit={openParticipantModal}
                                onDelete={confirmDeleteParticipant}
                                loading={loading.participants}
                                error={error.participants}
                            />
                            <MasterTaskPanel
                                masterTasks={masterTasks}
                                onAdd={() => openTaskModal(null)}
                                onEdit={openTaskModal}
                                onDelete={confirmDeleteTask}
                                loading={loading.tasks}
                                error={error.tasks}
                                onImport={handleTaskImport}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <TrainingModal
                isOpen={isTrainingModalOpen}
                onClose={() => setTrainingModalOpen(false)}
                onSubmit={submitTraining}
                initialData={editingTraining}
            />
            {selectedTraining && (
                <ParticipantModal
                    isOpen={isParticipantModalOpen}
                    onClose={() => setParticipantModalOpen(false)}
                    onSubmit={submitParticipant}
                    trainingId={selectedTraining.id}
                    initialData={editingParticipant}
                />
            )}
            <MasterTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setTaskModalOpen(false)}
                onSubmit={submitTask}
                initialData={editingTask}
            />
            {confirmation?.isOpen && (
                <ConfirmationModal
                    isOpen={confirmation.isOpen}
                    onClose={() => setConfirmation(null)}
                    onConfirm={confirmation.onConfirm}
                    title={confirmation.title}
                    message={confirmation.message}
                    isConfirming={isConfirming}
                    confirmVariant={confirmation.confirmVariant}
                />
            )}
        </div>
    );
};

export default Management;