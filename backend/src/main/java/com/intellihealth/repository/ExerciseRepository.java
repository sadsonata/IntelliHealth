package com.intellihealth.repository;

import com.intellihealth.entity.Exercise;
import com.intellihealth.entity.ExerciseCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByCategory(ExerciseCategoryEntity category);
    List<Exercise> findByCategoryName(String categoryName);
    List<Exercise> findByMuscleGroup(Exercise.MuscleGroup muscleGroup);
    List<Exercise> findByNameContainingIgnoreCase(String name);
}
