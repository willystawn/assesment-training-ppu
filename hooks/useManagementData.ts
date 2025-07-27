

import { useState, useEffect, useCallback } from 'react';
import { Training, Participant, MasterTask, TrainingData, ParticipantData, MasterTaskData } from '../types';
import {
  getTrainings, createTraining, updateTraining, deleteTraining,
  getParticipantsByTraining, createParticipant, updateParticipant, deleteParticipant,
  getMasterTasks, createMasterTask, updateMasterTask, deleteMasterTask, createBulkMasterTasks
} from '../services/supabase';

export const useManagementData = () => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [masterTasks, setMasterTasks] = useState<MasterTask[]>([]);
    const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

    const [loading, setLoading] = useState({ trainings: true, participants: false, tasks: true });
    const [error, setError] = useState<{ trainings: null | string, participants: null | string, tasks: null | string }>({ trainings: null, participants: null, tasks: null });

    const fetchTrainings = useCallback(async (preselectLatest = false) => {
        setLoading(prev => ({ ...prev, trainings: true }));
        setError(prev => ({ ...prev, trainings: null }));
        try {
            const data = await getTrainings();
            setTrainings(data);
            if (preselectLatest && data.length > 0) {
                const latestTraining = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                setSelectedTraining(latestTraining);
            }
        } catch (e: any) {
            setError(prev => ({ ...prev, trainings: e.message }));
        } finally {
            setLoading(prev => ({ ...prev, trainings: false }));
        }
    }, []);
    
    const fetchMasterTasks = useCallback(async () => {
        setLoading(prev => ({ ...prev, tasks: true }));
        setError(prev => ({...prev, tasks: null}));
        try {
            const data = await getMasterTasks();
            setMasterTasks(data);
        } catch (e: any) {
            setError(prev => ({...prev, tasks: e.message}));
        } finally {
            setLoading(prev => ({...prev, tasks: false}));
        }
    }, []);

    useEffect(() => {
        fetchTrainings(true);
        fetchMasterTasks();
    }, [fetchTrainings, fetchMasterTasks]);

    useEffect(() => {
        if (selectedTraining) {
            const fetchParticipants = async () => {
                setLoading(prev => ({ ...prev, participants: true }));
                setError(prev => ({ ...prev, participants: null }));
                setParticipants([]);
                try {
                    const data = await getParticipantsByTraining(selectedTraining.id);
                    setParticipants(data);
                } catch (e: any) {
                    setError(prev => ({ ...prev, participants: e.message }));
                } finally {
                    setLoading(prev => ({ ...prev, participants: false }));
                }
            };
            fetchParticipants();
        } else {
            setParticipants([]);
        }
    }, [selectedTraining]);
    
    const handleTrainingSubmit = async (data: TrainingData, editingTraining: Training | null) => {
        if (editingTraining) {
            const updated = await updateTraining(editingTraining.id, data);
            setTrainings(current => current.map(t => t.id === updated.id ? updated : t));
            if (selectedTraining?.id === updated.id) {
                setSelectedTraining(updated);
            }
        } else {
            await createTraining(data);
            await fetchTrainings();
        }
    };

    const handleDeleteTraining = async (id: string) => {
        if (selectedTraining?.id === id) {
            setSelectedTraining(null);
        }
        await deleteTraining(id);
        await fetchTrainings();
    };

    const handleParticipantSubmit = async (data: ParticipantData, editingParticipant: Participant | null) => {
        if (editingParticipant) {
            await updateParticipant(editingParticipant.id, data);
        } else {
            await createParticipant(data);
        }
        if (selectedTraining) {
             const updatedParticipants = await getParticipantsByTraining(selectedTraining.id);
             setParticipants(updatedParticipants);
        }
    };

    const handleDeleteParticipant = async (id: string) => {
        await deleteParticipant(id);
        if (selectedTraining) {
            const updatedParticipants = await getParticipantsByTraining(selectedTraining.id);
            setParticipants(updatedParticipants);
        }
    };

    const handleTaskSubmit = async (data: MasterTaskData, editingTask: MasterTask | null) => {
        if (editingTask) {
            await updateMasterTask(editingTask.id, data);
        } else {
            await createMasterTask(data);
        }
        await fetchMasterTasks();
    };

    const handleDeleteTask = async (id: string) => {
        await deleteMasterTask(id);
        await fetchMasterTasks();
    };

    const handleTaskImport = async (tasks: MasterTaskData[]) => {
        if (tasks.length === 0) return;
        await createBulkMasterTasks(tasks);
        await fetchMasterTasks();
    };

    return {
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
    };
};