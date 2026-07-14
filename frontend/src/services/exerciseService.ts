const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/v1`;

export interface BackendExercise {
  id: string;
  name: string;
  description: string;
  category: 'AEROBIC' | 'STRENGTH' | 'FLEXIBILITY' | 'BALANCE';
  muscleGroup: 'CHEST' | 'BACK' | 'SHOULDERS' | 'BICEPS' | 'TRICEPS' | 'LEGS' | 'CORE' | 'FULL_BODY' | 'OTHER';
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'aerobic' | 'strength' | 'flexibility' | 'balance';
  description: string;
  instructions: string[];
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
}

// Map backend categories to frontend categories
const mapCategory = (backendCategory: BackendExercise['category']): Exercise['category'] => {
  const categoryMap: Record<BackendExercise['category'], Exercise['category']> = {
    'AEROBIC': 'aerobic',
    'STRENGTH': 'strength',
    'FLEXIBILITY': 'flexibility',
    'BALANCE': 'balance'
  };
  return categoryMap[backendCategory] || 'aerobic';
};

// Map backend muscle groups to frontend muscle groups
const mapMuscleGroup = (backendMuscleGroup: BackendExercise['muscleGroup']): string[] => {
  const muscleMap: Record<BackendExercise['muscleGroup'], string[]> = {
    'CHEST': ['chest'],
    'BACK': ['back'],
    'SHOULDERS': ['shoulders'],
    'BICEPS': ['biceps'],
    'TRICEPS': ['triceps'],
    'LEGS': ['legs', 'quads', 'hamstrings', 'glutes'],
    'CORE': ['core', 'abs'],
    'FULL_BODY': ['full body'],
    'OTHER': ['other']
  };
  return muscleMap[backendMuscleGroup];
};

// Generate basic instructions based on exercise name and category
const generateInstructions = (name: string, category: Exercise['category']): string[] => {
  const instructionMap: Record<Exercise['category'], Record<string, string[]>> = {
    'aerobic': {
      'default': ['Start with proper warm-up', 'Maintain steady pace', 'Focus on breathing', 'Cool down properly']
    },
    'strength': {
      'default': ['Start with light weight to warm up', 'Maintain proper form', 'Control the movement', 'Breathe out on exertion']
    },
    'flexibility': {
      'default': ['Hold each stretch gently', 'Don\'t bounce', 'Breathe deeply', 'Hold for 20-30 seconds']
    },
    'balance': {
      'default': ['Start with support if needed', 'Focus on a fixed point', 'Engage your core', 'Practice regularly']
    }
  };
  
  return instructionMap[category]?.[name] || instructionMap[category]?.default || ['Follow proper technique', 'Listen to your body'];
};

// Generate equipment based on exercise name and category
const generateEquipment = (name: string, category: Exercise['category']): string[] => {
  const equipmentMap: Record<string, string[]> = {
    'Running': ['running shoes'],
    'Cycling': ['bicycle', 'helmet'],
    'Swimming': ['swimsuit', 'goggles'],
    'Jumping Rope': ['jump rope'],
    'Rowing': ['rowing machine'],
    'Stair Climbing': ['stairs', 'stair machine'],
    'Elliptical Training': ['elliptical machine'],
    'High Knees': [],
    'Burpees': [],
    'Push-ups': [],
    'Squats': [],
    'Deadlifts': ['barbell', 'weight plates'],
    'Bench Press': ['barbell', 'bench', 'weight plates'],
    'Pull-ups': ['pull-up bar'],
    'Lunges': [],
    'Overhead Press': ['barbell', 'dumbbells'],
    'Bicep Curls': ['dumbbells', 'barbell'],
    'Tricep Dips': ['bench', 'parallel bars'],
    'Plank': [],
    'Single Leg Stand': [],
    'Tree Pose': ['yoga mat'],
    'Heel-to-Toe Walk': [],
    'Flamingo Stand': [],
    'Side Leg Lift': [],
    'Warrior III Pose': ['yoga mat'],
    'Single Leg Deadlift': ['dumbbells'],
    'Bosu Ball Squats': ['bosu ball'],
    'Balance Board': ['balance board'],
    'Tai Chi Stance': []
  };
  
  return equipmentMap[name] || (category === 'strength' ? ['weights'] : category === 'flexibility' ? ['mat'] : []);
};

// Determine difficulty based on exercise name and category
const determineDifficulty = (name: string): Exercise['difficulty'] => {
  const advancedExercises = ['Deadlifts', 'Burpees', 'Warrior III Pose', 'Single Leg Deadlift', 'Handstand Push-ups'];
  const intermediateExercises = ['Pull-ups', 'Bench Press', 'Overhead Press', 'Tree Pose', 'Flamingo Stand'];
  
  if (advancedExercises.includes(name)) return 'advanced';
  if (intermediateExercises.includes(name)) return 'intermediate';
  return 'beginner';
};

// Transform backend exercise to frontend exercise
const transformExercise = (backendExercise: BackendExercise): Exercise => {
  const category = mapCategory(backendExercise.category);
  const muscleGroups = mapMuscleGroup(backendExercise.muscleGroup);
  
  return {
    id: backendExercise.id.toString(),
    name: backendExercise.name,
    category,
    description: backendExercise.description,
    instructions: generateInstructions(backendExercise.name, category),
    muscleGroups,
    equipment: generateEquipment(backendExercise.name, category),
    difficulty: determineDifficulty(backendExercise.name),
    imageUrl: `https://via.placeholder.com/300x200/64748b/ffffff?text=${encodeURIComponent(backendExercise.name)}`
  };
};

