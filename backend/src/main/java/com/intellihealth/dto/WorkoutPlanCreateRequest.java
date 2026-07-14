package com.intellihealth.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlanCreateRequest {
    
    @NotNull(message = "Exercise type is required")
    private String exerciseType;
    
    @NotNull(message = "Exercise is required")
    private Long exerciseId;
    
    @NotNull(message = "Workout date is required")
    @FutureOrPresent(message = "Workout date must be today or in the future")
    private java.time.LocalDate workoutDate;
    
    @NotNull(message = "Start time is required")
    private java.time.LocalTime startTime;
    
    @NotNull(message = "End time is required")
    private java.time.LocalTime endTime;
    
    @Size(max = 1000, message = "Comments must not exceed 1000 characters")
    private String comments;
    
    private String workoutPhotoUrl;
    
    private String title;
    private String description;
}
