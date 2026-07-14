package com.intellihealth.dto;

import com.intellihealth.entity.WorkoutPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlanDTO {
    private Long id;
    private String title;
    private String description;
    private String exerciseType;
    private Long exerciseId;
    private String exerciseName;
    private LocalDate workoutDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String comments;
    private String workoutPhotoUrl;
    private WorkoutPlan.ActiveStatus activeStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
