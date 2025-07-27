
export interface TrainingData {
  name: string;
  start_date: string;
  end_date: string;
}

export interface Training {
  id: string;
  created_at: string;
  name: string;
  start_date: string;
  end_date: string;
}

export enum ParticipantRole {
  FRONTEND = 'Frontend Developer',
  BACKEND = 'Backend Developer',
}

export interface ParticipantData {
  name: string;
  role: ParticipantRole;
  training_id: string;
}

export interface Participant {
  id: string;
  created_at: string;
  name: string;
  role: ParticipantRole;
  training_id: string;
}

export interface MasterTaskData {
  day_number: number;
  backlog: string;
  user_story: string;
  role: ParticipantRole;
  target_points: number;
}

export interface MasterTask {
  id: string;
  created_at: string;
  day_number: number;
  backlog: string;
  user_story: string;
  role: ParticipantRole;
  target_points: number;
}

export interface CompletedTaskData {
  participant_id: string;
  task_id: string;
  completion_date: string;
}

export interface CompletedTask {
  id: string;
  created_at: string;
  participant_id: string;
  task_id: string;
  completion_date: string;
}

export interface JustificationData {
    role: ParticipantRole;
    min_tasks: number;
    max_tasks: number;
    score: number;
    description: string;
}

export interface Justification {
    id: string;
    created_at: string;
    role: ParticipantRole;
    min_tasks: number;
    max_tasks: number;
    score: number;
    description: string;
}

export interface FinalJustificationData {
    min_score: number;
    max_score: number;
    description: string;
}

export interface FinalJustification {
    id: string;
    created_at: string;
    min_score: number;
    max_score: number;
    description: string;
}

export interface ParticipantScoreData {
    participant_id: string;
    training_id: string;
    task_completion_score: number;
    on_time_score: number;
    final_grade: number;
    description: string;
}

export interface ParticipantScore {
    id: string;
    created_at: string;
    participant_id: string;
    training_id: string;
    task_completion_score: number;
    on_time_score: number;
    final_grade: number;
    description: string;
}


export interface LeaderboardEntry {
  participantId: string;
  participantName: string;
  taskCompletionScore: number;
  onTimeScore: number;
  finalGrade: number;
  description: string;
  createdAt: string;
}

export interface DetailedTask {
  id: string;
  created_at: string;
  day_number: number;
  backlog: string;
  user_story: string;
  role: ParticipantRole;
  target_points: number;
  status: 'Tepat Waktu' | 'Terlambat' | 'Belum Selesai';
  completionDate?: string | null;
}
