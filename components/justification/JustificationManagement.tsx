
import React, { useState } from 'react';
import { Justification, FinalJustification, JustificationData, FinalJustificationData } from '../../types';
import { useJustifications } from '../../hooks/useJustifications';
import Card from '../ui/Card';
import ScaleIcon from '../icons/ScaleIcon';
import PageHeader from '../common/PageHeader';
import JustificationModal from '../modals/JustificationModal';
import FinalJustificationModal from '../modals/FinalJustificationModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import TaskJustificationPanel from './TaskJustificationPanel';
import FinalJustificationPanel from './FinalJustificationPanel';

const JustificationManagement: React.FC = () => {
    const [view, setView] = useState<'task' | 'final'>('task');
    const {
        sortedJustifications,
        sortedFinalJustifications,
        loading,
        error,
        handleJustificationSubmit,
        handleDeleteJustification,
        handleJustificationImport,
        handleFinalSubmit,
        handleDeleteFinal,
    } = useJustifications();

    const [isJustificationModalOpen, setJustificationModalOpen] = useState(false);
    const [editingJustification, setEditingJustification] = useState<Justification | null>(null);

    const [isFinalModalOpen, setFinalModalOpen] = useState(false);
    const [editingFinal, setEditingFinal] = useState<FinalJustification | null>(null);

    const [confirmation, setConfirmation] = useState<{ isOpen: boolean; title: string; message: React.ReactNode; onConfirm: () => void; confirmVariant?: 'primary' | 'danger' } | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    
    const openJustificationModal = (data: Justification | null) => {
        setEditingJustification(data);
        setJustificationModalOpen(true);
    };

    const openFinalModal = (data: FinalJustification | null) => {
        setEditingFinal(data);
        setFinalModalOpen(true);
    };
    
    const submitJustification = async (data: JustificationData) => {
        await handleJustificationSubmit(data, editingJustification);
    };

    const confirmDeleteJustification = (id: string, description: string) => {
        setConfirmation({
            isOpen: true,
            title: 'Hapus Aturan Justifikasi',
            message: <>Apakah Anda yakin ingin menghapus aturan <strong>{description}</strong>?</>,
            onConfirm: async () => {
                setIsConfirming(true);
                try {
                    await handleDeleteJustification(id);
                } finally {
                    setIsConfirming(false);
                    setConfirmation(null);
                }
            },
            confirmVariant: 'danger'
        });
    };
    
    const submitFinalJustification = async (data: FinalJustificationData) => {
        await handleFinalSubmit(data, editingFinal);
    };

    const confirmDeleteFinal = (id: string, description: string) => {
        setConfirmation({
            isOpen: true,
            title: 'Hapus Aturan Justifikasi Akhir',
            message: <>Apakah Anda yakin ingin menghapus aturan <strong>{description}</strong>?</>,
            onConfirm: async () => {
                setIsConfirming(true);
                try {
                    await handleDeleteFinal(id);
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
            <PageHeader title="Manajemen Justifikasi Penilaian" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3">
                    <Card>
                        <div className="p-4 border-b dark:border-gray-700">
                            <h2 className="text-xl font-semibold dark:text-gray-100">Kategori Aturan</h2>
                        </div>
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => setView('task')}
                                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${view === 'task' ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >
                                <ScaleIcon className="h-5 w-5 flex-shrink-0" />
                                <span className="flex-grow">Justifikasi Penyelesaian Task</span>
                            </button>
                            <button
                                onClick={() => setView('final')}
                                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${view === 'final' ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >
                                <ScaleIcon className="h-5 w-5 flex-shrink-0" />
                                <span className="flex-grow">Justifikasi Hasil Akhir</span>
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    {view === 'task' ? (
                        <TaskJustificationPanel 
                            justifications={sortedJustifications}
                            loading={loading.just}
                            error={error.just}
                            onAdd={() => openJustificationModal(null)}
                            onEdit={openJustificationModal}
                            onDelete={confirmDeleteJustification}
                            onImport={handleJustificationImport}
                        />
                    ) : (
                        <FinalJustificationPanel 
                            finalJustifications={sortedFinalJustifications}
                            loading={loading.final}
                            error={error.final}
                            onAdd={() => openFinalModal(null)}
                            onEdit={openFinalModal}
                            onDelete={confirmDeleteFinal}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            <JustificationModal
                isOpen={isJustificationModalOpen}
                onClose={() => setJustificationModalOpen(false)}
                onSubmit={submitJustification}
                initialData={editingJustification}
            />
            <FinalJustificationModal
                isOpen={isFinalModalOpen}
                onClose={() => setFinalModalOpen(false)}
                onSubmit={submitFinalJustification}
                initialData={editingFinal}
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

export default JustificationManagement;