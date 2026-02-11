'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { ProjectType, ProjectStage, ProjectTask, getTemplateWithDetails } from '@/lib/operations';

// ─── Projects ──────────────────────────────────────────────

export async function getAdminClientProjects(clientId: string) {
    const { data, error } = await supabaseAdmin
        .from('client_projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
    if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
    return data;
}

export async function createAdminProject(
    clientId: string,
    name: string,
    projectType: ProjectType,
    templateId?: string,
    startDate?: string,
    targetDate?: string
) {
    // 1. Create project
    const { data: proj, error: projErr } = await supabaseAdmin
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
    // Note: getTemplateWithDetails uses 'supabaseClient' (anon) inside lib/operations.ts!
    // We should copy that logic here or make sure it's accessible. 
    // Templates might be public (anon read allow)? If so, reusing lib function is ok.
    // If not, we need admin version. Let's assume templates are protected and reimplement here to be safe.

    if (templateId) {
        // Re-implement getTemplateWithDetails with admin
        const [stagesRes, tasksRes] = await Promise.all([
            supabaseAdmin.from('workflow_template_stages').select('*').eq('template_id', templateId).order('position'),
            supabaseAdmin.from('workflow_template_tasks').select('*').order('position'),
        ]);

        if (stagesRes.error) throw stagesRes.error;
        const stages = stagesRes.data || [];
        const stageIds = stages.map((s: any) => s.id);
        const tasks = (tasksRes.data || []).filter((t: any) => stageIds.includes(t.stage_id));

        // Create stages and map template stage id -> project stage id
        const stageMap = new Map<string, string>();
        for (const ts of stages) {
            const { data: ps, error: psErr } = await supabaseAdmin
                .from('project_stages')
                .insert({ project_id: projectId, name: ts.name, position: ts.position })
                .select('id')
                .single();
            if (psErr || !ps) throw new Error(`Failed to create stage: ${psErr?.message}`);
            stageMap.set(ts.id, ps.id);
        }

        // Create tasks in mapped stages
        for (const tt of tasks) {
            const projectStageId = stageMap.get(tt.stage_id);
            if (!projectStageId) continue;
            await supabaseAdmin.from('project_tasks').insert({
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
            await supabaseAdmin.from('project_stages').insert({
                project_id: projectId,
                name: defaultStages[i],
                position: i,
            });
        }
    }

    revalidatePath(`/admin/clients/${clientId}`);
    return projectId;
}

export async function updateAdminProject(id: string, updates: any) {
    const { error } = await supabaseAdmin
        .from('client_projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw new Error(`Failed to update project: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

export async function deleteAdminProject(id: string) {
    const { error } = await supabaseAdmin.from('client_projects').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete project: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

// ─── Stages ────────────────────────────────────────────────

export async function getAdminProjectStages(projectId: string) {
    const { data, error } = await supabaseAdmin
        .from('project_stages')
        .select('*')
        .eq('project_id', projectId)
        .order('position');
    if (error) throw new Error(`Failed to fetch stages: ${error.message}`);
    return data;
}

export async function createAdminStage(projectId: string, name: string, position: number) {
    const { data, error } = await supabaseAdmin
        .from('project_stages')
        .insert({ project_id: projectId, name, position })
        .select('id')
        .single();
    if (error || !data) throw new Error(`Failed to create stage: ${error?.message}`);
    revalidatePath(`/admin`);
    return data.id;
}

export async function updateAdminStagePositions(stages: { id: string; position: number }[]) {
    for (const s of stages) {
        const { error } = await supabaseAdmin
            .from('project_stages')
            .update({ position: s.position })
            .eq('id', s.id);
        if (error) throw error;
    }
    revalidatePath(`/admin`);
}

// ─── Tasks ─────────────────────────────────────────────────

export async function getAdminProjectTasks(projectId: string) {
    const { data, error } = await supabaseAdmin
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('position');
    if (error) throw new Error(`Failed to fetch tasks: ${error.message}`);
    return data;
}

export async function createAdminTask(
    projectId: string,
    stageId: string,
    title: string,
    position: number,
    visibleToClient: boolean = true
) {
    const { data, error } = await supabaseAdmin
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
    revalidatePath(`/admin`);
    return data;
}

export async function updateAdminTask(id: string, updates: any) {
    const { error } = await supabaseAdmin
        .from('project_tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw new Error(`Failed to update task: ${error.message}`);
    revalidatePath(`/admin`);
}

export async function moveAdminTask(taskId: string, newStageId: string, newPosition: number) {
    const { error } = await supabaseAdmin
        .from('project_tasks')
        .update({ stage_id: newStageId, position: newPosition, updated_at: new Date().toISOString() })
        .eq('id', taskId);
    if (error) throw new Error(`Failed to move task: ${error.message}`);
    revalidatePath(`/admin`);
}

export async function deleteAdminTask(id: string) {
    const { error } = await supabaseAdmin.from('project_tasks').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete task: ${error.message}`);
    revalidatePath(`/admin`);
}
