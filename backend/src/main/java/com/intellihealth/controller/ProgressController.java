package com.intellihealth.controller;

import com.intellihealth.entity.ProgressRecord;
import com.intellihealth.service.ProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/v1/progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping
    public ResponseEntity<ProgressRecord> createProgressRecord(@Valid @RequestBody ProgressRecord progressRecord) {
        ProgressRecord createdRecord = progressService.createProgressRecord(progressRecord);
        return ResponseEntity.ok(createdRecord);
    }

    @GetMapping
    public ResponseEntity<List<ProgressRecord>> getUserProgressRecords() {
        List<ProgressRecord> records = progressService.getUserProgressRecords();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressRecord> getProgressRecordById(@PathVariable Long id) {
        ProgressRecord record = progressService.getProgressRecordById(id);
        return ResponseEntity.ok(record);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ProgressRecord>> getProgressRecordsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ProgressRecord> records = progressService.getProgressRecordsByDateRange(startDate, endDate);
        return ResponseEntity.ok(records);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressRecord> updateProgressRecord(@PathVariable Long id, @Valid @RequestBody ProgressRecord recordDetails) {
        ProgressRecord updatedRecord = progressService.updateProgressRecord(id, recordDetails);
        return ResponseEntity.ok(updatedRecord);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressRecord(@PathVariable Long id) {
        progressService.deleteProgressRecord(id);
        return ResponseEntity.noContent().build();
    }
}
