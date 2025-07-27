
import { useState, useEffect, useMemo } from 'react';
import { Participant, Training, MasterTask, DetailedTask } from '../types';
import { getParticipantById, getTrainingById, getMasterTasks, getCompletedTasksByParticipants } from '../services/supabase';

export const useParticipantReport = (participantId: string, trainingId: string) => {
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [training, setTraining] = useState<Training | null>(null);
    const [detailedTasks, setDetailedTasks] = useState<DetailedTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [
                    participantData,
                    trainingData,
                    masterTasksData,
                    completedTasksData,
                ] = await Promise.all([
                    getParticipantById(participantId),
                    getTrainingById(trainingId),
                    getMasterTasks(),
                    getCompletedTasksByParticipants([participantId]),
                ]);

                if (!participantData || !trainingData) {
                    throw new Error("Participant or Training not found");
                }
                
                setParticipant(participantData);
                setTraining(trainingData);

                const participantMasterTasks = masterTasksData.filter(t => t.role === participantData.role);
                const completedTasksMap = new Map(completedTasksData.map(ct => [ct.task_id, ct]));

                const tasks: DetailedTask[] = participantMasterTasks.map(mTask => {
                    const completedTask = completedTasksMap.get(mTask.id);
                    let status: DetailedTask['status'] = 'Belum Selesai';
                    let completionDate: string | null = null;
                    
                    if (completedTask) {
                        completionDate = completedTask.completion_date;
                        const dueDate = new Date(trainingData.start_date);
                        dueDate.setUTCHours(0, 0, 0, 0);
                        dueDate.setUTCDate(dueDate.getUTCDate() + mTask.day_number - 1);
                        
                        const completedOn = new Date(completedTask.completion_date);
                        completedOn.setUTCHours(0, 0, 0, 0);

                        status = completedOn <= dueDate ? 'Tepat Waktu' : 'Terlambat';
                    }
                    
                    return {
                        ...mTask,
                        status,
                        completionDate,
                    };
                });

                setDetailedTasks(tasks.sort((a,b) => a.day_number - b.day_number));

            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [participantId, trainingId]);

    const stats = useMemo(() => {
        if (!detailedTasks.length) {
            return { totalAssignedTasks: 0, totalCompletedCount: 0, onTimeCount: 0, completionPercentage: 0, onTimePercentage: 0 };
        }
    
        const assigned = detailedTasks.length;
        const completed = detailedTasks.filter(t => t.status === 'Tepat Waktu' || t.status === 'Terlambat').length;
        const onTime = detailedTasks.filter(t => t.status === 'Tepat Waktu').length;

        const completionPerc = assigned > 0 ? (completed / assigned) * 100 : 0;
        const onTimePerc = completed > 0 ? (onTime / completed) * 100 : 0;

        return {
            totalAssignedTasks: assigned,
            totalCompletedCount: completed,
            onTimeCount: onTime,
            completionPercentage: completionPerc,
            onTimePercentage: onTimePerc,
        };
    }, [detailedTasks]);

    return { participant, training, detailedTasks, stats, loading, error, setError };
};
