import type { User, Goal, ExerciseStats, TransformationPhoto } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  avatar: 'https://via.placeholder.com/100x100/22c55e/ffffff?text=JD',
  createdAt: new Date('2024-01-01T00:00:00')
};

export const mockGoals: Goal[] = [
  {
    id: '1',
    userId: '1',
    title: 'Lose 10 pounds',
    description: 'Reach target weight of 170 lbs through consistent exercise and healthy eating',
    targetValue: 170,
    currentValue: 180,
    unit: 'lbs',
    category: 'weight_loss',
    targetDate: new Date('2024-03-01T00:00:00'),
    createdAt: new Date('2024-01-01T00:00:00'),
    status: 'active'
  },
  {
    id: '2',
    userId: '1',
    title: 'Run 5K under 25 minutes',
    description: 'Improve running endurance and speed',
    targetValue: 25,
    currentValue: 28,
    unit: 'minutes',
    category: 'endurance',
    targetDate: new Date('2024-02-15T00:00:00'),
    createdAt: new Date('2024-01-01T00:00:00'),
    status: 'active'
  },
  {
    id: '3',
    userId: '1',
    title: 'Bench Press 150 lbs',
    description: 'Increase upper body strength',
    targetValue: 150,
    currentValue: 135,
    unit: 'lbs',
    category: 'strength',
    targetDate: new Date('2024-04-01T00:00:00'),
    createdAt: new Date('2024-01-01T00:00:00'),
    status: 'active'
  }
];

export const mockExerciseStats: ExerciseStats = {
  totalWorkouts: 24,
  totalExercises: 156,
  totalDuration: 1980, // 33 hours
  currentWeekWorkouts: 3,
  currentWeekExercises: 18,
  currentWeekDuration: 180, // 3 hours
  lastWeekWorkouts: 4,
  lastWeekExercises: 24,
  lastWeekDuration: 240, // 4 hours
  favoriteExercise: 'Push-ups',
  mostWorkedMuscleGroup: 'Chest'
};

export const mockTransformationPhotos: TransformationPhoto[] = [
  {
    id: '1',
    userId: '1',
    workoutLogId: '1',
    url: 'https://via.placeholder.com/400x300/22c55e/ffffff?text=Day+1',
    caption: 'Starting my fitness journey! Feeling motivated and ready to make a change.',
    takenAt: new Date('2024-01-01T00:00:00'),
    weight: 180,
    bodyFat: 22,
    measurements: {
      chest: 42,
      waist: 38,
      arms: 14,
      thighs: 22
    }
  },
  {
    id: '2',
    userId: '1',
    workoutLogId: '2',
    url: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Week+2',
    caption: 'Two weeks in! Already feeling stronger and more energetic. Upper body workout today was great!',
    takenAt: new Date('2024-01-15T00:00:00'),
    weight: 178,
    bodyFat: 21.5,
    measurements: {
      chest: 42.5,
      waist: 37.5,
      arms: 14.5,
      thighs: 22
    }
  },
  {
    id: '3',
    userId: '1',
    url: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Week+4',
    caption: 'One month progress! Down 5 pounds and feeling amazing. The consistency is paying off.',
    takenAt: new Date('2024-01-29T00:00:00'),
    weight: 175,
    bodyFat: 20,
    measurements: {
      chest: 43,
      waist: 36,
      arms: 15,
      thighs: 22.5
    }
  },
  {
    id: '4',
    userId: '1',
    url: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Week+6',
    caption: '6 week transformation! Running 5K in under 28 minutes now. Cardio has improved so much!',
    takenAt: new Date('2024-02-12T00:00:00'),
    weight: 173,
    bodyFat: 19,
    measurements: {
      chest: 43.5,
      waist: 35,
      arms: 15.5,
      thighs: 23
    }
  }
];
