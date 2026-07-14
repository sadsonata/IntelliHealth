import type { WorkoutPlan, WorkoutLog } from '../types';
import { mockExercises } from './exercises';

export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    userId: '1',
    name: 'Upper Body Strength',
    description: 'Focus on building upper body strength with compound movements',
    scheduledDate: new Date('2024-01-15T09:00:00'),
    status: 'completed',
    completedAt: new Date('2024-01-15T10:30:00'),
    exercises: [
      {
        exercise: mockExercises[3], // Push-ups
        sets: 3,
        reps: 12,
        restTime: 60,
        completed: true,
        notes: 'Good form, felt strong'
      },
      {
        exercise: mockExercises[6], // Bench Press
        sets: 3,
        reps: 8,
        weight: 135,
        restTime: 90,
        completed: true,
        notes: 'Increased weight from last week'
      },
      {
        exercise: mockExercises[4], // Squats
        sets: 3,
        reps: 15,
        weight: 95,
        restTime: 90,
        completed: true
      }
    ]
  },
  {
    id: '2',
    userId: '1',
    name: 'Cardio & Core',
    description: 'High-intensity cardio workout with core strengthening',
    scheduledDate: new Date('2024-01-16T07:00:00'),
    status: 'completed',
    completedAt: new Date('2024-01-16T08:00:00'),
    exercises: [
      {
        exercise: mockExercises[0], // Running
        sets: 1,
        reps: 1,
        duration: 30,
        restTime: 0,
        completed: true,
        notes: '5K run, good pace'
      },
      {
        exercise: mockExercises[3], // Push-ups
        sets: 3,
        reps: 15,
        restTime: 45,
        completed: true
      },
      {
        exercise: mockExercises[2], // Jump Rope
        sets: 3,
        reps: 1,
        duration: 2,
        restTime: 60,
        completed: true,
        notes: 'Good coordination today'
      }
    ]
  },
  {
    id: '3',
    userId: '1',
    name: 'Lower Body Power',
    description: 'Build lower body strength and power',
    scheduledDate: new Date('2024-01-17T10:00:00'),
    status: 'scheduled',
    exercises: [
      {
        exercise: mockExercises[4], // Squats
        sets: 4,
        reps: 10,
        weight: 115,
        restTime: 120,
        completed: false
      },
      {
        exercise: mockExercises[5], // Deadlifts
        sets: 3,
        reps: 6,
        weight: 185,
        restTime: 180,
        completed: false
      }
    ]
  }
];

export const mockWorkoutLogs: WorkoutLog[] = [
  {
    id: '1',
    workoutPlanId: '1',
    userId: '1',
    exercises: [
      {
        exerciseId: '4',
        exerciseName: 'Push-ups',
        sets: [
          { reps: 12, restTime: 60 },
          { reps: 12, restTime: 60 },
          { reps: 10, restTime: 60 }
        ],
        notes: 'Good form, felt strong'
      },
      {
        exerciseId: '7',
        exerciseName: 'Bench Press',
        sets: [
          { reps: 8, weight: 135, restTime: 90 },
          { reps: 8, weight: 135, restTime: 90 },
          { reps: 6, weight: 135, restTime: 90 }
        ],
        notes: 'Increased weight from last week'
      },
      {
        exerciseId: '5',
        exerciseName: 'Squats',
        sets: [
          { reps: 15, weight: 95, restTime: 90 },
          { reps: 15, weight: 95, restTime: 90 },
          { reps: 12, weight: 95, restTime: 90 }
        ]
      }
    ],
    startedAt: new Date('2024-01-15T09:00:00'),
    completedAt: new Date('2024-01-15T10:30:00'),
    duration: 90,
    notes: 'Great upper body workout today!',
    photoUrl: 'https://via.placeholder.com/400x300/22c55e/ffffff?text=Workout+Photo+1'
  },
  {
    id: '2',
    workoutPlanId: '2',
    userId: '1',
    exercises: [
      {
        exerciseId: '1',
        exerciseName: 'Running',
        sets: [
          { reps: 1, duration: 30, restTime: 0 }
        ],
        notes: '5K run, good pace'
      },
      {
        exerciseId: '4',
        exerciseName: 'Push-ups',
        sets: [
          { reps: 15, restTime: 45 },
          { reps: 15, restTime: 45 },
          { reps: 12, restTime: 45 }
        ]
      },
      {
        exerciseId: '3',
        exerciseName: 'Jump Rope',
        sets: [
          { reps: 1, duration: 2, restTime: 60 },
          { reps: 1, duration: 2, restTime: 60 },
          { reps: 1, duration: 2, restTime: 60 }
        ],
        notes: 'Good coordination today'
      }
    ],
    startedAt: new Date('2024-01-16T07:00:00'),
    completedAt: new Date('2024-01-16T08:00:00'),
    duration: 60,
    notes: 'High intensity cardio session',
    photoUrl: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Workout+Photo+2'
  }
];
