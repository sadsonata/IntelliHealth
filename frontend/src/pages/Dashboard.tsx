import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import WorkoutService from '../services/workoutService';
import type { WorkoutPlan } from '../services/workoutService';
import { formatDuration, formatDate } from '../utils/dateUtils';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Calendar, 
  Camera,
  Clock,
  Flame
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load user name from JWT
        const token = localStorage.getItem('token');
        if (token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          setUserName(payload.name || payload.email?.split('@')[0] || 'User');
        }

        // Load workout data
        const allWorkouts = await WorkoutService.getUserWorkoutPlans();
        setWorkouts(allWorkouts);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate statistics from real data
  const completedWorkouts = workouts.filter(w => w.activeStatus === 'COMPLETED');
  const totalWorkouts = completedWorkouts.length;
  
  // Calculate this week's workouts
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const thisWeekWorkouts = completedWorkouts.filter(w => {
    const workoutDate = new Date(w.workoutDate);
    return workoutDate >= startOfWeek && workoutDate <= today;
  }).length;

  // Calculate total duration (estimated - using end time minus start time)
  const totalDuration = completedWorkouts.reduce((total, workout) => {
    if (workout.startTime && workout.endTime) {
      const start = new Date(`2000-01-01T${workout.startTime}`);
      const end = new Date(`2000-01-01T${workout.endTime}`);
      // Handle cross-day workouts
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }
      return total + (end.getTime() - start.getTime());
    }
    return total;
  }, 0);

  // Get recent completed workouts
  const recentWorkouts = completedWorkouts
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-secondary-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-primary-100">
          You're making great progress. Keep up the excellent work!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Workouts</p>
                <p className="text-2xl font-bold text-secondary-900">{totalWorkouts}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">This Week</p>
                <p className="text-2xl font-bold text-secondary-900">{thisWeekWorkouts}</p>
                <p className="text-xs text-secondary-500">
                  {thisWeekWorkouts > 0 ? '+' : ''}{thisWeekWorkouts} workouts
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Time</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {formatDuration(totalDuration)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Calories Burned</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {Math.round(totalDuration / 1000 / 60 * 8).toLocaleString()}
                </p>
                <p className="text-xs text-secondary-500">Estimate</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Workouts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map(workout => (
                <div key={workout.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {workout.title}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {formatDate(new Date(workout.workoutDate))} • {workout.startTime} - {workout.endTime}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-secondary-600 text-center py-4">No completed workouts yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Camera className="w-4 h-4 mr-2" />
              Add Progress Photo
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Target className="w-4 h-4 mr-2" />
              Update Goals
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transformation Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Transformation Gallery</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">No progress photos yet</h3>
            <p className="text-secondary-600 mb-4">
              Start tracking your transformation by adding your first progress photo
            </p>
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Add First Photo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
