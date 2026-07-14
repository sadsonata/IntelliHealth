package com.intellihealth.repository;

import com.intellihealth.entity.WorkoutPlan;
import com.intellihealth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findByUser(User user);
    List<WorkoutPlan> findByUserId(Long userId);
    List<WorkoutPlan> findByUserAndActiveStatus(User user, WorkoutPlan.ActiveStatus status);
    List<WorkoutPlan> findByUserAndWorkoutDate(User user, LocalDate workoutDate);
    List<WorkoutPlan> findByActiveStatus(WorkoutPlan.ActiveStatus status);
    
    @Query("SELECT w FROM WorkoutPlan w WHERE w.user = :user AND w.activeStatus = :status AND w.workoutDate <= :date")
    List<WorkoutPlan> findByUserAndActiveStatusAndWorkoutDateLessThanEqual(
            @Param("user") User user, 
            @Param("status") WorkoutPlan.ActiveStatus status, 
            @Param("date") LocalDate date);
}
