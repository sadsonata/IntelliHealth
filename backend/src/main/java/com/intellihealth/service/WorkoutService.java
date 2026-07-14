package com.intellihealth.service;

import com.intellihealth.entity.WorkoutPlan;
import com.intellihealth.entity.Exercise;
import com.intellihealth.entity.ExerciseCategoryEntity;
import com.intellihealth.entity.User;
import com.intellihealth.repository.WorkoutPlanRepository;
import com.intellihealth.repository.ExerciseRepository;
import com.intellihealth.repository.ExerciseCategoryRepository;
import com.intellihealth.dto.WorkoutPlanCreateRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final ExerciseRepository exerciseRepository;
    private final ExerciseCategoryRepository exerciseCategoryRepository;
    private final UserService userService;

    @Transactional
    public WorkoutPlan createWorkoutPlan(WorkoutPlanCreateRequest request) {
        User currentUser = userService.getCurrentUser();
        
        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + request.getExerciseId()));
        
        WorkoutPlan workoutPlan = WorkoutPlan.builder()
                .user(currentUser)
                .exercise(exercise)
                .exerciseType(request.getExerciseType())
                .title(request.getTitle() != null ? request.getTitle() : exercise.getName() + " Workout")
                .description(request.getDescription() != null ? request.getDescription() : exercise.getDescription())
                .workoutDate(request.getWorkoutDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .comments(request.getComments())
                .workoutPhotoUrl(request.getWorkoutPhotoUrl())
                .activeStatus(WorkoutPlan.ActiveStatus.ACTIVE)
                .build();
                
        return workoutPlanRepository.save(workoutPlan);
    }

    @Transactional
    public WorkoutPlan createWorkoutPlan(WorkoutPlan workoutPlan) {
        User currentUser = userService.getCurrentUser();
        workoutPlan.setUser(currentUser);
        return workoutPlanRepository.save(workoutPlan);
    }

    @Transactional(readOnly = true)
    public List<Exercise> getExercisesByCategory(String category) {
        try {
            log.info("Fetching exercises for category: '{}'", category);
            // Check if category exists first
            Optional<ExerciseCategoryEntity> categoryEntity = exerciseCategoryRepository.findByName(category);
            if (categoryEntity.isEmpty()) {
                log.warn("Category '{}' not found in database", category);
                return List.of();
            }
            // Use category name query instead of entity to avoid relationship issues
            List<Exercise> exercises = exerciseRepository.findByCategoryName(category);
            log.info("Found {} exercises for category '{}'", exercises.size(), category);
            return exercises;
        } catch (Exception e) {
            log.error("Error fetching exercises for category '{}': {}", category, e.getMessage(), e);
            return List.of();
        }
    }

    @Transactional(readOnly = true)
    public List<String> getExerciseTypes() {
        log.info("Fetching available exercise types");
        try {
            List<ExerciseCategoryEntity> categories = exerciseCategoryRepository.findAll();
            List<String> types = categories.stream()
                    .map(ExerciseCategoryEntity::getName)
                    .toList();
            log.info("Available exercise types: {}", types);
            return types;
        } catch (Exception e) {
            log.error("Error fetching exercise types: {}", e.getMessage());
            return Arrays.asList("AEROBIC", "STRENGTH", "FLEXIBILITY", "BALANCE");
        }
    }

    @Transactional(readOnly = true)
    public List<WorkoutPlan> getTodayWorkoutPlans() {
        User currentUser = userService.getCurrentUser();
        java.time.LocalDate today = java.time.LocalDate.now();
        log.info("Getting today's workouts for user {} (ID: {}) on date {}", 
                 currentUser.getEmail(), currentUser.getId(), today);
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserAndWorkoutDate(currentUser, today);
        log.info("Found {} workout plans for today", plans.size());
        return plans;
    }

    @Transactional(readOnly = true)
    public List<WorkoutPlan> getUserWorkoutPlans() {
        User currentUser = userService.getCurrentUser();
        return workoutPlanRepository.findByUser(currentUser);
    }

    @Transactional(readOnly = true)
    public List<WorkoutPlan> getActiveWorkoutPlans() {
        User currentUser = userService.getCurrentUser();
        return workoutPlanRepository.findByUserAndActiveStatus(currentUser, WorkoutPlan.ActiveStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public WorkoutPlan getWorkoutPlanById(Long id) {
        WorkoutPlan workoutPlan = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout plan not found with id: " + id));
        
        User currentUser = userService.getCurrentUser();
        if (!workoutPlan.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied: You can only access your own workout Plans");
        }
        
        return workoutPlan;
    }

    @Transactional
    public WorkoutPlan updateWorkoutPlan(Long id, WorkoutPlan workoutPlanDetails) {
        WorkoutPlan workoutPlan = getWorkoutPlanById(id);
        
        workoutPlan.setTitle(workoutPlanDetails.getTitle());
        workoutPlan.setDescription(workoutPlanDetails.getDescription());
        workoutPlan.setActiveStatus(workoutPlanDetails.getActiveStatus());
        
        return workoutPlanRepository.save(workoutPlan);
    }

    @Transactional
    public void deleteWorkoutPlan(Long id) {
        WorkoutPlan workoutPlan = getWorkoutPlanById(id);
        workoutPlanRepository.delete(workoutPlan);
    }

    @Transactional
    public WorkoutPlan completeWorkoutPlan(Long id) {
        WorkoutPlan workoutPlan = getWorkoutPlanById(id);
        workoutPlan.setActiveStatus(WorkoutPlan.ActiveStatus.COMPLETED);
        log.info("Workout plan {} marked as completed", id);
        return workoutPlanRepository.save(workoutPlan);
    }

    @Transactional
    public int autoCompleteExpiredWorkouts() {
        try {
            User currentUser = userService.getCurrentUser();
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalTime currentTime = java.time.LocalTime.now();
            
            log.info("Auto-completing workouts for user {} at {} on {}", 
                    currentUser.getEmail(), currentTime, today);
            
            // Find all active workouts that have passed their end time
            java.util.List<WorkoutPlan> expiredWorkouts = workoutPlanRepository
                    .findByUserAndActiveStatusAndWorkoutDateLessThanEqual(currentUser, WorkoutPlan.ActiveStatus.ACTIVE, today);
            
            log.info("Found {} active workouts to check for auto-completion", expiredWorkouts.size());
            
            int completedCount = 0;
            for (WorkoutPlan workout : expiredWorkouts) {
                // Check if workout date is in the past OR (today AND end time has passed)
                if (workout.getWorkoutDate().isBefore(today) || 
                    (workout.getWorkoutDate().equals(today) && workout.getEndTime().isBefore(currentTime))) {
                    workout.setActiveStatus(WorkoutPlan.ActiveStatus.COMPLETED);
                    workoutPlanRepository.save(workout);
                    completedCount++;
                    log.info("Auto-completed workout plan {}", workout.getId());
                }
            }
            
            if (completedCount > 0) {
                log.info("Auto-completed {} expired workout(s)", completedCount);
            }
            
            return completedCount;
        } catch (Exception e) {
            log.error("Error in autoCompleteExpiredWorkouts: {}", e.getMessage(), e);
            throw e;
        }
    }
}
