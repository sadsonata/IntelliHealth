package com.intellihealth.controller;

import com.intellihealth.entity.Goal;
import com.intellihealth.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/goals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<Goal> createGoal(@Valid @RequestBody Goal goal) {
        Goal createdGoal = goalService.createGoal(goal);
        return ResponseEntity.ok(createdGoal);
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getUserGoals() {
        List<Goal> goals = goalService.getUserGoals();
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Goal> getGoalById(@PathVariable Long id) {
        Goal goal = goalService.getGoalById(id);
        return ResponseEntity.ok(goal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @Valid @RequestBody Goal goalDetails) {
        Goal updatedGoal = goalService.updateGoal(id, goalDetails);
        return ResponseEntity.ok(updatedGoal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}
