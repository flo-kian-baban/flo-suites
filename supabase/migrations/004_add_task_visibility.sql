-- Add visible_to_client column to project_tasks table
ALTER TABLE project_tasks 
ADD COLUMN visible_to_client boolean DEFAULT true NOT NULL;

-- Index for performance when filtering by visibility
CREATE INDEX idx_project_tasks_visible_to_client ON project_tasks(visible_to_client);
