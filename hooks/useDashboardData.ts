
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Training, Participant, MasterTask, LeaderboardEntry, Justification, FinalJustification, ParticipantRole, ParticipantScoreData } from '../types';
import {
  getTrainings,
  getMasterTasks,
  getParticipantsByTraining,
  getCompletedTasksByParticipants,
  getJustifications,
  getFinalJustifications,
  getParticipantScoresByTraining,
  createParticipantScores
} from '../services/supabase';

export const useDashboardData = () => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [masterTasks, setMasterTasks] = useState<MasterTask[]>([]);
    const [justifications, setJustifications] = useState<Justification[]>([]);
    const [finalJustifications, setFinalJustifications] = useState<FinalJustification[]>([]);
    const [selectedTrainingId, setSelectedTrainingId] = useState<string>('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState({ base: true, leaderboard: false });
    const [error, setError] = useState<string | null>(null);

    const selectedTraining = useMemo(() => trainings.find(t => t.id === selectedTrainingId), [trainings, selectedTrainingId]);

    const fetchBaseData = useCallback(async () => {
        setLoading({ base: true, leaderboard: false });
        setError(null);
        try {
            const [trainingsData, masterTasksData, justificationsData, finalJustificationsData] = await Promise.all([
                getTrainings(), 
                getMasterTasks(),
                getJustifications(),
                getFinalJustifications(),
            ]);
            setTrainings(trainingsData);
            setMasterTasks(masterTasksData);
            setJustifications(justificationsData);
            setFinalJustifications(finalJustificationsData);
            if(trainingsData.length > 0 && !selectedTrainingId) {
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

    const calculateLiveLeaderboard = useCallback(async (training: Training, participantsData: Participant[]): Promise<LeaderboardEntry[]> => {
        const participantIds = participantsData.map(p => p.id);
        if (participantIds.length === 0) return [];

        const allCompletedTasks = await getCompletedTasksByParticipants(participantIds);
        const masterTasksMap = new Map(masterTasks.map(mt => [mt.id, mt]));

        const getScoreForTaskCount = (count: number, role: ParticipantRole) => {
            const rule = justifications.find(j => j.role === role && count >= j.min_tasks && count <= j.max_tasks);
            return rule ? rule.score : 0;
        };

        const getFinalDescription = (grade: number) => {
            const rule = finalJustifications.find(fj => grade >= fj.min_score && grade <= fj.max_score);
            return rule ? rule.description : "N/A";
        };
        
        const scores = participantsData.map(participant => {
            const participantCompletedTasks = allCompletedTasks.filter(ct => ct.participant_id === participant.id);
            const totalCompletedCount = participantCompletedTasks.length;
            
            const onTimeCompletedCount = participantCompletedTasks.filter(ct => {
                const mTask = masterTasksMap.get(ct.task_id);
                if (!mTask) return false;

                const dueDate = new Date(training.start_date);
                dueDate.setUTCHours(0, 0, 0, 0);
                dueDate.setUTCDate(dueDate.getUTCDate() + mTask.day_number - 1);
                
                const completionDate = new Date(ct.completion_date);
                completionDate.setUTCHours(0, 0, 0, 0);
                
                return completionDate <= dueDate;
            }).length;

            const taskCompletionScore = getScoreForTaskCount(totalCompletedCount, participant.role);
            const onTimeScore = getScoreForTaskCount(onTimeCompletedCount, participant.role);

            const finalGrade = (taskCompletionScore * 0.6) + (onTimeScore * 0.4);

            return {
                participantId: participant.id,
                participantName: participant.name,
                taskCompletionScore,
                onTimeScore,
                finalGrade: Math.round(finalGrade),
                description: getFinalDescription(Math.round(finalGrade)),
                createdAt: participant.created_at,
            };
        });

        return scores;
    }, [masterTasks, justifications, finalJustifications]);

    useEffect(() => {
        const processLeaderboard = async () => {
            if (!selectedTraining) {
                setLeaderboard([]);
                setParticipants([]);
                return;
            }

            setLoading(prev => ({ ...prev, leaderboard: true }));
            setError(null);
            setLeaderboard([]);

            try {
                const participantsData = await getParticipantsByTraining(selectedTraining.id);
                setParticipants(participantsData);
                if (participantsData.length === 0) {
                    setLoading(prev => ({ ...prev, leaderboard: false }));
                    return;
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const trainingEndDate = new Date(selectedTraining.end_date);
                const isCompleted = trainingEndDate < today;

                let finalLeaderboard: LeaderboardEntry[] = [];

                if (isCompleted) {
                    const cachedScores = await getParticipantScoresByTraining(selectedTraining.id);
                    const participantMap = new Map(participantsData.map(p => [p.id, { name: p.name, createdAt: p.created_at }]));

                    if (cachedScores.length > 0 && cachedScores.length === participantsData.length) {
                        finalLeaderboard = cachedScores.map(score => {
                             const participantInfo = participantMap.get(score.participant_id);
                             return {
                                participantId: score.participant_id,
                                participantName: participantInfo?.name || 'Unknown Participant',
                                taskCompletionScore: score.task_completion_score,
                                onTimeScore: score.on_time_score,
                                finalGrade: score.final_grade,
                                description: score.description,
                                createdAt: participantInfo?.createdAt || new Date(0).toISOString(),
                            };
                        });
                    } else {
                        const calculatedData = await calculateLiveLeaderboard(selectedTraining, participantsData);
                        
                        const scoresToCache: ParticipantScoreData[] = calculatedData.map(entry => ({
                            participant_id: entry.participantId,
                            training_id: selectedTraining.id,
                            task_completion_score: entry.taskCompletionScore,
                            on_time_score: entry.onTimeScore,
                            final_grade: entry.finalGrade,
                            description: entry.description,
                        }));

                        if (scoresToCache.length > 0) {
                            await createParticipantScores(scoresToCache);
                        }
                        
                        finalLeaderboard = calculatedData;
                    }
                } else {
                    finalLeaderboard = await calculateLiveLeaderboard(selectedTraining, participantsData);
                }
                
                finalLeaderboard.sort((a, b) => {
                    if (b.finalGrade !== a.finalGrade) return b.finalGrade - a.finalGrade;
                    if (b.taskCompletionScore !== a.taskCompletionScore) return b.taskCompletionScore - a.taskCompletionScore;
                    if (b.onTimeScore !== a.onTimeScore) return b.onTimeScore - a.onTimeScore;
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                });
                setLeaderboard(finalLeaderboard);

            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(prev => ({ ...prev, leaderboard: false }));
            }
        };

        processLeaderboard();
    }, [selectedTraining, calculateLiveLeaderboard]);

    return {
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
    };
};
