-- Add description column to client_media (carries shot list notes)
ALTER TABLE client_media ADD COLUMN IF NOT EXISTS description TEXT;
