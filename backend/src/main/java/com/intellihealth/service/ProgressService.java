package com.intellihealth.service;

import com.intellihealth.entity.Goal;
import com.intellihealth.entity.ProgressRecord;
import com.intellihealth.entity.User;
import com.intellihealth.repository.ProgressRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRecordRepository progressRecordRepository;
    private final UserService userService;

    @Transactional
    public ProgressRecord createProgressRecord(ProgressRecord progressRecord) {
        User currentUser = userService.getCurrentUser();
        progressRecord.setUser(currentUser);
        
        if (progressRecord.getGoal() != null) {
            Goal goal = progressRecord.getGoal();
            if (!goal.getUser().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access denied: You can only create progress for your own goals");
            }
        }
        
        return progressRecordRepository.save(progressRecord);
    }

    @Transactional(readOnly = true)
    public List<ProgressRecord> getUserProgressRecords() {
        User currentUser = userService.getCurrentUser();
        return progressRecordRepository.findByUser(currentUser);
    }

    @Transactional(readOnly = true)
    public ProgressRecord getProgressRecordById(Long id) {
        ProgressRecord record = progressRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Progress record not found with id: " + id));
        
        User currentUser = userService.getCurrentUser();
        if (!record.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied: You can only access your own progress records");
        }
        
        return record;
    }

    @Transactional(readOnly = true)
    public List<ProgressRecord> getProgressRecordsByDateRange(LocalDate startDate, LocalDate endDate) {
        User currentUser = userService.getCurrentUser();
        return progressRecordRepository.findByUserAndRecordDateBetween(currentUser, startDate, endDate);
    }

    @Transactional
    public ProgressRecord updateProgressRecord(Long id, ProgressRecord recordDetails) {
        ProgressRecord record = getProgressRecordById(id);
        
        record.setRecordDate(recordDetails.getRecordDate());
        record.setMetricName(recordDetails.getMetricName());
        record.setMetricValue(recordDetails.getMetricValue());
        record.setNotes(recordDetails.getNotes());
        
        if (recordDetails.getGoal() != null) {
            Goal goal = recordDetails.getGoal();
            User currentUser = userService.getCurrentUser();
            if (!goal.getUser().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access denied: You can only link to your own goals");
            }
            record.setGoal(goal);
        }
        
        return progressRecordRepository.save(record);
    }

    @Transactional
    public void deleteProgressRecord(Long id) {
        ProgressRecord record = getProgressRecordById(id);
        progressRecordRepository.delete(record);
    }
}
