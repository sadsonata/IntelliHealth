export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  description: string;
  instructions: string[];
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
}

export type ExerciseCategory = 'aerobic' | 'strength' | 'flexibility' | 'balance';

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  scheduledDate: Date;
  completedAt?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in minutes
  restTime: number; // in seconds
  completed: boolean;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  workoutPlanId: string;
  userId: string;
  exercises: CompletedExercise[];
  startedAt: Date;
  completedAt: Date;
  duration: number; // in minutes
  notes?: string;
  photoUrl?: string;
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedSet[];
  notes?: string;
}

export interface CompletedSet {
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility';
  targetDate: Date;
  createdAt: Date;
  status: 'active' | 'completed' | 'paused';
}

export interface ExerciseStats {
  totalWorkouts: number;
  totalExercises: number;
  totalDuration: number; // in minutes
  currentWeekWorkouts: number;
  currentWeekExercises: number;
  currentWeekDuration: number;
  lastWeekWorkouts: number;
  lastWeekExercises: number;
  lastWeekDuration: number;
  favoriteExercise: string;
  mostWorkedMuscleGroup: string;
}

export interface TransformationPhoto {
  id: string;
  userId: string;
  workoutLogId?: string;
  url: string;
  caption?: string;
  takenAt: Date;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    arms?: number;
    thighs?: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  username: string;
  confirmPassword: string;
}