class ExerciseService {
  private baseUrl: string;
  private backendTested = false;
  private backendAvailable = false;
  private testingBackend = false;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getAllExercises(): Promise<Exercise[]> {
    // For now, use mock data directly to avoid backend 500 errors
    // TODO: Re-enable backend testing once backend issues are resolved
    console.warn('Using mock data - backend has 500 errors');
    return this.getMockExercises();
    
    // Original backend testing code (commented out until backend is fixed):
    /*
    // Only test backend once per session
    if (!this.backendTested && !this.testingBackend) {
      this.testingBackend = true;
      try {
        const testResponse = await fetch(`${this.baseUrl}/workouts/exercise-types`, {
          headers: this.getAuthHeaders()
        });
        
        this.backendTested = true;
        this.backendAvailable = testResponse.ok;
        
        if (!this.backendAvailable) {
          throw new Error('Backend not accessible');
        }
        
        // If backend is working, try to get exercises from all categories
        const categories: Exercise['category'][] = ['aerobic', 'strength', 'flexibility', 'balance'];
        const exercisePromises = categories.map(category => this.getExercisesByCategory(category));
        const exerciseArrays = await Promise.all(exercisePromises);
        return exerciseArrays.flat();
      } catch (error) {
        console.warn('Backend not accessible, using mock data');
        this.backendTested = true;
        this.backendAvailable = false;
        // Direct fallback to mock data to avoid multiple failed requests
        return this.getMockExercises();
      } finally {
        this.testingBackend = false;
      }
    }
    
    // If we're currently testing, wait and return mock data to avoid delays
    if (this.testingBackend) {
      return this.getMockExercises();
    }
    
    // If backend was tested and is available, use it
    if (this.backendAvailable) {
      const categories: Exercise['category'][] = ['aerobic', 'strength', 'flexibility', 'balance'];
      const exercisePromises = categories.map(category => this.getExercisesByCategory(category));
      const exerciseArrays = await Promise.all(exercisePromises);
      return exerciseArrays.flat();
    }
    
    // If backend was tested and is not available, use mock data
    return this.getMockExercises();
    */
  }

