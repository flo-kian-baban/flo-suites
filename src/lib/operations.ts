import { supabase } from './supabaseClient';

// ─── Types ───────────────────────────────────────────────

export type ProjectType = 'content' | 'landing_page' | 'automation' | 'website' | 'campaign' | 'other';
export type ProjectStatus = 'active' | 'completed' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high';


export interface TaskLink {
    label: string;
    url: string;
}

// ─── Template Types ──────────────────────────────────────

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface TemplateStage {
    id: string;
    template_id: string;
    name: string;
    position: number;
    created_at: string;
}

export interface TemplateTask {
    id: string;
    stage_id: string;
    title: string;
    position: number;
    created_at: string;
}

// ─── Project Types ───────────────────────────────────────

export interface ClientProject {
    id: string;
    client_id: string;
    template_id: string | null;
    name: string;
    project_type: ProjectType;
    status: ProjectStatus;
    start_date: string | null;
    target_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectStage {
    id: string;
    project_id: string;
    name: string;
    position: number;
    created_at: string;
}

export interface ProjectTask {
    id: string;
    project_id: string;
    stage_id: string;
    title: string;
    description: string | null;
    position: number;
    // assignee_name removed
    due_date: string | null;
    priority: TaskPriority;
    is_blocked: boolean;
    blocked_reason: string | null;
    visible_to_client: boolean;

