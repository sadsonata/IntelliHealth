package com.intellihealth.controller;

import com.intellihealth.entity.WorkoutPlan;
import com.intellihealth.entity.Exercise;
import com.intellihealth.service.WorkoutService;
import com.intellihealth.dto.WorkoutPlanCreateRequest;
import com.intellihealth.dto.WorkoutPlanDTO;
import com.intellihealth.dto.ExerciseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/workouts")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<?> createWorkoutPlan(@Valid @RequestBody WorkoutPlanCreateRequest request) {
        WorkoutPlan createdPlan = workoutService.createWorkoutPlan(request);
        // Convert to DTO to avoid lazy loading issues
        WorkoutPlanDTO dto = WorkoutPlanDTO.builder()
            .id(createdPlan.getId())
            .title(createdPlan.getTitle())
            .description(createdPlan.getDescription())
            .exerciseType(createdPlan.getExerciseType())
            .exerciseId(createdPlan.getExercise() != null ? createdPlan.getExercise().getId() : null)
            .exerciseName(createdPlan.getExercise() != null ? createdPlan.getExercise().getName() : null)
            .workoutDate(createdPlan.getWorkoutDate())
            .startTime(createdPlan.getStartTime())
            .endTime(createdPlan.getEndTime())
            .comments(createdPlan.getComments())
            .workoutPhotoUrl(createdPlan.getWorkoutPhotoUrl())
            .activeStatus(createdPlan.getActiveStatus())
            .createdAt(createdPlan.getCreatedAt())
            .updatedAt(createdPlan.getUpdatedAt())
            .build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/exercises/by-category")
    public ResponseEntity<?> getExercisesByCategory(@RequestParam String category) {
        log.info("GET /api/v1/workouts/exercises/by-category?category={}", category);
        try {
            List<Exercise> exercises = workoutService.getExercisesByCategory(category);
            List<ExerciseDTO> exerciseDTOs = exercises.stream()
                .map(exercise -> ExerciseDTO.builder()
                    .id(exercise.getId())
                    .name(exercise.getName())
                    .description(exercise.getDescription())
                    .category(exercise.getCategory() != null ? exercise.getCategory().getName() : null)
                    .build())
                .collect(Collectors.toList());
            log.info("Returning {} exercises for category {}", exerciseDTOs.size(), category);
            return ResponseEntity.ok(exerciseDTOs);
        } catch (Exception e) {
            log.error("Error fetching exercises for category {}: {}", category, e.getMessage(), e);
            return ResponseEntity.status(500).body("Error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    @GetMapping("/exercise-types")
    public ResponseEntity<List<String>> getExerciseTypes() {
        log.info("GET /api/v1/workouts/exercise-types");
        try {
            List<String> types = workoutService.getExerciseTypes();
            log.info("Returning {} exercise types", types.size());
            return ResponseEntity.ok(types);
        } catch (Exception e) {
            log.error("Error fetching exercise types: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<WorkoutPlanDTO>> getUserWorkoutPlans() {
        List<WorkoutPlan> plans = workoutService.getUserWorkoutPlans();
        List<WorkoutPlanDTO> dtos = plans.stream()
            .map(plan -> WorkoutPlanDTO.builder()
                .id(plan.getId())
                .title(plan.getTitle())
                .description(plan.getDescription())
                .exerciseType(plan.getExerciseType())
                .exerciseId(plan.getExercise() != null ? plan.getExercise().getId() : null)
                .exerciseName(plan.getExercise() != null ? plan.getExercise().getName() : null)
                .workoutDate(plan.getWorkoutDate())
                .startTime(plan.getStartTime())
                .endTime(plan.getEndTime())
                .comments(plan.getComments())
                .workoutPhotoUrl(plan.getWorkoutPhotoUrl())
                .activeStatus(plan.getActiveStatus())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/today")
    public ResponseEntity<List<WorkoutPlanDTO>> getTodayWorkoutPlans() {
        List<WorkoutPlan> plans = workoutService.getTodayWorkoutPlans();
        List<WorkoutPlanDTO> dtos = plans.stream()
            .map(plan -> WorkoutPlanDTO.builder()
                .id(plan.getId())
                .title(plan.getTitle())
                .description(plan.getDescription())
                .exerciseType(plan.getExerciseType())
                .exerciseId(plan.getExercise() != null ? plan.getExercise().getId() : null)
                .exerciseName(plan.getExercise() != null ? plan.getExercise().getName() : null)
                .workoutDate(plan.getWorkoutDate())
                .startTime(plan.getStartTime())
                .endTime(plan.getEndTime())
                .comments(plan.getComments())
                .workoutPhotoUrl(plan.getWorkoutPhotoUrl())
                .activeStatus(plan.getActiveStatus())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/active")
    public ResponseEntity<List<WorkoutPlanDTO>> getActiveWorkoutPlans() {
        List<WorkoutPlan> plans = workoutService.getActiveWorkoutPlans();
        List<WorkoutPlanDTO> dtos = plans.stream()
            .map(plan -> WorkoutPlanDTO.builder()
                .id(plan.getId())
                .title(plan.getTitle())
                .description(plan.getDescription())
                .exerciseType(plan.getExerciseType())
                .exerciseId(plan.getExercise() != null ? plan.getExercise().getId() : null)
                .exerciseName(plan.getExercise() != null ? plan.getExercise().getName() : null)
                .workoutDate(plan.getWorkoutDate())
                .startTime(plan.getStartTime())
                .endTime(plan.getEndTime())
                .comments(plan.getComments())
                .workoutPhotoUrl(plan.getWorkoutPhotoUrl())
                .activeStatus(plan.getActiveStatus())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutPlan> getWorkoutPlanById(@PathVariable Long id) {
        WorkoutPlan plan = workoutService.getWorkoutPlanById(id);
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutPlan> updateWorkoutPlan(@PathVariable Long id, @Valid @RequestBody WorkoutPlan planDetails) {
        WorkoutPlan updatedPlan = workoutService.updateWorkoutPlan(id, planDetails);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkoutPlan(@PathVariable Long id) {
        workoutService.deleteWorkoutPlan(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<WorkoutPlan> completeWorkoutPlan(@PathVariable Long id) {
        WorkoutPlan completedPlan = workoutService.completeWorkoutPlan(id);
        return ResponseEntity.ok(completedPlan);
    }

    @PostMapping("/auto-complete")
    public ResponseEntity<Integer> autoCompleteExpiredWorkouts() {
        int completedCount = workoutService.autoCompleteExpiredWorkouts();
        return ResponseEntity.ok(completedCount);
    }
}