  async getExercisesByCategory(category: Exercise['category']): Promise<Exercise[]> {
    // Map frontend category to backend category
    const backendCategoryMap: Record<Exercise['category'], string> = {
      'aerobic': 'AEROBIC',
      'strength': 'STRENGTH',
      'flexibility': 'FLEXIBILITY',
      'balance': 'BALANCE'
    };
    
    try {
      // Use workout controller endpoint which should be working
      const response = await fetch(`${this.baseUrl}/workouts/exercises/by-category?category=${backendCategoryMap[category]}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch exercises for category: ${category}`);
      }
      
      // The workout controller returns ExerciseDTO, which has a different structure
      const exerciseDTOs = await response.json();
      
      // Transform ExerciseDTO to our Exercise interface
      return exerciseDTOs.map((dto: any) => ({
        id: dto.id,
        name: dto.name,
        description: dto.description,
        category: mapCategory(dto.category as BackendExercise['category']),
        instructions: generateInstructions(dto.name, mapCategory(dto.category as BackendExercise['category'])),
        muscleGroups: ['full body'], // Default since DTO doesn't include muscle groups
        equipment: generateEquipment(dto.name, mapCategory(dto.category as BackendExercise['category'])),
        difficulty: determineDifficulty(dto.name),
        imageUrl: `https://via.placeholder.com/300x200/64748b/ffffff?text=${encodeURIComponent(dto.name)}`
      }));
    } catch (error) {
      try {
        // Fallback to direct exercise endpoint
        const response = await fetch(`${this.baseUrl}/exercises/category/${backendCategoryMap[category]}`, {
          headers: this.getAuthHeaders()
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch exercises for category: ${category}`);
        }
        const backendExercises: BackendExercise[] = await response.json();
        return backendExercises.map(transformExercise);
      } catch (directError) {
        // Final fallback to mock data filtered by category
        return this.getMockExercises().filter(exercise => exercise.category === category);
      }
    }
  }

  async getExerciseById(id: string): Promise<Exercise> {
    const response = await fetch(`${this.baseUrl}/exercises/${id}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch exercise with id: ${id}`);
    }
    const backendExercise: BackendExercise = await response.json();
    return transformExercise(backendExercise);
  }

  async searchExercisesByName(name: string): Promise<Exercise[]> {
    const response = await fetch(`${this.baseUrl}/exercises/search?name=${encodeURIComponent(name)}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to search exercises: ${name}`);
    }
    const backendExercises: BackendExercise[] = await response.json();
    return backendExercises.map(transformExercise);
  }

  // Mock data method as final fallback
  private getMockExercises(): Exercise[] {
    return [
      // Aerobic Exercises
      {
        id: '1',
        name: 'Running',
        category: 'aerobic',
        description: 'Cardiovascular exercise that improves endurance and burns calories',
        instructions: ['Start with a 5-minute warm-up walk', 'Gradually increase your pace', 'Maintain steady breathing', 'Cool down properly'],
        muscleGroups: ['legs', 'core', 'cardio'],
        equipment: ['running shoes'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '2',
        name: 'Cycling',
        category: 'aerobic',
        description: 'Low-impact cardio exercise that strengthens legs and improves cardiovascular health',
        instructions: ['Adjust bike seat to hip height', 'Start with light resistance', 'Maintain steady cadence', 'Increase resistance for intervals'],
        muscleGroups: ['legs', 'glutes', 'cardio'],
        equipment: ['bicycle', 'helmet'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '3',
        name: 'Swimming',
        category: 'aerobic',
        description: 'Full-body, low-impact cardio exercise that builds endurance and muscle strength',
        instructions: ['Start with comfortable pace', 'Focus on breathing technique', 'Use proper form', 'Gradually increase duration'],
        muscleGroups: ['full body', 'core', 'cardio'],
        equipment: ['swimsuit', 'goggles'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '4',
        name: 'Jump Rope',
        category: 'aerobic',
        description: 'High-intensity cardio exercise that improves coordination and agility',
        instructions: ['Hold handles properly', 'Jump 1-2 inches off ground', 'Land softly on balls of feet', 'Keep elbows close to body'],
        muscleGroups: ['legs', 'core', 'cardio', 'shoulders'],
        equipment: ['jump rope'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '5',
        name: 'Burpees',
        category: 'aerobic',
        description: 'Full-body exercise that combines strength and cardio for maximum calorie burn',
        instructions: ['Start in standing position', 'Drop to squat position', 'Kick feet back to plank', 'Jump feet back to squat, then jump up'],
        muscleGroups: ['full body', 'core', 'cardio'],
        equipment: [],
        difficulty: 'advanced',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '6',
        name: 'High Knees',
        category: 'aerobic',
        description: 'High-intensity cardio exercise that improves speed and coordination',
        instructions: ['Run in place', 'Bring knees up to hip level', 'Keep arms pumping', 'Maintain quick pace'],
        muscleGroups: ['legs', 'core', 'cardio'],
        equipment: [],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '7',
        name: 'Stair Climbing',
        category: 'aerobic',
        description: 'Excellent cardio exercise that strengthens legs and glutes',
        instructions: ['Use stairs or stair machine', 'Maintain upright posture', 'Use handrails for balance', 'Increase pace gradually'],
        muscleGroups: ['legs', 'glutes', 'cardio'],
        equipment: ['stairs', 'stair machine'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '8',
        name: 'Rowing',
        category: 'aerobic',
        description: 'Full-body cardio exercise that builds strength and endurance simultaneously',
        instructions: ['Sit with proper posture', 'Drive with legs first', 'Pull handle to chest', 'Return to starting position'],
        muscleGroups: ['full body', 'back', 'legs', 'core'],
        equipment: ['rowing machine'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '9',
        name: 'Elliptical Training',
        category: 'aerobic',
        description: 'Low-impact full-body cardio exercise that mimics running without joint stress',
        instructions: ['Step onto machine', 'Grab handles', 'Start with forward motion', 'Increase resistance gradually'],
        muscleGroups: ['full body', 'legs', 'arms', 'cardio'],
        equipment: ['elliptical machine'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '10',
        name: 'Brisk Walking',
        category: 'aerobic',
        description: 'Low-impact cardio exercise suitable for all fitness levels',
        instructions: ['Walk at fast pace', 'Swing arms naturally', 'Maintain good posture', 'Breathe deeply'],
        muscleGroups: ['legs', 'core'],
        equipment: ['walking shoes'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&auto=format'
      },

      // Strength Exercises
      {
        id: '11',
        name: 'Push-ups',
        category: 'strength',
        description: 'Classic bodyweight exercise that targets chest, shoulders, and triceps',
        instructions: ['Start in plank position', 'Lower body until chest nears ground', 'Push back up to starting position', 'Keep core engaged'],
        muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '12',
        name: 'Squats',
        category: 'strength',
        description: 'Fundamental lower body exercise that strengthens quads, glutes, and hamstrings',
        instructions: ['Stand with feet shoulder-width apart', 'Lower hips back and down', 'Keep chest up and knees behind toes', 'Return to starting position'],
        muscleGroups: ['legs', 'quads', 'glutes', 'hamstrings', 'core'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '13',
        name: 'Deadlifts',
        category: 'strength',
        description: 'Compound exercise that works multiple muscle groups including back, legs, and core',
        instructions: ['Stand with feet hip-width apart', 'Bend at hips and knees', 'Grip bar with hands outside knees', 'Drive through heels to lift'],
        muscleGroups: ['back', 'glutes', 'hamstrings', 'core'],
        equipment: ['barbell', 'weight plates'],
        difficulty: 'advanced',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '14',
        name: 'Bench Press',
        category: 'strength',
        description: 'Upper body exercise that primarily targets chest muscles',
        instructions: ['Lie on bench with feet flat', 'Grip bar slightly wider than shoulders', 'Lower bar to chest', 'Press bar back up'],
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        equipment: ['barbell', 'bench', 'weight plates'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '15',
        name: 'Pull-ups',
        category: 'strength',
        description: 'Upper body exercise that targets back and biceps',
        instructions: ['Grip pull-up bar with hands shoulder-width apart', 'Pull body up until chin clears bar', 'Lower body with control', 'Repeat for desired reps'],
        muscleGroups: ['back', 'biceps', 'shoulders'],
        equipment: ['pull-up bar'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '16',
        name: 'Lunges',
        category: 'strength',
        description: 'Unilateral leg exercise that improves balance and strengthens lower body',
        instructions: ['Step forward with one leg', 'Lower hips until both knees at 90 degrees', 'Push back to starting position', 'Alternate legs'],
        muscleGroups: ['legs', 'quads', 'glutes', 'hamstrings'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '17',
        name: 'Overhead Press',
        category: 'strength',
        description: 'Shoulder exercise that builds upper body strength',
        instructions: ['Stand with feet shoulder-width apart', 'Hold weights at shoulder height', 'Press weights overhead', 'Lower with control'],
        muscleGroups: ['shoulders', 'triceps', 'core'],
        equipment: ['barbell', 'dumbbells'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '18',
        name: 'Bicep Curls',
        category: 'strength',
        description: 'Isolation exercise that targets bicep muscles',
        instructions: ['Stand with feet shoulder-width apart', 'Hold weights with palms facing forward', 'Curl weights up to shoulders', 'Lower with control'],
        muscleGroups: ['biceps', 'forearms'],
        equipment: ['dumbbells', 'barbell'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '19',
        name: 'Tricep Dips',
        category: 'strength',
        description: 'Bodyweight exercise that targets tricep muscles',
        instructions: ['Sit on edge of bench', 'Place hands on edge next to hips', 'Lower body by bending elbows', 'Push back up to starting position'],
        muscleGroups: ['triceps', 'shoulders', 'chest'],
        equipment: ['bench', 'parallel bars'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '20',
        name: 'Plank',
        category: 'strength',
        description: 'Core exercise that builds stability and endurance',
        instructions: ['Start in push-up position', 'Lower onto forearms', 'Keep body in straight line', 'Hold for desired time'],
        muscleGroups: ['core', 'abs', 'shoulders'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1596445832369-1bc1c24c85c1?w=300&h=200&fit=crop&auto=format'
      },

      // Flexibility Exercises
      {
        id: '21',
        name: 'Forward Fold',
        category: 'flexibility',
        description: 'Stretches hamstrings, calves, and back while promoting relaxation',
        instructions: ['Stand with feet hip-width apart', 'Hinge at hips', 'Reach toward toes', 'Hold for 30 seconds'],
        muscleGroups: ['hamstrings', 'calves', 'back'],
        equipment: ['mat'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '22',
        name: 'Cat-Cow Stretch',
        category: 'flexibility',
        description: 'Gentle spinal movement that improves flexibility and reduces back tension',
        instructions: ['Start on hands and knees', 'Arch back (Cow)', 'Round spine (Cat)', 'Alternate between positions'],
        muscleGroups: ['back', 'spine', 'core'],
        equipment: ['mat'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '23',
        name: 'Butterfly Stretch',
        category: 'flexibility',
        description: 'Hip opener that stretches inner thighs and groin muscles',
        instructions: ['Sit with soles of feet together', 'Gently press knees down', 'Lean forward slightly', 'Hold for 30 seconds'],
        muscleGroups: ['inner thighs', 'groin', 'hips'],
        equipment: ['mat'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '24',
        name: 'Shoulder Rolls',
        category: 'flexibility',
        description: 'Simple exercise that releases shoulder tension and improves mobility',
        instructions: ['Stand or sit with good posture', 'Roll shoulders backward', 'Roll shoulders forward', 'Repeat 10 times each direction'],
        muscleGroups: ['shoulders', 'upper back'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '25',
        name: 'Quad Stretch',
        category: 'flexibility',
        description: 'Stretches the front of the thighs and improves hip flexibility',
        instructions: ['Stand on one leg', 'Pull other foot toward glute', 'Keep knees together', 'Hold for 30 seconds'],
        muscleGroups: ['quadriceps', 'hip flexors'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '26',
        name: 'Hamstring Stretch',
        category: 'flexibility',
        description: 'Improves flexibility in the back of the legs and lower back',
        instructions: ['Sit on floor with one leg extended', 'Bend other leg', 'Lean forward over extended leg', 'Hold for 30 seconds'],
        muscleGroups: ['hamstrings', 'lower back'],
        equipment: ['mat'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '27',
        name: 'Chest Stretch',
        category: 'flexibility',
        description: 'Opens up the chest and improves posture',
        instructions: ['Clasp hands behind back', 'Pull shoulders back and down', 'Lift chest', 'Hold for 30 seconds'],
        muscleGroups: ['chest', 'shoulders'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '28',
        name: 'Tricep Stretch',
        category: 'flexibility',
        description: 'Stretches the back of the arms and improves shoulder mobility',
        instructions: ['Raise one arm overhead', 'Bend elbow', 'Gently pull elbow with other hand', 'Hold for 30 seconds'],
        muscleGroups: ['triceps', 'shoulders'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '29',
        name: 'Child\'s Pose',
        category: 'flexibility',
        description: 'Restorative yoga pose that stretches back, hips, and shoulders',
        instructions: ['Kneel on floor', 'Sit back on heels', 'Fold forward', 'Extend arms forward', 'Hold for 30 seconds'],
        muscleGroups: ['back', 'hips', 'shoulders'],
        equipment: ['mat'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '30',
        name: 'Cobra Pose',
        category: 'flexibility',
        description: 'Backbend that strengthens spine and opens chest',
        instructions: ['Lie on stomach', 'Place hands under shoulders', 'Press up lifting chest', 'Keep hips on ground'],
        muscleGroups: ['back', 'chest', 'shoulders'],
        equipment: ['mat'],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },

      // Balance Exercises
      {
        id: '31',
        name: 'Single Leg Stand',
        category: 'balance',
        description: 'Basic balance exercise that improves stability and ankle strength',
        instructions: ['Stand on one leg', 'Keep knee slightly bent', 'Focus on fixed point', 'Hold for 30 seconds'],
        muscleGroups: ['core', 'legs', 'ankles'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '32',
        name: 'Tree Pose',
        category: 'balance',
        description: 'Yoga balance pose that improves focus and stability',
        instructions: ['Stand with feet together', 'Place foot on inner thigh', 'Bring hands to prayer position', 'Hold for 30 seconds'],
        muscleGroups: ['core', 'legs', 'ankles'],
        equipment: ['mat'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '33',
        name: 'Heel-to-Toe Walk',
        category: 'balance',
        description: 'Dynamic balance exercise that improves coordination',
        instructions: ['Walk in straight line', 'Place heel directly in front of toes', 'Focus on point ahead', 'Take 20 steps'],
        muscleGroups: ['core', 'legs', 'ankles'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '34',
        name: 'Flamingo Stand',
        category: 'balance',
        description: 'Advanced single-leg balance exercise',
        instructions: ['Stand on one leg', 'Lift other leg high', 'Hold arms out for balance', 'Hold for 30 seconds'],
        muscleGroups: ['core', 'legs', 'ankles'],
        equipment: [],
        difficulty: 'advanced',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '35',
        name: 'Side Leg Lift',
        category: 'balance',
        description: 'Balance exercise that strengthens hip abductors',
        instructions: ['Stand on one leg', 'Lift other leg to side', 'Keep upper body still', 'Lower with control'],
        muscleGroups: ['legs', 'hips', 'core'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '36',
        name: 'Warrior III Pose',
        category: 'balance',
        description: 'Challenging yoga balance pose that strengthens entire body',
        instructions: ['Stand on one leg', 'Hinge forward at hips', 'Lift other leg back', 'Extend arms forward'],
        muscleGroups: ['full body', 'core', 'legs'],
        equipment: ['mat'],
        difficulty: 'advanced',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '37',
        name: 'Single Leg Deadlift',
        category: 'balance',
        description: 'Balance exercise that strengthens hamstrings and glutes',
        instructions: ['Stand on one leg', 'Hinge at hips', 'Lower torso toward ground', 'Return to standing'],
        muscleGroups: ['legs', 'hamstrings', 'glutes', 'core'],
        equipment: ['dumbbells'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '38',
        name: 'Bosu Ball Squats',
        category: 'balance',
        description: 'Unstable surface training that improves balance and stability',
        instructions: ['Stand on bosu ball', 'Perform squat movement', 'Keep core engaged', 'Use slow, controlled movements'],
        muscleGroups: ['legs', 'core', 'ankles'],
        equipment: ['bosu ball'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '39',
        name: 'Balance Board',
        category: 'balance',
        description: 'Proprioception training that improves overall balance',
        instructions: ['Stand on balance board', 'Maintain center of balance', 'Keep knees slightly bent', 'Hold for 30 seconds'],
        muscleGroups: ['core', 'legs', 'ankles'],
        equipment: ['balance board'],
        difficulty: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      },
      {
        id: '40',
        name: 'Tai Chi Stance',
        category: 'balance',
        description: 'Martial arts-inspired balance exercise that improves focus and stability',
        instructions: ['Stand with feet wide', 'Bend knees slightly', 'Shift weight slowly', 'Maintain relaxed posture'],
        muscleGroups: ['core', 'legs'],
        equipment: [],
        difficulty: 'beginner',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop&auto=format'
      }
    ];
  }
}

export default new ExerciseService();