    links: TaskLink[];
    created_at: string;
    updated_at: string;
}

// ═══════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════

export async function getTemplates(): Promise<WorkflowTemplate[]> {
    const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .order('name');
    if (error) throw error;
    return (data || []) as WorkflowTemplate[];
}

export async function getTemplateWithDetails(id: string) {
    const [tmpl, stages, tasks] = await Promise.all([
        supabase.from('workflow_templates').select('*').eq('id', id).single(),
        supabase.from('workflow_template_stages').select('*').eq('template_id', id).order('position'),
        supabase.from('workflow_template_tasks').select('*').order('position'),
    ]);
    if (tmpl.error) throw tmpl.error;

    const stageIds = (stages.data || []).map((s: any) => s.id);
    const filteredTasks = (tasks.data || []).filter((t: any) => stageIds.includes(t.stage_id));

    return {
        template: tmpl.data as WorkflowTemplate,
        stages: (stages.data || []) as TemplateStage[],
        tasks: filteredTasks as TemplateTask[],
    };
}

export async function createTemplate(name: string, description?: string): Promise<string> {
    const { data, error } = await supabase
        .from('workflow_templates')
        .insert({ name, description: description || null })
        .select('id')
        .single();
    if (error || !data) throw new Error(`Failed to create template: ${error?.message}`);
    return data.id;
}

export async function updateTemplate(id: string, updates: { name?: string; description?: string }): Promise<void> {
    const { error } = await supabase
        .from('workflow_templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
}

export async function deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase.from('workflow_templates').delete().eq('id', id);
    if (error) throw error;
}

// Template Stages

export async function createTemplateStage(templateId: string, name: string, position: number): Promise<string> {
    const { data, error } = await supabase
        .from('workflow_template_stages')
        .insert({ template_id: templateId, name, position })
        .select('id')
        .single();
    if (error || !data) throw new Error(`Failed to create stage: ${error?.message}`);
    return data.id;
}

export async function updateTemplateStage(id: string, updates: { name?: string; position?: number }): Promise<void> {
    const { error } = await supabase.from('workflow_template_stages').update(updates).eq('id', id);
    if (error) throw error;
}

export async function deleteTemplateStage(id: string): Promise<void> {
    const { error } = await supabase.from('workflow_template_stages').delete().eq('id', id);
    if (error) throw error;
}

// Template Tasks

export async function createTemplateTask(stageId: string, title: string, position: number): Promise<string> {
    const { data, error } = await supabase
        .from('workflow_template_tasks')
        .insert({ stage_id: stageId, title, position })
        .select('id')
        .single();
    if (error || !data) throw new Error(`Failed to create template task: ${error?.message}`);
    return data.id;
}

export async function deleteTemplateTask(id: string): Promise<void> {
    const { error } = await supabase.from('workflow_template_tasks').delete().eq('id', id);
    if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════

export async function getClientProjects(clientId: string): Promise<ClientProject[]> {
    const { data, error } = await supabase
        .from('client_projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as ClientProject[];
}

export async function createProject(
    clientId: string,
    name: string,
    projectType: ProjectType,
    templateId?: string,
    startDate?: string,
    targetDate?: string
): Promise<string> {
    // 1. Create project
    const { data: proj, error: projErr } = await supabase
        .from('client_projects')
        .insert({
            client_id: clientId,
            template_id: templateId || null,
            name,
            project_type: projectType,
            start_date: startDate || null,
            target_date: targetDate || null,
        })
        .select('id')
        .single();
    if (projErr || !proj) throw new Error(`Failed to create project: ${projErr?.message}`);

    const projectId = proj.id;

    // 2. If template, copy stages and tasks
    if (templateId) {
        const tmplDetails = await getTemplateWithDetails(templateId);

        // Create stages and map template stage id -> project stage id
        const stageMap = new Map<string, string>();
        for (const ts of tmplDetails.stages) {
            const { data: ps, error: psErr } = await supabase
                .from('project_stages')
                .insert({ project_id: projectId, name: ts.name, position: ts.position })
                .select('id')
                .single();
            if (psErr || !ps) throw new Error(`Failed to create stage: ${psErr?.message}`);
            stageMap.set(ts.id, ps.id);
        }

        // Create tasks in mapped stages
        for (const tt of tmplDetails.tasks) {
            const projectStageId = stageMap.get(tt.stage_id);
            if (!projectStageId) continue;
            await supabase.from('project_tasks').insert({
                project_id: projectId,
                stage_id: projectStageId,
                title: tt.title,
                position: tt.position,
            });
        }
    } else {
        // Blank project: create default stages
        const defaultStages = ['To Do', 'In Progress', 'Done'];
        for (let i = 0; i < defaultStages.length; i++) {
            await supabase.from('project_stages').insert({
                project_id: projectId,
                name: defaultStages[i],
                position: i,
            });
        }
    }

    return projectId;
}

export async function updateProject(id: string, updates: Partial<Pick<ClientProject, 'name' | 'status' | 'start_date' | 'target_date'>>): Promise<void> {
    const { error } = await supabase
        .from('client_projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from('client_projects').delete().eq('id', id);
    if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// STAGES
// ═══════════════════════════════════════════════════════════

export async function getProjectStages(projectId: string): Promise<ProjectStage[]> {
    const { data, error } = await supabase
        .from('project_stages')
        .select('*')
        .eq('project_id', projectId)
        .order('position');
    if (error) throw error;
    return (data || []) as ProjectStage[];
}

export async function createStage(projectId: string, name: string, position: number): Promise<string> {
    const { data, error } = await supabase
        .from('project_stages')
        .insert({ project_id: projectId, name, position })
        .select('id')
        .single();
    if (error || !data) throw new Error(`Failed to create stage: ${error?.message}`);
    return data.id;
}

export async function updateStagePositions(stages: { id: string; position: number }[]): Promise<void> {
    for (const s of stages) {
        const { error } = await supabase
            .from('project_stages')
            .update({ position: s.position })
            .eq('id', s.id);
        if (error) throw error;
    }
}

// ═══════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════

export async function getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('position');
    if (error) throw error;
    return (data || []) as ProjectTask[];
}

export async function createTask(
    projectId: string,
    stageId: string,
    title: string,
    position: number,
    visibleToClient: boolean = true
): Promise<ProjectTask> {
    const { data, error } = await supabase
        .from('project_tasks')
        .insert({
            project_id: projectId,
            stage_id: stageId,
            title,
            position,
            visible_to_client: visibleToClient
        })
        .select('*')
        .single();
    if (error || !data) throw new Error(`Failed to create task: ${error?.message}`);
    return data as ProjectTask;
}

export async function updateTask(
    id: string,
    updates: Partial<Omit<ProjectTask, 'id' | 'project_id' | 'created_at'>>
): Promise<void> {
    const { error } = await supabase
        .from('project_tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
}

export async function moveTask(
    taskId: string,
    newStageId: string,
    newPosition: number
): Promise<void> {
    const { error } = await supabase
        .from('project_tasks')
        .update({ stage_id: newStageId, position: newPosition, updated_at: new Date().toISOString() })
        .eq('id', taskId);
    if (error) throw error;
}

export async function deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from('project_tasks').delete().eq('id', id);
    if (error) throw error;
}

// ─── Helpers ─────────────────────────────────────────────

export function getProjectProgress(tasks: ProjectTask[], stages: ProjectStage[]): number {
    if (tasks.length === 0) return 0;
    const lastStage = stages[stages.length - 1];
    if (!lastStage) return 0;
    const doneTasks = tasks.filter((t) => t.stage_id === lastStage.id).length;
    return Math.round((doneTasks / tasks.length) * 100);
}

export function getOverdueCount(tasks: ProjectTask[]): number {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter((t) => t.due_date && t.due_date < today).length;
}

export function getBlockedCount(tasks: ProjectTask[]): number {
    return tasks.filter((t) => t.is_blocked).length;
}
