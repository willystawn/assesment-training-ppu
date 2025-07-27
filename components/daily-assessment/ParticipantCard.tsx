
import React, { useState } from 'react';
import { Participant, MasterTask, CompletedTask } from '../../types';
import Card from '../ui/Card';
import InfoMessage from './InfoMessage';
import ConfirmationModal from '../modals/ConfirmationModal';
import ClipboardListIcon from '../icons/ClipboardListIcon';
import Avatar from '../common/Avatar';
import { getBacklogColor } from '../../utils/colors';
import CheckIcon from '../icons/CheckIcon';

interface ParticipantCardProps {
    participant: Participant;
    tasksForDay: MasterTask[];
    completedTasks: CompletedTask[];
    dayNumber: number;
    selectedDate: string;
    onCreateCompletedTask: (participantId: string, taskId: string) => void;
    onDeleteCompletedTask: (participantId: string, taskId: string) => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
    participant,
    tasksForDay,
    completedTasks,
    dayNumber,
    selectedDate,
    onCreateCompletedTask,
    onDeleteCompletedTask
}) => {
    const [confirmation, setConfirmation] = useState<{ isOpen: boolean; onConfirm: () => void; } | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleTaskCheckboxChange = (taskId: string, isChecked: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
        if (isChecked) {
            const alreadyCompleted = completedTasks.some(ct => ct.participant_id === participant.id && ct.task_id === taskId);
            if (alreadyCompleted) return;
            onCreateCompletedTask(participant.id, taskId);
        } else {
            e.preventDefault(); // Prevent unchecking immediately
            const taskToDelete = completedTasks.find(ct => ct.participant_id === participant.id && ct.task_id === taskId);
            if (taskToDelete) {
                setConfirmation({
                    isOpen: true,
                    onConfirm: async () => {
                        setIsConfirming(true);
                        await onDeleteCompletedTask(participant.id, taskId);
                        setIsConfirming(false);
                        setConfirmation(null);
                    }
                });
            }
        }
    };
    
    return (
        <>
            <Card key={participant.id} className="overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-800/50">
                <div className="p-4 flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700">
                    <Avatar name={participant.name} size="lg"/>
                    <div className="flex-grow">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{participant.name}</h3>
                        <p className="text-base text-gray-500 dark:text-gray-400">{participant.role}</p>
                    </div>
                    {dayNumber > 0 && (
                       <div className="text-right flex-shrink-0">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-md text-sm font-bold">Hari ke-{dayNumber}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                       </div>
                    )}
                </div>

                <div className="p-4 flex-grow flex flex-col">
                    {dayNumber <= 0 && <div className="flex-grow flex items-center justify-center"><InfoMessage icon={<ClipboardListIcon />} title="Di Luar Periode Training">Tanggal penilaian tidak termasuk jadwal.</InfoMessage></div>}
                    
                    {dayNumber > 0 && tasksForDay.length === 0 && <div className="flex-grow flex items-center justify-center"><InfoMessage icon={<ClipboardListIcon />} title="Tidak Ada Task">Tidak ada task untuk posisi ini.</InfoMessage></div>}
                    
                    {tasksForDay.length > 0 && (
                        <div className="space-y-3">
                            {tasksForDay.map(masterTask => {
                                const isCompleted = completedTasks.some(ct => ct.participant_id === participant.id && ct.task_id === masterTask.id);
                                return (
                                    <label
                                        key={masterTask.id}
                                        htmlFor={`task-${participant.id}-${masterTask.id}`}
                                        className={`relative block p-4 border rounded-lg transition-all duration-300 cursor-pointer ${
                                            isCompleted
                                            ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-900/40 dark:border-emerald-700'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 hover:border-indigo-400 dark:hover:bg-gray-700/50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <input
                                                id={`task-${participant.id}-${masterTask.id}`}
                                                type="checkbox"
                                                checked={isCompleted}
                                                onChange={(e) => handleTaskCheckboxChange(masterTask.id, e.target.checked, e)}
                                                className="h-6 w-6 mt-0.5 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-offset-gray-800"
                                            />
                                            <div className="flex-grow pt-0.5">
                                                <p className={`text-base transition-colors duration-150 ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                    {masterTask.user_story}
                                                </p>
                                                {masterTask.backlog && (
                                                    <span className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBacklogColor(masterTask.backlog)}`}>
                                                        {masterTask.backlog}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {isCompleted && (
                                            <div className="absolute top-2 right-2 text-emerald-600 dark:text-emerald-400 opacity-70">
                                                <CheckIcon className="w-5 h-5" />
                                            </div>
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Card>

            {confirmation?.isOpen && (
                <ConfirmationModal
                    isOpen={confirmation.isOpen}
                    onClose={() => setConfirmation(null)}
                    onConfirm={confirmation.onConfirm}
                    title="Batalkan Penyelesaian Task"
                    message="Apakah Anda yakin ingin membatalkan penyelesaian task ini?"
                    confirmText="Ya, Batalkan"
                    cancelText="Tidak"
                    confirmVariant="danger"
                    isConfirming={isConfirming}
                />
            )}
        </>
    );
};

export default ParticipantCard;
