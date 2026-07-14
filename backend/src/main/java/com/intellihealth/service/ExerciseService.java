package com.intellihealth.service;

import com.intellihealth.entity.Exercise;
import com.intellihealth.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    @Transactional
    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    @Transactional(readOnly = true)
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Exercise getExerciseById(Long id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Exercise> getExercisesByCategory(String category) {
        return exerciseRepository.findByCategoryName(category);
    }

    @Transactional(readOnly = true)
    public List<Exercise> getExercisesByMuscleGroup(Exercise.MuscleGroup muscleGroup) {
        return exerciseRepository.findByMuscleGroup(muscleGroup);
    }

    @Transactional(readOnly = true)
    public List<Exercise> searchExercisesByName(String name) {
        return exerciseRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional
    public Exercise updateExercise(Long id, Exercise exerciseDetails) {
        Exercise exercise = getExerciseById(id);
        
        exercise.setName(exerciseDetails.getName());
        exercise.setDescription(exerciseDetails.getDescription());
        exercise.setCategory(exerciseDetails.getCategory());
        exercise.setMuscleGroup(exerciseDetails.getMuscleGroup());
        
        return exerciseRepository.save(exercise);
    }

    @Transactional
    public void deleteExercise(Long id) {
        Exercise exercise = getExerciseById(id);
        exerciseRepository.delete(exercise);
    }
}
