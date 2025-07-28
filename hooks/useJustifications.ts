
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Justification, JustificationData, FinalJustification, FinalJustificationData } from '../types';
import {
  getJustifications, createJustification, updateJustification, deleteJustification,
  getFinalJustifications, createFinalJustification, updateFinalJustification, deleteFinalJustification,
  createBulkJustifications
} from '../services/supabase';

export const useJustifications = () => {
    const [justifications, setJustifications] = useState<Justification[]>([]);
    const [finalJustifications, setFinalJustifications] = useState<FinalJustification[]>([]);

    const [loading, setLoading] = useState({ just: true, final: true });
    const [error, setError] = useState<{ just: string | null, final: string | null }>({ just: null, final: null });

    const fetchJustifications = useCallback(async () => {
        setLoading(prev => ({ ...prev, just: true }));
        setError(prev => ({ ...prev, just: null }));
        try {
            const data = await getJustifications();
            setJustifications(data);
        } catch (e: any) {
            setError(prev => ({ ...prev, just: e.message }));
        } finally {
            setLoading(prev => ({ ...prev, just: false }));
        }
    }, []);

    const fetchFinalJustifications = useCallback(async () => {
        setLoading(prev => ({ ...prev, final: true }));
        setError(prev => ({ ...prev, final: null }));
        try {
            const data = await getFinalJustifications();
            setFinalJustifications(data);
        } catch (e: any) {
            setError(prev => ({ ...prev, final: e.message }));
        } finally {
            setLoading(prev => ({ ...prev, final: false }));
        }
    }, []);
    
    useEffect(() => {
        fetchJustifications();
        fetchFinalJustifications();
    }, [fetchJustifications, fetchFinalJustifications]);

    const sortedJustifications = useMemo(() => {
        return [...justifications].sort((a, b) => {
            const roleCompare = a.role.localeCompare(b.role);
            if (roleCompare !== 0) return roleCompare;
            return a.min_tasks - b.min_tasks;
        });
    }, [justifications]);

    const sortedFinalJustifications = useMemo(() => {
        return [...finalJustifications].sort((a, b) => a.min_score - b.min_score);
    }, [finalJustifications]);
    
    const handleJustificationSubmit = async (data: JustificationData, editingJustification: Justification | null) => {
        if (editingJustification) {
            await updateJustification(editingJustification.id, data);
        } else {
            await createJustification(data);
        }
        await fetchJustifications();
    };

    const handleDeleteJustification = async (id: string) => {
        await deleteJustification(id);
        await fetchJustifications();
    };
    
    const handleJustificationImport = async (justifications: JustificationData[]) => {
        if (justifications.length === 0) return;
        await createBulkJustifications(justifications);
        await fetchJustifications();
    };
    
    const handleFinalSubmit = async (data: FinalJustificationData, editingFinal: FinalJustification | null) => {
        if (editingFinal) {
            await updateFinalJustification(editingFinal.id, data);
        } else {
            await createFinalJustification(data);
        }
        await fetchFinalJustifications();
    };

    const handleDeleteFinal = async (id: string) => {
        await deleteFinalJustification(id);
        await fetchFinalJustifications();
    };

    return {
        sortedJustifications,
        sortedFinalJustifications,
        loading,
        error,
        handleJustificationSubmit,
        handleDeleteJustification,
        handleJustificationImport,
        handleFinalSubmit,
        handleDeleteFinal,
    };
};