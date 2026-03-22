/*
  # Add content_images column to blog_posts table

  1. Changes
    - Add content_images column to store multiple image URLs for each blog post
    
  2. Notes
    - Uses text[] to store an array of image URLs
    - Default to empty array if no content images
*/

ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS content_images text[] DEFAULT '{}';