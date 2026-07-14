import type { Exercise, ExerciseCategory } from '../types';

export const mockExercises: Exercise[] = [
  // Aerobic Exercises
  {
    id: '1',
    name: 'Running',
    category: 'aerobic' as ExerciseCategory,
    description: 'Cardiovascular exercise that improves endurance and burns calories',
    instructions: [
      'Start with a 5-minute warm-up walk',
      'Gradually increase your pace to a comfortable jog',
      'Maintain steady breathing throughout',
      'Cool down with 5 minutes of walking'
    ],
    muscleGroups: ['legs', 'core', 'cardio'],
    equipment: ['running shoes'],
    difficulty: 'beginner',
    imageUrl: 'https://via.placeholder.com/300x200/22c55e/ffffff?text=Running'
  },
  {
    id: '2',
    name: 'Cycling',
    category: 'aerobic' as ExerciseCategory,
    description: 'Low-impact cardio exercise that strengthens legs and improves cardiovascular health',
    instructions: [
      'Adjust bike seat to hip height',
      'Start with light resistance for warm-up',
      'Maintain steady cadence of 80-100 RPM',
      'Increase resistance for intervals if desired'
    ],
    muscleGroups: ['legs', 'glutes', 'cardio'],
    equipment: ['stationary bike', 'helmet'],
    difficulty: 'beginner',
    imageUrl: 'https://via.placeholder.com/300x200/22c55e/ffffff?text=Cycling'
  },
  {
    id: '3',
    name: 'Jump Rope',
    category: 'aerobic' as ExerciseCategory,
    description: 'High-intensity cardio exercise that improves coordination and agility',
    instructions: [
      'Hold handles with grip facing forward',
      'Jump 1-2 inches off the ground',
      'Land softly on balls of feet',
      'Keep elbows close to body'
    ],
    muscleGroups: ['legs', 'core', 'cardio', 'shoulders'],
    equipment: ['jump rope'],
    difficulty: 'intermediate',
    imageUrl: 'https://via.placeholder.com/300x200/22c55e/ffffff?text=Jump+Rope'
  },

  // Strength Exercises
  {
    id: '4',
    name: 'Push-ups',
    category: 'strength' as ExerciseCategory,
    description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower body until chest nearly touches ground',
      'Push back up to starting position',
      'Keep core engaged throughout movement'
    ],
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
    equipment: [],
    difficulty: 'beginner',
    imageUrl: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Push-ups'
  },
  {
    id: '5',
    name: 'Squats',
    category: 'strength' as ExerciseCategory,
    description: 'Fundamental lower body exercise targeting quads, glutes, and hamstrings',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower hips back and down as if sitting in chair',
      'Keep chest up and knees behind toes',
      'Return to starting position'
    ],
    muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
    equipment: [],
    difficulty: 'beginner',
    imageUrl: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Squats'
  },
  {
    id: '6',
    name: 'Deadlifts',
    category: 'strength' as ExerciseCategory,
    description: 'Compound exercise targeting posterior chain and overall strength',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Hinge at hips, grip bar with hands outside knees',
      'Drive through heels to lift bar to standing position',
      'Lower bar with controlled movement'
    ],
    muscleGroups: ['back', 'glutes', 'hamstrings', 'core'],
    equipment: ['barbell', 'weight plates'],
    difficulty: 'advanced',
    imageUrl: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Deadlifts'
  },
  {
    id: '7',
    name: 'Bench Press',
    category: 'strength' as ExerciseCategory,
    description: 'Upper body strength exercise focusing on chest development',
    instructions: [
      'Lie on bench with feet flat on floor',
      'Grip bar slightly wider than shoulder-width',
      'Lower bar to chest with controlled movement',
      'Press bar back up to starting position'
    ],
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['barbell', 'bench', 'weight plates'],
    difficulty: 'intermediate',
    imageUrl: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Bench+Press'
  },

  // Flexibility Exercises
  {
    id: '8',
    name: 'Hamstring Stretch',
    category: 'flexibility' as ExerciseCategory,
    description: 'Improves flexibility in the back of the legs',
    instructions: [
      'Sit on floor with one leg extended',
      'Bend other leg with foot against inner thigh',
      'Lean forward over extended leg',
      'Hold for 30 seconds, switch sides'
    ],
    muscleGroups: ['hamstrings', 'lower back'],
    equipment: ['mat'],
    difficulty: 'beginner',
    imageUrl: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Hamstring+Stretch'
  },
  {
    id: '9',
    name: 'Yoga Downward Dog',
    category: 'flexibility' as ExerciseCategory,
    description: 'Full body stretch that improves flexibility and strength',
    instructions: [
      'Start on hands and knees',
      'Lift hips up and back forming inverted V',
      'Press heels toward floor',
      'Hold for 30-60 seconds'
    ],
    muscleGroups: ['full body', 'shoulders', 'hamstrings', 'calves'],
    equipment: ['mat'],
    difficulty: 'beginner',
    imageUrl: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Downward+Dog'
  },
  {
    id: '10',
    name: 'Hip Flexor Stretch',
    category: 'flexibility' as ExerciseCategory,
    description: 'Stretches hip flexors and improves posture',
    instructions: [
      'Kneel on one knee with other foot forward',
      'Keep back straight and engage core',
      'Lean forward slightly to feel stretch',
      'Hold for 30 seconds, switch sides'
    ],
    muscleGroups: ['hip flexors', 'quads'],
    equipment: ['mat'],
    difficulty: 'beginner',
    imageUrl: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Hip+Flexor+Stretch'
  },

  // Balance Exercises
  {
    id: '11',
    name: 'Single Leg Stand',
    category: 'balance' as ExerciseCategory,
    description: 'Improves balance and stability',
    instructions: [
      'Stand on one leg with knee slightly bent',
      'Keep other leg lifted but not touching',
      'Focus on a fixed point ahead',
      'Hold for 30 seconds, switch sides'
    ],
    muscleGroups: ['core', 'legs', 'ankles'],
    equipment: [],
    difficulty: 'beginner',
    imageUrl: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Single+Leg+Stand'
  },
  {
    id: '12',
    name: 'Tree Pose',
    category: 'balance' as ExerciseCategory,
    description: 'Yoga pose that improves balance and concentration',
    instructions: [
      'Stand with feet together',
      'Place one foot on inner thigh of opposite leg',
      'Bring hands to prayer position',
      'Hold for 30 seconds, switch sides'
    ],
    muscleGroups: ['core', 'legs', 'ankles'],
    equipment: ['mat'],
    difficulty: 'intermediate',
    imageUrl: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Tree+Pose'
  },
  {
    id: '13',
    name: 'Heel-to-Toe Walk',
    category: 'balance' as ExerciseCategory,
    description: 'Dynamic balance exercise improving coordination',
    instructions: [
      'Walk in straight line placing heel directly in front of toes',
      'Focus on a point ahead for balance',
      'Take 20 steps forward',
      'Turn around and repeat'
    ],
    muscleGroups: ['core', 'legs', 'ankles'],
    equipment: [],
    difficulty: 'beginner',
    imageUrl: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Heel-to-Toe+Walk'
  }
];

export const exercisesByCategory = {
  aerobic: mockExercises.filter(ex => ex.category === 'aerobic'),
  strength: mockExercises.filter(ex => ex.category === 'strength'),
  flexibility: mockExercises.filter(ex => ex.category === 'flexibility'),
  balance: mockExercises.filter(ex => ex.category === 'balance'),
};
