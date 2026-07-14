package com.intellihealth.repository;

import com.intellihealth.entity.ExerciseCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExerciseCategoryRepository extends JpaRepository<ExerciseCategoryEntity, Long> {
    Optional<ExerciseCategoryEntity> findByName(String name);
}
