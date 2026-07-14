import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { formatDate } from '../utils/dateUtils';
import {
  Clock,
  Plus,
  Camera,
  Activity,
  X,
  CalendarDays,
  Edit2,
  CheckCircle2
} from 'lucide-react';
import WorkoutService from '../services/workoutService';
import type { WorkoutPlanCreateRequest, Exercise, WorkoutPlan } from '../services/workoutService';

// Helper function to convert 24h time to 12h format
const formatTime12Hour = (time24: string): string => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

// Helper to convert backend time (HH:mm:ss) to input time (HH:mm)
const toInputTime = (time: string): string => {
  if (!time) return '';
  return time.substring(0, 5); // Take only HH:mm
};

// Helper to check if workout has ended based on local time
const hasWorkoutEnded = (workout: WorkoutPlan): boolean => {
  if (!workout.endTime || !workout.workoutDate) return false;
  const now = new Date();
  const [hours, minutes, seconds] = workout.endTime.split(':').map(Number);
  
  // Parse the workout date in local timezone by appending the time
  let workoutDateTime = new Date(workout.workoutDate + 'T' + 
    String(hours).padStart(2, '0') + ':' + 
    String(minutes).padStart(2, '0') + ':' + 
    String(seconds || 0).padStart(2, '0'));
  
  // Handle cross-day workouts (e.g., 11 PM - 12 AM)
  // If end time is earlier than start time, it means the workout ends next day
  if (workout.startTime) {
    const [startHours, startMinutes] = workout.startTime.split(':').map(Number);
    
    if (hours < startHours || (hours === startHours && minutes < startMinutes)) {
      // End time is next day
      workoutDateTime.setDate(workoutDateTime.getDate() + 1);
    }
  }
  
  return now >= workoutDateTime;
};

// Helper to check if workout hasn't started yet based on local time
const hasWorkoutStarted = (workout: WorkoutPlan): boolean => {
  if (!workout.startTime || !workout.workoutDate) return false;
  const now = new Date();
  const [hours, minutes, seconds] = workout.startTime.split(':').map(Number);
  
  // Parse the workout date in local timezone by appending the time
  let workoutDateTime = new Date(workout.workoutDate + 'T' + 
    String(hours).padStart(2, '0') + ':' + 
    String(minutes).padStart(2, '0') + ':' + 
    String(seconds || 0).padStart(2, '0'));
  
  // Handle cross-day workouts (e.g., 11 PM - 12 AM)
  // If end time is earlier than start time, it means the workout ends next day
  // But start time should always be on the workout date
  // No adjustment needed for start time
  
  return now >= workoutDateTime;
};

