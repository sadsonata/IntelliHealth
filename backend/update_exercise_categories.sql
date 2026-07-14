-- Update exercise categories from CARDIO to AEROBIC to match backend enum changes
UPDATE exercises SET category = 'AEROBIC' WHERE category = 'CARDIO';

-- Verify the update
SELECT COUNT(*) FROM exercises WHERE category = 'AEROBIC';
SELECT COUNT(*) FROM exercises WHERE category = 'CARDIO';
