import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import ExerciseService from '../services/exerciseService';
import type { Exercise, ExerciseCategory } from '../types';
import { 
  Search, 
  Filter,
  Dumbbell,
  Heart,
  Users,
  Brain,
  Clock,
  Target
} from 'lucide-react';

const categoryInfo = {
  aerobic: {
    name: 'Aerobic',
    description: 'Cardiovascular exercises that improve endurance',
    icon: Heart,
    color: 'bg-red-100 text-red-600'
  },
  strength: {
    name: 'Strength',
    description: 'Exercises to build muscle and strength',
    icon: Dumbbell,
    color: 'bg-blue-100 text-blue-600'
  },
  flexibility: {
    name: 'Flexibility',
    description: 'Stretching exercises to improve range of motion',
    icon: Users,
    color: 'bg-green-100 text-green-600'
  },
  balance: {
    name: 'Balance',
    description: 'Exercises to improve stability and coordination',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600'
  }
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

export const ExerciseLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setIsLoading(true);
        const allExercises = await ExerciseService.getAllExercises();
        setExercises(allExercises);
        setError(null);
      } catch (err) {
        setError('Failed to load exercises. Please try again later.');
        console.error('Error loading exercises:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, []);

  const exercisesByCategory = {
    aerobic: exercises.filter(ex => ex.category === 'aerobic'),
    strength: exercises.filter(ex => ex.category === 'strength'),
    flexibility: exercises.filter(ex => ex.category === 'flexibility'),
    balance: exercises.filter(ex => ex.category === 'balance'),
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const category = categoryInfo[exercise.category];
    
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedExercise(exercise)}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="aspect-video bg-secondary-100 rounded-lg overflow-hidden">
              <img 
                src={exercise.imageUrl || `https://via.placeholder.com/300x200/64748b/ffffff?text=${exercise.name}`}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-secondary-900">{exercise.name}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[exercise.difficulty]}`}>
                  {exercise.difficulty}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${category.color}`}>
                  <category.icon className="w-3 h-3" />
                </div>
                <span className="text-sm text-secondary-600">{category.name}</span>
              </div>
              
              <p className="text-sm text-secondary-600 line-clamp-2">
                {exercise.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {exercise.muscleGroups.slice(0, 3).map(muscle => (
                  <span key={muscle} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                    {muscle}
                  </span>
                ))}
                {exercise.muscleGroups.length > 3 && (
                  <span className="text-xs text-secondary-500">
                    +{exercise.muscleGroups.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ExerciseDetail: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const category = categoryInfo[exercise.category];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-secondary-900">{exercise.name}</h2>
              <Button variant="ghost" onClick={() => setSelectedExercise(null)}>
                ×
              </Button>
            </div>
            
            <div className="aspect-video bg-secondary-100 rounded-lg overflow-hidden">
              <img 
                src={exercise.imageUrl || `https://via.placeholder.com/600x400/64748b/ffffff?text=${exercise.name}`}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${category.color}`}>
                  <category.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Category</p>
                  <p className="font-medium">{category.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${difficultyColors[exercise.difficulty]}`}>
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Difficulty</p>
                  <p className="font-medium capitalize">{exercise.difficulty}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Equipment</p>
                  <p className="font-medium">{exercise.equipment.length > 0 ? exercise.equipment.join(', ') : 'None'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">Description</h3>
                <p className="text-secondary-600">{exercise.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-1 text-secondary-600">
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">Muscle Groups</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscleGroups.map(muscle => (
                    <span key={muscle} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button className="flex-1">
                Add to Workout
              </Button>
              <Button variant="outline" onClick={() => setSelectedExercise(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Exercise Library</h1>
        <p className="text-secondary-600">
          Browse our comprehensive collection of exercises for all fitness levels
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            All Exercises ({exercises.length})
          </button>
          {(Object.keys(categoryInfo) as ExerciseCategory[]).map(category => {
            const info = categoryInfo[category];
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  selectedCategory === category
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <info.icon className="w-4 h-4" />
                <span>{info.name} ({exercisesByCategory[category].length})</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Category Description */}
      {selectedCategory !== 'all' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryInfo[selectedCategory].color}`}>
                {React.createElement(categoryInfo[selectedCategory].icon, { className: "w-5 h-5" })}
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">{categoryInfo[selectedCategory].name}</h3>
                <p className="text-sm text-secondary-600">{categoryInfo[selectedCategory].description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="aspect-video bg-secondary-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                    <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                    <div className="h-3 bg-secondary-200 rounded w-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Error Loading Exercises</h3>
            <p className="text-secondary-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExercises.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && filteredExercises.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">No exercises found</h3>
            <p className="text-secondary-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetail exercise={selectedExercise} />
      )}
    </div>
  );
};
