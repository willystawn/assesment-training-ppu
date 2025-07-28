import { createClient } from '@supabase/supabase-js';
import { Training, TrainingData, Participant, ParticipantData, MasterTask, MasterTaskData, CompletedTask, CompletedTaskData, ParticipantRole, Justification, JustificationData, FinalJustification, FinalJustificationData, ParticipantScore, ParticipantScoreData } from '../types';

export type Database = {
  public: {
    Tables: {
      trainings: {
        Row: Training;
        Insert: TrainingData;
        Update: Partial<TrainingData>;
      };
      participants: {
        Row: Participant;
        Insert: ParticipantData;
        Update: Partial<ParticipantData>;
      };
      master_tasks: {
        Row: MasterTask;
        Insert: MasterTaskData;
        Update: Partial<MasterTaskData>;
      };
      completed_tasks: {
        Row: CompletedTask;
        Insert: CompletedTaskData;
        Update: Partial<CompletedTaskData>;
      };
      justifications: {
        Row: Justification;
        Insert: JustificationData;
        Update: Partial<JustificationData>;
      };
      final_justifications: {
        Row: FinalJustification;
        Insert: FinalJustificationData;
        Update: Partial<FinalJustificationData>;
      };
      participant_scores: {
        Row: ParticipantScore;
        Insert: ParticipantScoreData;
        Update: Partial<ParticipantScoreData>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}

// IMPORTANT: The user must configure these environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl === 'your-supabase-url' || supabaseAnonKey === 'your-supabase-anon-key') {
    console.warn("Supabase URL or Anon Key is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
}
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Training Management
export const getTrainings = async (): Promise<Training[]> => {
    const { data, error } = await supabase.from('trainings').select('*').order('name', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
};

export const getTrainingById = async (id: string): Promise<Training | null> => {
    const { data, error } = await supabase.from('trainings').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
};

export const createTraining = async (training: TrainingData): Promise<Training> => {
    const { data, error } = await supabase.from('trainings').insert(training).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to create training.");
    return data[0];
};

export const updateTraining = async (id: string, training: Partial<TrainingData>): Promise<Training> => {
    const { data, error } = await supabase.from('trainings').update(training).eq('id', id).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to update training.");
    return data[0];
};

export const deleteTraining = async (id: string): Promise<void> => {
    const { error } = await supabase.from('trainings').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Participant Management
export const getParticipantsByTraining = async (trainingId: string): Promise<Participant[]> => {
    const { data, error } = await supabase.from('participants').select('*').eq('training_id', trainingId).order('name', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
};

export const getParticipantById = async (id: string): Promise<Participant | null> => {
    const { data, error } = await supabase.from('participants').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
};

export const createParticipant = async (participant: ParticipantData): Promise<Participant> => {
    const { data, error } = await supabase.from('participants').insert(participant).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to create participant.");
    return data[0];
};

export const updateParticipant = async (id: string, participant: Partial<ParticipantData>): Promise<Participant> => {
    const { data, error } = await supabase.from('participants').update(participant).eq('id', id).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to update participant.");
    return data[0];
};

export const deleteParticipant = async (id: string): Promise<void> => {
    const { error } = await supabase.from('participants').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Master Task Management
export const getMasterTasks = async (): Promise<MasterTask[]> => {
    const { data, error } = await supabase.from('master_tasks').select('*').order('day_number', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
};

export const createMasterTask = async (task: MasterTaskData): Promise<MasterTask> => {
    const { data, error } = await supabase.from('master_tasks').insert(task).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to create master task.");
    return data[0];
};

export const createBulkMasterTasks = async (tasks: MasterTaskData[]): Promise<MasterTask[]> => {
    const { data, error } = await supabase.from('master_tasks').insert(tasks).select();
    if (error) throw new Error(error.message);
    return data || [];
};

export const updateMasterTask = async (id: string, task: Partial<MasterTaskData>): Promise<MasterTask> => {
    const { data, error } = await supabase.from('master_tasks').update(task).eq('id', id).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to update master task.");
    return data[0];
};

export const deleteMasterTask = async (id: string): Promise<void> => {
    // Assuming cascading delete is set up in Supabase DB
    // to delete related completed_tasks.
    const { error } = await supabase.from('master_tasks').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Completed Task Management
export const getCompletedTasksByParticipants = async (participantIds: string[]): Promise<CompletedTask[]> => {
    if (participantIds.length === 0) return [];
    const { data, error } = await supabase
        .from('completed_tasks')
        .select('*')
        .in('participant_id', participantIds);
    if (error) throw new Error(error.message);
    return data || [];
};

export const createCompletedTask = async (taskData: CompletedTaskData): Promise<CompletedTask> => {
    const { data, error } = await supabase.from('completed_tasks').insert(taskData).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to create completed task.");
    return data[0];
};

export const deleteCompletedTask = async (id: string): Promise<void> => {
    const { error } = await supabase.from('completed_tasks').delete().eq('id', id);
    if (error) throw new Error(error.message);
};


// Justification Management
export const getJustifications = async (): Promise<Justification[]> => {
    const { data, error } = await supabase.from('justifications').select('*').order('min_tasks', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
};

export const createJustification = async (justification: JustificationData): Promise<Justification> => {
    const { data, error } = await supabase.from('justifications').insert(justification).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to create justification.");
    return data[0];
};

export const createBulkJustifications = async (justifications: JustificationData[]): Promise<Justification[]> => {
    const { data, error } = await supabase.from('justifications').insert(justifications).select();
    if (error) throw new Error(error.message);
    return data || [];
};

export const updateJustification = async (id: string, justification: Partial<JustificationData>): Promise<Justification> => {
    const { data, error } = await supabase.from('justifications').update(justification).eq('id', id).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to update justification.");
    return data[0];
};

export const deleteJustification = async (id: string): Promise<void> => {
    const { error } = await supabase.from('justifications').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Final Justification Management
export const getFinalJustifications = async (): Promise<FinalJustification[]> => {
    const { data, error } = await supabase.from('final_justifications').select('*').order('min_score', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
};

export const createFinalJustification = async (justification: FinalJustificationData): Promise<FinalJustification> => {
    const { data, error } = await supabase.from('final_justifications').insert(justification).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to create final justification.");
    return data[0];
};

export const updateFinalJustification = async (id: string, justification: Partial<FinalJustificationData>): Promise<FinalJustification> => {
    const { data, error } = await supabase.from('final_justifications').update(justification).eq('id', id).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Failed to update final justification.");
    return data[0];
};

export const deleteFinalJustification = async (id: string): Promise<void> => {
    const { error } = await supabase.from('final_justifications').delete().eq('id', id);
    if (error) throw new Error(error.message);
};


// Participant Score Management
export const getParticipantScoresByTraining = async (trainingId: string): Promise<ParticipantScore[]> => {
    const { data, error } = await supabase
        .from('participant_scores')
        .select('*')
        .eq('training_id', trainingId);
    if (error) throw new Error(error.message);
    return data || [];
};

export const createParticipantScores = async (scores: ParticipantScoreData[]): Promise<ParticipantScore[]> => {
    const { data, error } = await supabase.from('participant_scores').insert(scores).select();
    if (error) throw new Error(error.message);
    return data || [];
};