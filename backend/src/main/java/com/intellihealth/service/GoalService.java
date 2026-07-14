package com.intellihealth.service;

import com.intellihealth.entity.Goal;
import com.intellihealth.entity.User;
import com.intellihealth.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserService userService;

    @Transactional
    public Goal createGoal(Goal goal) {
        User currentUser = userService.getCurrentUser();
        goal.setUser(currentUser);
        return goalRepository.save(goal);
    }

    @Transactional(readOnly = true)
    public List<Goal> getUserGoals() {
        User currentUser = userService.getCurrentUser();
        return goalRepository.findByUser(currentUser);
    }

    @Transactional(readOnly = true)
    public Goal getGoalById(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));
        
        User currentUser = userService.getCurrentUser();
        if (!goal.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied: You can only access your own goals");
        }
        
        return goal;
    }

    @Transactional
    public Goal updateGoal(Long id, Goal goalDetails) {
        Goal goal = getGoalById(id);
        
        goal.setTitle(goalDetails.getTitle());
        goal.setTargetMetric(goalDetails.getTargetMetric());
        goal.setTargetValue(goalDetails.getTargetValue());
        goal.setDeadline(goalDetails.getDeadline());
        goal.setStatus(goalDetails.getStatus());
        
        return goalRepository.save(goal);
    }

    @Transactional
    public void deleteGoal(Long id) {
        Goal goal = getGoalById(id);
        goalRepository.delete(goal);
    }
}
