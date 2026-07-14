-- Update workout_photo_url column to support longer URLs
ALTER TABLE workout_plans MODIFY COLUMN workout_photo_url TEXT(1000);
