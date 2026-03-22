/*
  # Blog Posts Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `excerpt` (text, required)
      - `content` (text, required)
      - `image_url` (text, required)
      - `read_time` (text, required)
      - `created_at` (timestamp with timezone)
      - `author_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for:
      - Public read access to all posts
      - Authenticated users can create/update their own posts
*/

CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  read_time text NOT NULL,
  created_at timestamptz DEFAULT now(),
  author_id uuid REFERENCES auth.users(id)
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all posts
CREATE POLICY "Posts are viewable by everyone" ON blog_posts
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create their own posts
CREATE POLICY "Users can create their own posts" ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts" ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);