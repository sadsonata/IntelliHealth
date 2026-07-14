const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/v1`;

// Transform backend exercise types to user-friendly labels
const transformExerciseTypes = (types: string[]): ExerciseType[] => {
  const typeLabels: Record<string, string> = {
    'AEROBIC': 'Aerobic',
    'STRENGTH': 'Strength Training', 
    'FLEXIBILITY': 'Flexibility',
    'BALANCE': 'Balance'
  };
  
  return types.map(type => ({
    value: type as 'AEROBIC' | 'STRENGTH' | 'FLEXIBILITY' | 'BALANCE',
    label: typeLabels[type] || type
  }));
};

export interface WorkoutPlanCreateRequest {
  exerciseType: string;
  exerciseId: number;
  workoutDate: string;
  startTime: string;
  endTime: string;
  comments?: string;
  workoutPhotoUrl?: string;
  title?: string;
  description?: string;
}

export interface ExerciseType {
  value: 'AEROBIC' | 'STRENGTH' | 'FLEXIBILITY' | 'BALANCE';
  label: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface WorkoutPlan {
  id: number;
  title: string;
  description?: string;
  exerciseType: string;
  exercise: Exercise;
  workoutDate: string;
  startTime: string;
  endTime: string;
  comments?: string;
  workoutPhotoUrl?: string;
  activeStatus: string;
  createdAt: string;
  updatedAt: string;
}

class WorkoutService {
  private baseUrl: string;

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

  async getExerciseTypes(): Promise<ExerciseType[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workouts/exercise-types`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch exercise types');
      }
      const types: string[] = await response.json();
      return transformExerciseTypes(types);
    } catch (error) {
      console.warn('Backend exercise types fetch failed, using mock data');
      // Fallback to mock exercise types
      return transformExerciseTypes(['AEROBIC', 'STRENGTH', 'FLEXIBILITY', 'BALANCE']);
    }
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    if (!category) {
      return [];
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/workouts/exercises/by-category?category=${category}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch exercises for category: ${category}`);
      }
      return response.json();
    } catch (error) {
      console.warn(`Backend exercises fetch failed for category ${category}, using mock data`);
      // Fallback to mock exercises - use ExerciseService for consistency
      const ExerciseService = (await import('./exerciseService')).default;
      return ExerciseService.getExercisesByCategory(category.toLowerCase() as any);
    }
  }

  async createWorkoutPlan(workoutData: WorkoutPlanCreateRequest): Promise<WorkoutPlan> {
    // Transform data for backend - add seconds to time for LocalTime parsing
    const backendData = {
      ...workoutData,
      startTime: workoutData.startTime ? `${workoutData.startTime}:00` : workoutData.startTime,
      endTime: workoutData.endTime ? `${workoutData.endTime}:00` : workoutData.endTime,
    };
    
    const response = await fetch(`${this.baseUrl}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(backendData)
    });

    if (!response.ok) {
      throw new Error('Failed to create workout plan');
    }
    return response.json();
  }

  async getTodayWorkoutPlans(): Promise<WorkoutPlan[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workouts/today`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch today\'s workout plans');
      }
      return response.json();
    } catch (error) {
      console.warn('Backend today workouts fetch failed, using empty array');
      // Fallback to empty array for today's workouts
      return [];
    }
  }

  async getAllWorkoutPlans(): Promise<WorkoutPlan[]> {
    const response = await fetch(`${this.baseUrl}/workouts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workout plans');
    }
    return response.json();
  }

  async getUserWorkoutPlans(): Promise<WorkoutPlan[]> {
    const response = await fetch(`${this.baseUrl}/workouts`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user workout plans');
    }
    return response.json();
  }

  async updateWorkoutPlan(id: number | string, workoutData: Partial<WorkoutPlanCreateRequest>): Promise<WorkoutPlan> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    // Transform to backend format
    const backendData: any = {
      ...workoutData,
    };
    
    if (workoutData.exerciseId) {
      backendData.exerciseId = workoutData.exerciseId;
    }
    if (workoutData.workoutDate) {
      backendData.workoutDate = workoutData.workoutDate;
    }
    if (workoutData.startTime) {
      backendData.startTime = workoutData.startTime + ':00';
    }
    if (workoutData.endTime) {
      backendData.endTime = workoutData.endTime + ':00';
    }

    const response = await fetch(`${this.baseUrl}/workouts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(backendData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update workout plan: ${errorText}`);
    }
    return response.json();
  }

  async completeWorkoutPlan(id: number | string): Promise<WorkoutPlan> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await fetch(`${this.baseUrl}/workouts/${id}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to complete workout plan');
    }
    return response.json();
  }

  async autoCompleteExpiredWorkouts(): Promise<number> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await fetch(`${this.baseUrl}/workouts/auto-complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to auto-complete workouts');
    }
    return response.json();
  }

  async deleteWorkoutPlan(id: number | string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await fetch(`${this.baseUrl}/workouts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete workout plan');
    }
  }
}

export default new WorkoutService();
