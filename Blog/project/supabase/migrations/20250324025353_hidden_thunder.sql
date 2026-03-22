/*
  # Remove read_time field from blog_posts

  1. Changes
    - Remove read_time column from blog_posts table as it's no longer needed

  Note: Creating a new migration instead of modifying the existing one
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'read_time'
  ) THEN
    ALTER TABLE blog_posts DROP COLUMN read_time;
  END IF;
END $$;