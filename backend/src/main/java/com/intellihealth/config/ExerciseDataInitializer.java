package com.intellihealth.config;

import com.intellihealth.entity.Exercise;
import com.intellihealth.entity.ExerciseCategoryEntity;
import com.intellihealth.repository.ExerciseRepository;
import com.intellihealth.repository.ExerciseCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ExerciseDataInitializer {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseCategoryRepository exerciseCategoryRepository;

    @Bean
    @Transactional
    public CommandLineRunner initializeExerciseData() {
        return args -> {
            if (exerciseRepository.count() == 0) {
                log.info("Initializing exercise library with default exercises...");
                
                // Create exercise categories first
                ExerciseCategoryEntity aerobicCategory = exerciseCategoryRepository.save(
                    ExerciseCategoryEntity.builder()
                        .name("AEROBIC")
                        .build()
                );
                
                ExerciseCategoryEntity strengthCategory = exerciseCategoryRepository.save(
                    ExerciseCategoryEntity.builder()
                        .name("STRENGTH")
                        .build()
                );
                
                ExerciseCategoryEntity flexibilityCategory = exerciseCategoryRepository.save(
                    ExerciseCategoryEntity.builder()
                        .name("FLEXIBILITY")
                        .build()
                );
                
                ExerciseCategoryEntity balanceCategory = exerciseCategoryRepository.save(
                    ExerciseCategoryEntity.builder()
                        .name("BALANCE")
                        .build()
                );
                
                // Aerobic exercises
                List<Exercise> aerobicExercises = Arrays.asList(
                    Exercise.builder()
                        .name("Running")
                        .description("Classic cardiovascular exercise that improves endurance and burns calories")
                        .category(aerobicCategory)
                        .muscleGroup(Exercise.MuscleGroup.FULL_BODY)
                        .build(),
                    Exercise.builder()
                        .name("Cycling")
                        .description("Low-impact cardio exercise that strengthens legs and improves cardiovascular health")
                        .category(aerobicCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Swimming")
                        .description("Full-body, low-impact cardio exercise that builds endurance and muscle strength")
                        .category(aerobicCategory)
                        .muscleGroup(Exercise.MuscleGroup.FULL_BODY)
                        .build(),
                    Exercise.builder()
                        .name("Jumping Rope")
                        .description("High-intensity cardio exercise that improves coordination and agility")
                        .category(aerobicCategory)
                        .muscleGroup(Exercise.MuscleGroup.FULL_BODY)
                        .build(),
                    Exercise.builder()
                        .name("Burpees")
                        .description("Full-body exercise that combines strength and cardio for maximum calorie burn")
                        .category(aerobicCategory)
                        .muscleGroup(Exercise.MuscleGroup.FULL_BODY)
                        .build()
                );

                // Strength exercises
                List<Exercise> strengthExercises = Arrays.asList(
                    Exercise.builder()
                        .name("Push-ups")
                        .description("Classic bodyweight exercise that targets chest, shoulders, and triceps")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.CHEST)
                        .build(),
                    Exercise.builder()
                        .name("Squats")
                        .description("Fundamental lower body exercise that strengthens quads, glutes, and hamstrings")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Deadlifts")
                        .description("Compound exercise that works multiple muscle groups including back, legs, and core")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.BACK)
                        .build(),
                    Exercise.builder()
                        .name("Bench Press")
                        .description("Upper body exercise that primarily targets chest muscles")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.CHEST)
                        .build(),
                    Exercise.builder()
                        .name("Pull-ups")
                        .description("Upper body exercise that targets back and biceps")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.BACK)
                        .build(),
                    Exercise.builder()
                        .name("Lunges")
                        .description("Unilateral leg exercise that improves balance and strengthens lower body")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Overhead Press")
                        .description("Shoulder exercise that builds upper body strength")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.SHOULDERS)
                        .build(),
                    Exercise.builder()
                        .name("Bicep Curls")
                        .description("Isolation exercise that targets bicep muscles")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.BICEPS)
                        .build(),
                    Exercise.builder()
                        .name("Tricep Dips")
                        .description("Bodyweight exercise that targets tricep muscles")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.TRICEPS)
                        .build(),
                    Exercise.builder()
                        .name("Plank")
                        .description("Core exercise that builds stability and endurance")
                        .category(strengthCategory)
                        .muscleGroup(Exercise.MuscleGroup.CORE)
                        .build()
                );

                // Flexibility exercises
                List<Exercise> flexibilityExercises = Arrays.asList(
                    Exercise.builder()
                        .name("Forward Fold")
                        .description("Stretches hamstrings, calves, and back while promoting relaxation")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.FULL_BODY)
                        .build(),
                    Exercise.builder()
                        .name("Cat-Cow Stretch")
                        .description("Gentle spinal movement that improves flexibility and reduces back tension")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.BACK)
                        .build(),
                    Exercise.builder()
                        .name("Butterfly Stretch")
                        .description("Hip opener that stretches inner thighs and groin muscles")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Shoulder Rolls")
                        .description("Simple exercise that releases shoulder tension and improves mobility")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.SHOULDERS)
                        .build(),
                    Exercise.builder()
                        .name("Quad Stretch")
                        .description("Stretches the front of the thighs and improves hip flexibility")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Hamstring Stretch")
                        .description("Improves flexibility in the back of the legs and lower back")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Chest Stretch")
                        .description("Opens up the chest and improves posture")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.CHEST)
                        .build(),
                    Exercise.builder()
                        .name("Tricep Stretch")
                        .description("Stretches the back of the arms and improves shoulder mobility")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.TRICEPS)
                        .build(),
                    Exercise.builder()
                        .name("Child's Pose")
                        .description("Restorative yoga pose that stretches back, hips, and shoulders")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.BACK)
                        .build(),
                    Exercise.builder()
                        .name("Cobra Pose")
                        .description("Backbend that strengthens spine and opens chest")
                        .category(flexibilityCategory)
                        .muscleGroup(Exercise.MuscleGroup.BACK)
                        .build()
                );

                // Balance exercises
                List<Exercise> balanceExercises = Arrays.asList(
                    Exercise.builder()
                        .name("Single Leg Stand")
                        .description("Basic balance exercise that improves stability and ankle strength")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Tree Pose")
                        .description("Yoga balance pose that improves focus and stability")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Heel-to-Toe Walk")
                        .description("Dynamic balance exercise that improves coordination")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Flamingo Stand")
                        .description("Advanced single-leg balance exercise")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Side Leg Lift")
                        .description("Balance exercise that strengthens hip abductors")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Warrior III Pose")
                        .description("Challenging yoga balance pose that strengthens entire body")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.FULL_BODY)
                        .build(),
                    Exercise.builder()
                        .name("Single Leg Deadlift")
                        .description("Balance exercise that strengthens hamstrings and glutes")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Bosu Ball Squats")
                        .description("Unstable surface training that improves balance and stability")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.LEGS)
                        .build(),
                    Exercise.builder()
                        .name("Balance Board")
                        .description("Proprioception training that improves overall balance")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.CORE)
                        .build(),
                    Exercise.builder()
                        .name("Tai Chi Stance")
                        .description("Martial arts-inspired balance exercise that improves focus and stability")
                        .category(balanceCategory)
                        .muscleGroup(Exercise.MuscleGroup.CORE)
                        .build()
                );

                // Save all exercises
                exerciseRepository.saveAll(aerobicExercises);
                exerciseRepository.saveAll(strengthExercises);
                exerciseRepository.saveAll(flexibilityExercises);
                exerciseRepository.saveAll(balanceExercises);

                log.info("Successfully initialized {} exercises in the library", 
                    exerciseRepository.count());
            } else {
                log.info("Exercise library already contains {} exercises", exerciseRepository.count());
            }
        };
    }
}
