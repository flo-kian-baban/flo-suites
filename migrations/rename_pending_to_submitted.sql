-- Migration: Rename media status 'pending' → 'submitted'
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Migrate existing data
UPDATE client_media SET status = 'submitted' WHERE status = 'pending';

-- 2. Drop old constraint and add new one
ALTER TABLE client_media DROP CONSTRAINT IF EXISTS client_media_status_check;
ALTER TABLE client_media ADD CONSTRAINT client_media_status_check
  CHECK (status = ANY (ARRAY['draft','scheduled','submitted','approved','declined']));
