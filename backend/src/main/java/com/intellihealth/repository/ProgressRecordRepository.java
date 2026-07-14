package com.intellihealth.repository;

import com.intellihealth.entity.ProgressRecord;
import com.intellihealth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProgressRecordRepository extends JpaRepository<ProgressRecord, Long> {
    List<ProgressRecord> findByUser(User user);
    List<ProgressRecord> findByUserId(Long userId);
    List<ProgressRecord> findByUserAndRecordDateBetween(User user, LocalDate startDate, LocalDate endDate);
    List<ProgressRecord> findByGoalId(Long goalId);
}
