<?php

namespace Database\Seeders;

use App\Models\BoardColumn;
use App\Models\Department;
use App\Models\DepartmentDocument;
use App\Models\Milestone;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use App\Models\TaskChecklist;
use App\Models\TaskComment;
use App\Models\TaskActivity;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Users
        $admin = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $amir = User::firstOrCreate(
            ['email' => 'amir@aero.test'],
            [
                'name' => 'Amir Muse',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $omar = User::firstOrCreate(
            ['email' => 'omar@aero.test'],
            [
                'name' => 'Omar Nor',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $sarah = User::firstOrCreate(
            ['email' => 'sarah@aero.test'],
            [
                'name' => 'Sarah Alex',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Default Workspace
        $workspace = Workspace::firstOrCreate(
            ['slug' => 'aero-core'],
            [
                'name' => 'Aero Core Workspace',
                'owner_id' => $admin->id,
            ]
        );

        $workspace->members()->syncWithoutDetaching([
            $admin->id => ['role' => 'owner'],
            $amir->id => ['role' => 'admin'],
            $omar->id => ['role' => 'member'],
            $sarah->id => ['role' => 'member'],
        ]);

        // 2b. Create Departments
        $deptEng = Department::firstOrCreate(
            ['code' => 'ENG', 'workspace_id' => $workspace->id],
            [
                'name' => 'Engineering & Infrastructure',
                'slug' => 'engineering-infrastructure',
                'description' => 'Responsible for core web platform architecture, cloud systems, and real-time backend microservices.',
                'director_id' => $admin->id,
                'location' => 'Building A - 3rd Floor (HQ)',
                'status' => 'active',
            ]
        );

        $deptProduct = Department::firstOrCreate(
            ['code' => 'PDX', 'workspace_id' => $workspace->id],
            [
                'name' => 'Product Design & UX',
                'slug' => 'product-design-ux',
                'description' => 'Crafting high-density visual interfaces, user experience workflows, and design token design systems.',
                'director_id' => $amir->id,
                'location' => 'Building B - 2nd Floor',
                'status' => 'active',
            ]
        );

        $deptOps = Department::firstOrCreate(
            ['code' => 'OPS', 'workspace_id' => $workspace->id],
            [
                'name' => 'Operations & Strategy',
                'slug' => 'operations-strategy',
                'description' => 'Managing sprint coordination, client onboarding, and organizational growth compliance.',
                'director_id' => $omar->id,
                'location' => 'Remote / Distributed',
                'status' => 'active',
            ]
        );

        $admin->update(['department_id' => $deptEng->id]);
        $amir->update(['department_id' => $deptProduct->id]);
        $omar->update(['department_id' => $deptOps->id]);
        $sarah->update(['department_id' => $deptEng->id]);

        // 2c. Seed Department Documents & Files
        DepartmentDocument::firstOrCreate(
            ['file_path' => 'documents/engineering_charter.pdf'],
            [
                'department_id' => $deptEng->id,
                'name' => 'System Architecture & Cloud Security Charter.pdf',
                'file_type' => 'pdf',
                'file_size' => 2516582, // 2.4 MB
                'uploaded_by_id' => $admin->id,
            ]
        );

        DepartmentDocument::firstOrCreate(
            ['file_path' => 'documents/devops_guidelines.docx'],
            [
                'department_id' => $deptEng->id,
                'name' => 'DevOps Deployment & CI-CD Guidelines v2.4.docx',
                'file_type' => 'docx',
                'file_size' => 1153433, // 1.1 MB
                'uploaded_by_id' => $sarah->id,
            ]
        );

        DepartmentDocument::firstOrCreate(
            ['file_path' => 'documents/dr_protocol.pdf'],
            [
                'department_id' => $deptEng->id,
                'name' => 'Database Disaster Recovery Protocol 2026.pdf',
                'file_type' => 'pdf',
                'file_size' => 870400, // 850 KB
                'uploaded_by_id' => $admin->id,
            ]
        );

        DepartmentDocument::firstOrCreate(
            ['file_path' => 'documents/design_tokens.pdf'],
            [
                'department_id' => $deptProduct->id,
                'name' => 'Aero Brand & Design Tokens Specification.pdf',
                'file_type' => 'pdf',
                'file_size' => 4404019, // 4.2 MB
                'uploaded_by_id' => $amir->id,
            ]
        );

        DepartmentDocument::firstOrCreate(
            ['file_path' => 'documents/wcag_compliance.docx'],
            [
                'department_id' => $deptProduct->id,
                'name' => 'Accessibility & Compliance Standards (WCAG 2.1).docx',
                'file_type' => 'docx',
                'file_size' => 985600, // 940 KB
                'uploaded_by_id' => $amir->id,
            ]
        );

        DepartmentDocument::firstOrCreate(
            ['file_path' => 'documents/sprint_capacity.xlsx'],
            [
                'department_id' => $deptOps->id,
                'name' => 'Q3 Sprint Allocation & Capacity Model.xlsx',
                'file_type' => 'xlsx',
                'file_size' => 1887436, // 1.8 MB
                'uploaded_by_id' => $omar->id,
            ]
        );

        DepartmentDocument::firstOrCreate(
            ['file_path' => 'documents/vendor_audit.pdf'],
            [
                'department_id' => $deptOps->id,
                'name' => 'Vendor Security Compliance Audit 2026.pdf',
                'file_type' => 'pdf',
                'file_size' => 3250585, // 3.1 MB
                'uploaded_by_id' => $omar->id,
            ]
        );

        // 3. Create Projects
        $project1 = Project::firstOrCreate(
            ['slug' => 'aero-web-app-redesign'],
            [
                'workspace_id' => $workspace->id,
                'department_id' => $deptEng->id,
                'name' => 'Aero Web App Redesign',
                'description' => 'Rebuilding the frontend platform with Inertia.js v3, React 19, and Tailwind CSS v4.',
                'status' => 'ongoing',
                'lead_id' => $admin->id,
                'start_date' => now()->subDays(10),
                'due_date' => now()->addDays(30),
                'is_starred' => true,
            ]
        );

        // 3b. Create Milestones
        $milestone1 = Milestone::create([
            'workspace_id' => $workspace->id,
            'project_id' => $project1->id,
            'name' => 'Beta V1.0 Core Release Gate',
            'description' => 'Shipped core navigation, task details, and sprint planning engine.',
            'due_date' => now()->addDays(15),
            'status' => 'active',
        ]);

        $milestone2 = Milestone::create([
            'workspace_id' => $workspace->id,
            'project_id' => $project1->id,
            'name' => 'Production V1.5 Hardening',
            'description' => 'Perform load testing, security audits, and multi-tenant workspace isolation tests.',
            'due_date' => now()->addDays(40),
            'status' => 'active',
        ]);

        $project2 = Project::firstOrCreate(
            ['slug' => 'api-service-v2-architecture'],
            [
                'workspace_id' => $workspace->id,
                'department_id' => $deptEng->id,
                'name' => 'API Service v2 Architecture',
                'description' => 'High-throughput microservice backend for core real-time events.',
                'status' => 'ongoing',
                'lead_id' => $amir->id,
                'start_date' => now()->subDays(5),
                'due_date' => now()->addDays(45),
                'is_starred' => true,
            ]
        );

        $project3 = Project::firstOrCreate(
            ['slug' => 'payment-billing-gateway'],
            [
                'workspace_id' => $workspace->id,
                'department_id' => $deptProduct->id,
                'name' => 'Payment & Billing Gateway',
                'description' => 'Integrating multi-currency subscription billing and Stripe webhooks.',
                'status' => 'planned',
                'lead_id' => $omar->id,
                'start_date' => now()->addDays(5),
                'due_date' => now()->addDays(60),
                'is_starred' => false,
            ]
        );

        foreach ([$project1, $project2, $project3] as $p) {
            $p->members()->syncWithoutDetaching([
                $admin->id => ['role' => 'lead'],
                $amir->id => ['role' => 'contributor'],
                $omar->id => ['role' => 'contributor'],
                $sarah->id => ['role' => 'viewer'],
            ]);
        }

        // 4. Create Board Columns for Project 1
        $cols = [
            ['name' => 'Backlog', 'color' => '#64748B', 'position' => 1],
            ['name' => 'To Do', 'color' => '#3B82F6', 'position' => 2],
            ['name' => 'In Progress', 'color' => '#F59E0B', 'position' => 3],
            ['name' => 'In Review', 'color' => '#8B5CF6', 'position' => 4],
            ['name' => 'Done', 'color' => '#10B981', 'position' => 5],
        ];

        $columnModels = [];
        foreach ($cols as $col) {
            $columnModels[$col['name']] = BoardColumn::firstOrCreate(
                ['project_id' => $project1->id, 'name' => $col['name']],
                [
                    'color' => $col['color'],
                    'position' => $col['position'],
                ]
            );
        }

        // 5. Create Active Sprint
        $sprint = Sprint::firstOrCreate(
            ['project_id' => $project1->id, 'name' => 'Sprint 14 - Dark UI & Navigation'],
            [
                'workspace_id' => $workspace->id,
                'goal' => 'Ship the main navigation shell, Projects Drawer, and Task Detail Modal.',
                'status' => 'active',
                'start_date' => now()->subDays(3),
                'end_date' => now()->addDays(11),
            ]
        );

        // 6. Create Seed Tasks
        $task1 = Task::firstOrCreate(
            ['project_id' => $project1->id, 'title' => 'Build high-density dark navigation sidebar with Starred Projects'],
            [
                'workspace_id' => $workspace->id,
                'board_column_id' => $columnModels['In Progress']->id,
                'sprint_id' => $sprint->id,
                'description' => "Implement the primary navigation sidebar adhering to the Idaara visual layout.\nInclude group headings (`WORKSPACE`, `PROJECTS`, `SYSTEM`) and quick 1-click starred project shortcuts.",
                'type' => 'feature',
                'priority' => 'high',
                'story_points' => 5,
                'creator_id' => $admin->id,
                'assignee_id' => $admin->id,
                'due_date' => now(), // Due Today
                'git_branch' => 'feat/sidebar-starred-projects',
                'position' => 1,
            ]
        );

        TaskChecklist::firstOrCreate(
            ['task_id' => $task1->id, 'title' => 'Design layout structure with Tailwind v4'],
            ['is_completed' => true, 'position' => 1]
        );
        TaskChecklist::firstOrCreate(
            ['task_id' => $task1->id, 'title' => 'Add slide-out Projects Drawer trigger'],
            ['is_completed' => true, 'position' => 2]
        );
        TaskChecklist::firstOrCreate(
            ['task_id' => $task1->id, 'title' => 'Connect Inertia router links'],
            ['is_completed' => false, 'position' => 3]
        );

        TaskComment::firstOrCreate(
            ['task_id' => $task1->id, 'content' => 'Make sure the slide-out drawer has auto-focus on the search input when opened!'],
            ['user_id' => $amir->id]
        );

        $task2 = Task::firstOrCreate(
            ['project_id' => $project1->id, 'title' => 'Fix hydration mismatch on Ctrl+K Command Palette shortcut listener'],
            [
                'workspace_id' => $workspace->id,
                'board_column_id' => $columnModels['To Do']->id,
                'sprint_id' => $sprint->id,
                'description' => 'Ensure the global keyboard event listener registers cleanly inside React 19 useEffect hook.',
                'type' => 'bug',
                'priority' => 'urgent',
                'story_points' => 3,
                'creator_id' => $amir->id,
                'assignee_id' => $admin->id,
                'due_date' => now()->subDays(1), // Overdue!
                'git_branch' => 'fix/command-palette-hydration',
                'position' => 1,
            ]
        );

        $task3 = Task::firstOrCreate(
            ['project_id' => $project1->id, 'title' => 'Integrate Inertia v3 optimistic updates on Kanban drag-and-drop'],
            [
                'workspace_id' => $workspace->id,
                'board_column_id' => $columnModels['In Review']->id,
                'sprint_id' => $sprint->id,
                'description' => 'Use router.patch with optimistic state manipulation so cards move smoothly before server responds.',
                'type' => 'improvement',
                'priority' => 'high',
                'story_points' => 8,
                'creator_id' => $admin->id,
                'assignee_id' => $amir->id,
                'due_date' => now()->addDays(2),
                'git_branch' => 'feat/optimistic-kanban',
                'position' => 1,
            ]
        );

        $task4 = Task::firstOrCreate(
            ['project_id' => $project1->id, 'title' => 'Configure initial Database Migrations and Workspace model'],
            [
                'workspace_id' => $workspace->id,
                'board_column_id' => $columnModels['Done']->id,
                'sprint_id' => $sprint->id,
                'description' => 'Setup workspaces, projects, board_columns, sprints, tasks, and sub-tables.',
                'type' => 'task',
                'priority' => 'medium',
                'story_points' => 3,
                'creator_id' => $admin->id,
                'assignee_id' => $omar->id,
                'due_date' => now()->subDays(2),
                'position' => 1,
            ]
        );

        // 7. Seed Task & System Audit Activities
        TaskActivity::firstOrCreate(
            ['task_id' => $task1->id, 'action' => 'task_created'],
            [
                'user_id' => $admin->id,
                'details' => ['title' => $task1->title, 'priority' => 'high'],
                'created_at' => now()->subHours(5),
            ]
        );

        TaskActivity::firstOrCreate(
            ['task_id' => $task1->id, 'action' => 'status_changed'],
            [
                'user_id' => $admin->id,
                'details' => ['from' => 'To Do', 'to' => 'In Progress'],
                'created_at' => now()->subHours(3),
            ]
        );

        TaskActivity::firstOrCreate(
            ['task_id' => $task1->id, 'action' => 'comment_added'],
            [
                'user_id' => $amir->id,
                'details' => ['comment' => 'Make sure the slide-out drawer has auto-focus on the search input when opened!'],
                'created_at' => now()->subHours(2),
            ]
        );

        TaskActivity::firstOrCreate(
            ['task_id' => $task2->id, 'action' => 'task_created'],
            [
                'user_id' => $amir->id,
                'details' => ['title' => $task2->title, 'priority' => 'urgent'],
                'created_at' => now()->subDay(),
            ]
        );

        TaskActivity::firstOrCreate(
            ['task_id' => $task3->id, 'action' => 'task_updated'],
            [
                'user_id' => $admin->id,
                'details' => ['field' => 'story_points', 'value' => 8],
                'created_at' => now()->subDays(2),
            ]
        );

        TaskActivity::create([
            'task_id' => $task4->id,
            'user_id' => $omar->id,
            'action' => 'status_changed',
            'details' => ['from' => 'In Review', 'to' => 'Done'],
            'created_at' => now()->subDays(3),
        ]);
    }
}
