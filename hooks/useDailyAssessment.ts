
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Training, Participant, MasterTask, CompletedTask, ParticipantRole } from '../types';
import {
  getTrainings,
  getMasterTasks,
  getParticipantsByTraining,
  getCompletedTasksByParticipants,
  createCompletedTask,
  deleteCompletedTask,
} from '../services/supabase';

export const useDailyAssessment = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedTrainingId, setSelectedTrainingId] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<'all' | ParticipantRole>('all');

    const [trainings, setTrainings] = useState<Training[]>([]);
    const [masterTasks, setMasterTasks] = useState<MasterTask[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);

    const [loading, setLoading] = useState({ base: true, details: false });
    const [error, setError] = useState<string | null>(null);

    const selectedTraining = useMemo(() => trainings.find(t => t.id === selectedTrainingId), [trainings, selectedTrainingId]);

    const fetchBaseData = useCallback(async () => {
        setLoading({ base: true, details: false });
        setError(null);
        try {
            const [trainingsData, masterTasksData] = await Promise.all([getTrainings(), getMasterTasks()]);
            setTrainings(trainingsData);
            setMasterTasks(masterTasksData);

            if (trainingsData.length > 0 && !selectedTrainingId) {
                const latestTraining = [...trainingsData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                setSelectedTrainingId(latestTraining.id);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(prev => ({ ...prev, base: false }));
        }
    }, [selectedTrainingId]);
    
    useEffect(() => {
        fetchBaseData();
    }, [fetchBaseData]);

    useEffect(() => {
        if (!selectedTrainingId) {
            setParticipants([]);
            setCompletedTasks([]);
            return;
        }

        const fetchDetails = async () => {
            setLoading(prev => ({...prev, details: true}));
            setError(null);
            setCompletedTasks([]);
            try {
                const participantsData = await getParticipantsByTraining(selectedTrainingId);
                setParticipants(participantsData);
                if (participantsData.length > 0) {
                    const participantIds = participantsData.map(p => p.id);
                    const completedTasksData = await getCompletedTasksByParticipants(participantIds);
                    setCompletedTasks(completedTasksData);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(prev => ({ ...prev, details: false}));
            }
        };

        fetchDetails();
    }, [selectedTrainingId]);
    
    const filteredParticipants = useMemo(() => {
        if (roleFilter === 'all') {
            return participants;
        }
        return participants.filter(p => p.role === roleFilter);
    }, [participants, roleFilter]);

    const handleCreateCompletedTask = async (participantId: string, taskId: string) => {
        try {
            const newCompletedTask = await createCompletedTask({
                participant_id: participantId,
                task_id: taskId,
                completion_date: new Date().toISOString().split('T')[0],
            });
            setCompletedTasks(prev => [...prev, newCompletedTask]);
        } catch (err: any) {
            setError(`Gagal menyimpan task: ${err.message}`);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleDeleteCompletedTask = async (participantId: string, taskId: string) => {
        const taskToDelete = completedTasks.find(ct => ct.participant_id === participantId && ct.task_id === taskId);
        if (taskToDelete) {
            try {
                await deleteCompletedTask(taskToDelete.id);
                setCompletedTasks(prev => prev.filter(ct => ct.id !== taskToDelete.id));
            } catch (err: any) {
                setError(`Gagal menghapus task: ${err.message}`);
                setTimeout(() => setError(null), 3000);
            }
        }
    };

    return {
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
    };
};