export const WorkoutPlanPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createWorkoutData, setCreateWorkoutData] = useState<WorkoutPlanCreateRequest>({
    exerciseType: '',
    exerciseId: 0,
    workoutDate: new Date().toISOString().split('T')[0], // yyyy-MM-dd format for date input
    startTime: '',
    endTime: '',
    comments: '',
    workoutPhotoUrl: ''
  });
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutPlan[]>([]);
  const [pastWorkouts, setPastWorkouts] = useState<WorkoutPlan[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<{ value: string; label: string }[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null);
  const [editWorkoutData, setEditWorkoutData] = useState<WorkoutPlanCreateRequest>({
    exerciseType: '',
    exerciseId: 0,
    workoutDate: '',
    startTime: '',
    endTime: '',
    comments: '',
    workoutPhotoUrl: ''
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingWorkout, setDeletingWorkout] = useState<WorkoutPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Removed hardcoded login; we should use the current logged-in user's token

        // Now load workout data with fresh token
        const [types, exercisesList, allWorkouts] = await Promise.all([
          WorkoutService.getExerciseTypes(),
          WorkoutService.getExercisesByCategory(''), // Get all exercises initially
          WorkoutService.getUserWorkoutPlans()
        ]);

        setExerciseTypes(types);
        setExercises(exercisesList);

        // Filter workouts based on current local time
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        // Calculate date 5 days ago for past workouts limit
        const fiveDaysAgo = new Date(today);
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const past: WorkoutPlan[] = [];
        const todayAndFuture: WorkoutPlan[] = [];

        allWorkouts.forEach(workout => {
          // Create date in local timezone
          let workoutEndDate = new Date(workout.workoutDate + 'T00:00:00'); // Start of day in local time

          if (workout.endTime) {
            const [hours, minutes, seconds] = workout.endTime.split(':').map(Number);
            workoutEndDate.setHours(hours, minutes || 0, seconds || 0, 0);

            // If end time is earlier than start time, it means the workout ends next day
            if (workout.startTime) {
              const [startHours, startMinutes] = workout.startTime.split(':').map(Number);
              const startDate = new Date(workout.workoutDate + 'T00:00:00');
              startDate.setHours(startHours, startMinutes || 0, 0, 0);

              if (hours < startHours) {
                // End time is next day
                workoutEndDate.setDate(workoutEndDate.getDate() + 1);
              }
            }
          }

          // Check if workout is from today or scheduled for today/future
          const workoutDate = new Date(workout.workoutDate + 'T00:00:00');
          const isTodayOrFuture = workoutDate >= today;

          // Categorize based on both workout date and completion status
          if (workout.activeStatus === 'COMPLETED') {
            // Completed workouts always go to past section
            past.push(workout);
          } else if (workoutDate < today && workoutDate >= fiveDaysAgo) {
            // Past workout within last 5 days (not completed)
            past.push(workout);
          } else if (isTodayOrFuture) {
            // Today or future workouts (not completed)
            todayAndFuture.push(workout);
          }
        });

        // Sort past workouts by date descending (most recent first) and limit to 5
        setPastWorkouts(past.sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime()).slice(0, 5));

        // Sort today's workouts by date/time (upcoming first, closest to current time)
        const sortedWorkouts = todayAndFuture.sort((a, b) => {
          const dateA = new Date(a.workoutDate);
          const dateB = new Date(b.workoutDate);
          if (a.endTime) {
            const [endHours, endMinutes] = a.endTime.split(':').map(Number);
            dateA.setHours(endHours, endMinutes || 0, 0, 0);
          }
          if (b.endTime) {
            const [endHours, endMinutes] = b.endTime.split(':').map(Number);
            dateB.setHours(endHours, endMinutes || 0, 0, 0);
          }
          return dateA.getTime() - dateB.getTime(); // Ascending order: sooner workouts first
        });
        setTodayWorkouts(sortedWorkouts);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const getExercisesByType = async (type: string) => {
    if (!type) {
      setExercises([]);
      return;
    }
    try {
      const exercisesList = await WorkoutService.getExercisesByCategory(type);
      setExercises(exercisesList);
    } catch (error) {
      console.error('Failed to load exercises:', error);
      setExercises([]);
    }
  };

  const handleExerciseTypeChange = (type: string) => {
    setCreateWorkoutData(prev => ({ ...prev, exerciseId: 0, exerciseType: type }));
    setExercises([]); // Clear exercises when type changes
    getExercisesByType(type); // Load exercises for selected type
  };

  const handleExerciseChange = (exerciseId: string) => {
    setCreateWorkoutData(prev => ({ ...prev, exerciseId: Number(exerciseId) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreateWorkoutData(prev => ({ ...prev, workoutPhotoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditWorkoutData(prev => ({ ...prev, workoutPhotoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if new workout conflicts with existing workouts on the same day
  const hasTimeConflict = (newWorkout: WorkoutPlanCreateRequest, existingWorkouts: WorkoutPlan[]): boolean => {
    if (!newWorkout.workoutDate || !newWorkout.startTime || !newWorkout.endTime) {
      return false;
    }

    const newStart = new Date(newWorkout.workoutDate + 'T' + newWorkout.startTime + ':00');
    const newEnd = new Date(newWorkout.workoutDate + 'T' + newWorkout.endTime + ':00');

    // Handle cross-day workouts for new workout
    if (newEnd < newStart) {
      newEnd.setDate(newEnd.getDate() + 1);
    }

    for (const existing of existingWorkouts) {
      if (existing.workoutDate !== newWorkout.workoutDate) {
        continue; // Different day, no conflict
      }

      if (!existing.startTime || !existing.endTime) {
        continue; // Missing time data, skip
      }

      const existingStart = new Date(existing.workoutDate + 'T' + existing.startTime);
      let existingEnd = new Date(existing.workoutDate + 'T' + existing.endTime);

      // Handle cross-day workouts for existing workout
      if (existingEnd < existingStart) {
        existingEnd.setDate(existingEnd.getDate() + 1);
      }

      // Check for overlap: (StartA < EndB) and (EndA > StartB)
      if (newStart < existingEnd && newEnd > existingStart) {
        return true; // Conflict detected
      }
    }

    return false; // No conflict
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check for time conflicts with existing workouts
      const allWorkouts = await WorkoutService.getUserWorkoutPlans();
      if (hasTimeConflict(createWorkoutData, allWorkouts)) {
        alert('Time conflict: You already have a workout scheduled during this time slot. Please choose a different time.');
        setIsLoading(false);
        return;
      }

      // Convert times to 12-hour format before sending
      const workoutData = {
        ...createWorkoutData,
        startTime: createWorkoutData.startTime,
        endTime: createWorkoutData.endTime
      };
      console.log('Creating workout:', workoutData);
      const createdWorkout = await WorkoutService.createWorkoutPlan(workoutData);
      console.log('Workout created successfully:', createdWorkout);

      // Refresh today's workouts to include the new one
      const updatedWorkouts = await WorkoutService.getTodayWorkoutPlans();
      setTodayWorkouts(updatedWorkouts);

      setIsCreateModalOpen(false);
      setCreateWorkoutData({
        exerciseType: '',
        exerciseId: 0,
        workoutDate: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        comments: '',
        workoutPhotoUrl: ''
      });
    } catch (error) {
      console.error('Failed to create workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening edit modal
  const handleEditClick = (workout: WorkoutPlan) => {
    setEditingWorkout(workout);
    setEditWorkoutData({
      exerciseType: workout.exerciseType,
      exerciseId: workout.exercise?.id ? Number(workout.exercise.id) : 0,
      workoutDate: workout.workoutDate,
      startTime: toInputTime(workout.startTime),
      endTime: toInputTime(workout.endTime),
      comments: workout.comments || '',
      workoutPhotoUrl: workout.workoutPhotoUrl || ''
    });
    if (workout.exerciseType) {
      getExercisesByType(workout.exerciseType);
    }
    setIsEditModalOpen(true);
  };

  // Handle edit form submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkout) return;

    setIsLoading(true);
    try {
      // Check for time conflicts with existing workouts (excluding current workout)
      const allWorkouts = await WorkoutService.getUserWorkoutPlans();
      const otherWorkouts = allWorkouts.filter(w => w.id !== editingWorkout.id);
      if (hasTimeConflict(editWorkoutData, otherWorkouts)) {
        alert('Time conflict: You already have a workout scheduled during this time slot. Please choose a different time.');
        setIsLoading(false);
        return;
      }

      const updatedWorkout = await WorkoutService.updateWorkoutPlan(
        editingWorkout.id,
        editWorkoutData
      );

      setTodayWorkouts(prev => prev.map(w =>
        w.id === updatedWorkout.id ? updatedWorkout : w
      ));

      setIsEditModalOpen(false);
      setEditingWorkout(null);
    } catch (error) {
      console.error('Failed to update workout:', error);
      alert('Failed to update workout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle complete workout
  const handleCompleteWorkout = async (workoutId: string | number) => {
    try {
      const completedWorkout = await WorkoutService.completeWorkoutPlan(workoutId);
      setTodayWorkouts(prev => prev.map(w =>
        w.id === completedWorkout.id ? completedWorkout : w
      ));
    } catch (error) {
      console.error('Failed to complete workout:', error);
      alert('Failed to complete workout. Please try again.');
    }
  };

  // Handle delete workout
  const openDeleteModal = (workout: WorkoutPlan) => {
    setDeletingWorkout(workout);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingWorkout(null);
    setIsDeleting(false);
  };

  const confirmDeleteWorkout = async () => {
    if (!deletingWorkout) return;

    setIsDeleting(true);
    try {
      await WorkoutService.deleteWorkoutPlan(deletingWorkout.id);
      setTodayWorkouts(prev => prev.filter(w => w.id !== deletingWorkout.id));
      closeDeleteModal();
      setIsEditModalOpen(false);
      setEditingWorkout(null);
    } catch (error) {
      console.error('Failed to delete workout:', error);
      alert('Failed to delete workout. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };


  const CreateWorkoutModal = useMemo(() => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-secondary-900">Create Workout Plan</h2>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Type of Exercise
                </label>
                <select
                  value={createWorkoutData.exerciseType}
                  onChange={(e) => handleExerciseTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select exercise type</option>
                  {exerciseTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Exercise
                </label>
                <select
                  value={createWorkoutData.exerciseId}
                  onChange={(e) => handleExerciseChange(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                  disabled={!createWorkoutData.exerciseType}
                >
                  <option value="">Select exercise</option>
                  {exercises.map(exercise => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Date
                </label>
                <Input
                  type="date"
                  value={createWorkoutData.workoutDate}
                  onChange={(e) => setCreateWorkoutData(prev => ({ ...prev, workoutDate: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={createWorkoutData.startTime}
                    onChange={(e) => setCreateWorkoutData(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={createWorkoutData.endTime}
                    onChange={(e) => setCreateWorkoutData(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-secondary-700 mb-2">
                Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                value={createWorkoutData.comments}
                onChange={(e) => setCreateWorkoutData(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Add any notes about this workout..."
                className="w-full h-24 px-3 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Workout Photo
              </label>
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                {createWorkoutData.workoutPhotoUrl ? (
                  <div className="space-y-3">
                    <img
                      src={createWorkoutData.workoutPhotoUrl}
                      alt="Workout preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateWorkoutData(prev => ({ ...prev, workoutPhotoUrl: '' }))}
                    >
                      Remove Photo
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                    <p className="text-sm text-secondary-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-secondary-500 mb-3">
                      PNG, JPG up to 10MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="workout-photo"
                    />
                    <Button type="button" variant="outline">
                      <label htmlFor="workout-photo" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating...' : 'Create Workout Plan'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ), [isCreateModalOpen, isLoading, exerciseTypes, exercises, createWorkoutData, handleExerciseTypeChange, handleExerciseChange, handleSubmit]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Workout Plans</h1>
        <p className="text-secondary-600">
          Manage your workout schedule and track your progress
        </p>
      </div>

      {/* Create Workout Modal */}
      {isCreateModalOpen && CreateWorkoutModal}

      {/* Today's Workouts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-primary-600" />
            Today's Workouts - {formatDate(new Date())}
          </h2>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            Create Workout Plan
          </Button>
        </div>
        {todayWorkouts.length > 0 ? (
          <div className="space-y-4">
            {todayWorkouts.map(plan => {
              const workoutStarted = hasWorkoutStarted(plan);
              const workoutEnded = hasWorkoutEnded(plan);

              // Determine actual status based on current time
              let currentStatus = 'Scheduled';
              if (workoutStarted && !workoutEnded) {
                currentStatus = 'IN_PROGRESS';
              } else if (workoutEnded) {
                currentStatus = 'COMPLETED';
              }

              return (
                <Card key={plan.id} className={`${plan.workoutDate === new Date().toISOString().split('T')[0] ? 'border-primary-500 bg-primary-50' : ''} ${!workoutStarted ? 'opacity-50 grayscale' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${currentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            currentStatus === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                          }`}>
                          {currentStatus === 'COMPLETED' ? 'Completed' :
                            currentStatus === 'IN_PROGRESS' ? 'In Progress' : 'Scheduled'}
                        </div>
                        {currentStatus === 'IN_PROGRESS' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(plan)}
                              className="p-1"
                            >
                              <Edit2 className="w-4 h-4 text-secondary-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompleteWorkout(plan.id)}
                              disabled={plan.workoutDate !== new Date().toISOString().split('T')[0]}
                              className="p-1"
                            >
                              <CheckCircle2 className={`w-4 h-4 ${plan.workoutDate === new Date().toISOString().split('T')[0]
                                  ? 'text-green-600'
                                  : 'text-gray-400'
                                }`} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-secondary-600">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDate(new Date(plan.workoutDate))}</span>
                      <Clock className="w-4 h-4" />
                      <span>{formatTime12Hour(plan.startTime)} - {formatTime12Hour(plan.endTime)}</span>
                      <Activity className="w-4 h-4" />
                      <span>{plan.exercise?.name || 'Exercise'}</span>
                    </div>

                    {plan.comments && (
                      <div className="p-3 bg-secondary-50 rounded-lg">
                        <p className="text-sm text-secondary-700">{plan.comments}</p>
                      </div>
                    )}

                    {plan.workoutPhotoUrl && (
                      <div className="mt-4">
                        <img
                          src={plan.workoutPhotoUrl}
                          alt="Workout"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">No workouts scheduled for today</h3>
              <p className="text-secondary-600">
                Click "Create Workout Plan" in the header above to schedule your first workout!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Workouts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-secondary-600" />
            Past Workouts
          </h2>
        </div>
        {pastWorkouts.length > 0 ? (
          <div className="space-y-4">
            {pastWorkouts.map(plan => (
              <Card key={plan.id} className="border-secondary-200 bg-secondary-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-secondary-700">{plan.title}</CardTitle>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${plan.activeStatus === 'COMPLETED' || hasWorkoutEnded(plan) ? 'bg-green-100 text-green-800' :
                        plan.activeStatus === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {plan.activeStatus === 'COMPLETED' || hasWorkoutEnded(plan) ? 'Completed' :
                        plan.activeStatus === 'IN_PROGRESS' ? 'In Progress' : 'Scheduled'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-secondary-600">
                    <CalendarDays className="w-4 h-4" />
                    <span>{formatDate(new Date(plan.workoutDate))}</span>
                    <Clock className="w-4 h-4" />
                    <span>{formatTime12Hour(plan.startTime)} - {formatTime12Hour(plan.endTime)}</span>
                    <Activity className="w-4 h-4" />
                    <span>{plan.exercise?.name || 'Exercise'}</span>
                  </div>

                  {plan.comments && (
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <p className="text-sm text-secondary-700">{plan.comments}</p>
                    </div>
                  )}

                  {plan.workoutPhotoUrl && (
                    <div className="mt-4">
                      <img
                        src={plan.workoutPhotoUrl}
                        alt="Workout"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">No past workouts</h3>
              <p className="text-secondary-600">
                Your completed workouts will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Workout Modal */}
      {isCreateModalOpen && CreateWorkoutModal}

      {/* Edit Workout Modal */}
      {isEditModalOpen && editingWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-secondary-900">Edit Workout Plan</h2>
                <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Type of Exercise
                    </label>
                    <select
                      value={editWorkoutData.exerciseType}
                      onChange={(e) => {
                        setEditWorkoutData(prev => ({ ...prev, exerciseType: e.target.value, exerciseId: 0 }));
                        getExercisesByType(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select exercise type</option>
                      {exerciseTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Exercise
                    </label>
                    <select
                      value={editWorkoutData.exerciseId}
                      onChange={(e) => setEditWorkoutData(prev => ({ ...prev, exerciseId: e.target.value ? Number(e.target.value) : 0 }))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                      disabled={!editWorkoutData.exerciseType}
                    >
                      <option value="">Select exercise</option>
                      {exercises.map(exercise => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={editWorkoutData.workoutDate}
                      onChange={(e) => setEditWorkoutData(prev => ({ ...prev, workoutDate: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Start Time
                      </label>
                      <Input
                        type="time"
                        value={editWorkoutData.startTime}
                        onChange={(e) => setEditWorkoutData(prev => ({ ...prev, startTime: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        End Time
                      </label>
                      <Input
                        type="time"
                        value={editWorkoutData.endTime}
                        onChange={(e) => setEditWorkoutData(prev => ({ ...prev, endTime: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-comments" className="block text-sm font-medium text-secondary-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    id="edit-comments"
                    name="comments"
                    value={editWorkoutData.comments}
                    onChange={(e) => setEditWorkoutData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Add any notes about this workout..."
                    className="w-full h-24 px-3 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Workout Photo
                  </label>
                  <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                    {editWorkoutData.workoutPhotoUrl ? (
                      <div className="space-y-3">
                        <img
                          src={editWorkoutData.workoutPhotoUrl}
                          alt="Workout preview"
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditWorkoutData(prev => ({ ...prev, workoutPhotoUrl: '' }))}
                        >
                          Remove Photo
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                        <p className="text-sm text-secondary-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-secondary-500 mb-3">
                          PNG, JPG up to 10MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          className="hidden"
                          id="edit-workout-photo"
                        />
                        <Button type="button" variant="outline">
                          <label htmlFor="edit-workout-photo" className="cursor-pointer">
                            Choose File
                          </label>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => editingWorkout && openDeleteModal(editingWorkout)}
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Delete Workout
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-center text-secondary-900 mb-2">
                Delete Workout Plan
              </h3>

              <p className="text-center text-secondary-600 mb-6">
                Are you sure you want to delete this workout plan? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDeleteModal}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={confirmDeleteWorkout}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
