package com.intellihealth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "workout_plans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "exercise_type", nullable = false)
    private String exerciseType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
    
    @Column(name = "workout_date", nullable = false)
    private LocalDate workoutDate;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(columnDefinition = "TEXT")
    private String comments;
    
    @Column(name = "workout_photo_url", columnDefinition = "TEXT", nullable = true)
    private String workoutPhotoUrl;
    
    @Column(name = "active_status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ActiveStatus activeStatus = ActiveStatus.ACTIVE;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum ActiveStatus {
        ACTIVE, IN_PROGRESS, COMPLETED, INACTIVE, ARCHIVED
    }
}
