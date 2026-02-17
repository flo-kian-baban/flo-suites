-- Migration: Add client_decision_at column and scoped RLS policy for client_media
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Add client_decision_at column
ALTER TABLE client_media
  ADD COLUMN IF NOT EXISTS client_decision_at timestamptz;

-- 2. Add scoped authenticated UPDATE policy
-- This allows portal users to update only their own client's media items
CREATE POLICY "auth_update_own_client_media"
  ON client_media
  FOR UPDATE
  TO authenticated
  USING (
    client_id IN (
      SELECT portal_user_clients.client_id
      FROM portal_user_clients
      WHERE portal_user_clients.user_id = auth.uid()
        AND portal_user_clients.is_active = true
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT portal_user_clients.client_id
      FROM portal_user_clients
      WHERE portal_user_clients.user_id = auth.uid()
        AND portal_user_clients.is_active = true
    )
  );
