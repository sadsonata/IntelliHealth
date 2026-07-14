package com.intellihealth.controller;

import com.intellihealth.entity.Exercise;
import com.intellihealth.service.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/exercises")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ExerciseController {

    private final ExerciseService exerciseService;

    @PostMapping
    public ResponseEntity<Exercise> createExercise(@Valid @RequestBody Exercise exercise) {
        Exercise createdExercise = exerciseService.createExercise(exercise);
        return ResponseEntity.ok(createdExercise);
    }

    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises() {
        List<Exercise> exercises = exerciseService.getAllExercises();
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable Long id) {
        Exercise exercise = exerciseService.getExerciseById(id);
        return ResponseEntity.ok(exercise);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getExercisesByCategory(@PathVariable String category) {
        try {
            log.info("GET /v1/exercises/category/{}", category);
            List<Exercise> exercises = exerciseService.getExercisesByCategory(category);
            log.info("Returning {} exercises for category '{}'", exercises.size(), category);
            return ResponseEntity.ok(exercises);
        } catch (Exception e) {
            log.error("Error fetching exercises for category '{}': {}", category, e.getMessage(), e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/muscle-group/{muscleGroup}")
    public ResponseEntity<List<Exercise>> getExercisesByMuscleGroup(@PathVariable Exercise.MuscleGroup muscleGroup) {
        List<Exercise> exercises = exerciseService.getExercisesByMuscleGroup(muscleGroup);
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Exercise>> searchExercisesByName(@RequestParam String name) {
        List<Exercise> exercises = exerciseService.searchExercisesByName(name);
        return ResponseEntity.ok(exercises);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id, @Valid @RequestBody Exercise exerciseDetails) {
        Exercise updatedExercise = exerciseService.updateExercise(id, exerciseDetails);
        return ResponseEntity.ok(updatedExercise);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }
}
