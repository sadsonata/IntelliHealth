import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import WorkoutService from '../services/workoutService';
import type { WorkoutPlan } from '../services/workoutService';
import { formatDuration, formatDate } from '../utils/dateUtils';
import { 
  Activity, 
  Target, 
  Calendar, 
  Camera,
  Clock,
  Zap,
  CheckCircle,
  Plus,
  ChevronRight,
  Dumbbell
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

  const normalizeWorkoutStatus = (workout: WorkoutPlan) => {
    const rawStatus = String((workout as WorkoutPlan & { activeStatus?: string; status?: string }).activeStatus ?? (workout as WorkoutPlan & { activeStatus?: string; status?: string }).status ?? '').trim().toUpperCase();

    if (rawStatus.includes('COMPLETED')) return 'COMPLETED';
    if (rawStatus.includes('IN_PROGRESS')) return 'IN_PROGRESS';
    if (rawStatus.includes('ACTIVE') || rawStatus.includes('SCHEDULED')) return 'SCHEDULED';
    return 'SCHEDULED';
  };

  const isWorkoutCompleted = (workout: WorkoutPlan) => normalizeWorkoutStatus(workout) === 'COMPLETED';

  const getWorkoutStatusClasses = (workout: WorkoutPlan) => {
    switch (normalizeWorkoutStatus(workout)) {
      case 'COMPLETED':
        return 'bg-emerald-500 text-white';
      case 'IN_PROGRESS':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-sky-500 text-white';
    }
  };

  // Calculate statistics from real data
  const completedWorkouts = workouts.filter(isWorkoutCompleted);
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

  // Calculate workout streak
  const calculateStreak = () => {
    if (completedWorkouts.length === 0) return 0;
    
    const sortedDates = [...completedWorkouts]
      .map(w => new Date(w.workoutDate).toDateString())
      .reverse();
    const uniqueDates = [...new Set(sortedDates)];
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const dateStr of uniqueDates) {
      const workoutDate = new Date(dateStr);
      const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays === streak + 1 && streak === 0) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Get today's workout
  const todayStr = today.toDateString();
  const todaysWorkout = workouts.find(w => 
    new Date(w.workoutDate).toDateString() === todayStr && !isWorkoutCompleted(w)
  ) ?? workouts.find(w => new Date(w.workoutDate).toDateString() === todayStr);
  const todaysWorkoutStatus = todaysWorkout ? (isWorkoutCompleted(todaysWorkout) ? 'Completed' : 'Scheduled') : 'Rest Day';

  // Get upcoming workouts
  const upcomingWorkouts = workouts
    .filter(w => new Date(w.workoutDate) > today && !isWorkoutCompleted(w))
    .sort((a, b) => new Date(a.workoutDate).getTime() - new Date(b.workoutDate).getTime())
    .slice(0, 5);

  // Get recent completed workouts
  const recentWorkouts = completedWorkouts
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Calculate workout duration
  const calculateDuration = (workout: WorkoutPlan) => {
    if (workout.startTime && workout.endTime) {
      const start = new Date(`2000-01-01T${workout.startTime}`);
      const end = new Date(`2000-01-01T${workout.endTime}`);
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }
      return end.getTime() - start.getTime();
    }
    return 0;
  };

  // Weekly goal (default: 4 workouts per week)
  const weeklyGoal = 4;
  const weeklyProgress = Math.min((thisWeekWorkouts / weeklyGoal) * 100, 100);

  // Generate monthly calendar data with workouts per day
  const generateCalendarData = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push({ day: null, workouts: [] });
    }
    
    // Add days of the month with their workouts
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toDateString();
      
      // Get all workouts for this day
      const workoutsOnDay = workouts.filter(w => new Date(w.workoutDate).toDateString() === dateStr);
      
      calendarDays.push({ day, date, workouts: workoutsOnDay });
    }
    
    return calendarDays;
  };

  const calendarData = generateCalendarData();

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
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-emerald-100">
          Let's crush your fitness goals today
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Workout</p>
                <p className="text-xl font-bold text-gray-900">
                  {todaysWorkoutStatus}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Weekly Progress</p>
                <p className="text-xl font-bold text-gray-900">{thisWeekWorkouts}/{weeklyGoal}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${weeklyProgress}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Current Streak</p>
                <p className="text-xl font-bold text-gray-900">{currentStreak} days</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Workouts</p>
                <p className="text-xl font-bold text-gray-900">{totalWorkouts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout Card */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>Today's Workout</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysWorkout ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{todaysWorkout.title}</h3>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatDuration(calculateDuration(todaysWorkout))}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{todaysWorkout.startTime} - {todaysWorkout.endTime}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Exercises</h4>
                  <div className="space-y-2">
                    {todaysWorkout.exercise ? (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Dumbbell className="w-5 h-5 text-emerald-600" />
                        <span className="text-gray-700">{String(todaysWorkout.exercise)}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No exercises added yet</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No workout scheduled</h3>
                <p className="text-gray-600 mb-4">
                  Enjoy your rest day or schedule a workout
                </p>
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Workout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Workout
            </Button>
            <Button variant="outline" className="w-full justify-start border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Camera className="w-4 h-4 mr-2" />
              Add Progress Photo
            </Button>
            <Button variant="outline" className="w-full justify-start border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Target className="w-4 h-4 mr-2" />
              Update Goals
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Workouts */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Upcoming Workouts</span>
              </div>
              {upcomingWorkouts.length > 0 && (
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingWorkouts.length > 0 ? (
              upcomingWorkouts.map(workout => (
                <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{workout.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(new Date(workout.workoutDate))} • {workout.startTime}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">No upcoming workouts</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Recent Activity</span>
              </div>
              {recentWorkouts.length > 0 && (
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map(workout => (
                <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Completed {workout.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(new Date(workout.workoutDate))}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Photo Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              <span>Progress Photos</span>
            </div>
            <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Camera className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No progress photos yet</h3>
            <p className="text-gray-600 mb-4">
              Track your transformation by uploading progress photos
            </p>
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Camera className="w-4 h-4 mr-2" />
              Add First Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Workout Calendar */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Monthly Overview</span>
            </div>
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`
                  min-h-16 p-1 rounded border border-gray-100
                  ${day.day === null ? 'bg-transparent border-transparent' : 'bg-gray-50'}
                  ${day.date && new Date(day.date).toDateString() === new Date().toDateString() ? 'ring-1 ring-emerald-600' : ''}
                `}
              >
                {day.day !== null && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-700">{day.day}</div>
                    {day.workouts.slice(0, 3).map((workout, workoutIndex) => (
                      <div
                        key={workoutIndex}
                        className={`text-xs px-1 py-0.5 rounded truncate ${getWorkoutStatusClasses(workout)}`}
                      >
                        {workout.title}
                      </div>
                    ))}
                    {day.workouts.length > 3 && (
                      <div className="text-xs text-gray-500">+{day.workouts.length - 3} more</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded"></div>
              <span>Done</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-sky-500 rounded"></div>
              <span>Scheduled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
