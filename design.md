# Aero DevPM - Design System & Architecture Specification

Aero is a modern, high-density, developer-focused Project Management Platform built on **Laravel 13**, **Inertia.js v3**, **React 19**, and **Tailwind CSS v4**. This document details the design system, layout rules, component hierarchy, and system architecture.

---

## 1. Design Philosophy & Visual Tokens

### A. Color Palette
Aero uses a deep, rich dark-mode visual system designed for high data density and low eye strain during long engineering sessions.

* **Canvas / Background**: `bg-slate-950` (`#0B0F17`)
* **Elevated Cards & Containers**: `bg-slate-900` (`#0F172A` / `#161E2E`)
* **Borders & Dividers**: `border-slate-800` (`#1E293B`) / `border-slate-800/80`
* **Primary Accent (Electric Blue)**: `bg-blue-600` / `text-blue-400` (`#3B82F6`)
* **Success / Completion (Emerald Green)**: `bg-emerald-500` / `text-emerald-400` (`#10B981`)
* **Warning / Pending (Amber)**: `bg-amber-500` / `text-amber-400` (`#F59E0B`)
* **Critical / Overdue (Rose Red)**: `bg-rose-500` / `text-rose-400` (`#EF4444`)
* **Feature / Git Ref (Purple)**: `bg-purple-500` / `text-purple-400` (`#8B5CF6`)

### B. Typography & Micro-Interactions
* **Font Family**: Instrument Sans / Inter / System Sans-Serif font stack.
* **Code & References**: Monospace font (`font-mono`) for task IDs (`TASK-1`), Git branches (`feat/sidebar-starred-projects`), timestamps, and percentage indicators.
* **Pill Badges**: Rounded full pills (`rounded-full`) for status indicators, roles, and quick filter triggers.

---

## 2. Navigation & Layout Architecture

### A. Single Top-Level Layout Strategy
To prevent double sidebars or duplicate navbars, Inertia's `createInertiaApp` in `resources/js/app.tsx` applies `AppLayout` at the root. Individual page components return their content directly without nesting `<AppLayout>` in JSX.

```
+-----------------------------------------------------------------------------------+
| TOP NAVBAR (AppSidebarHeader.tsx)                                                 |
| [⚡ Aero] | [Breadcrumbs]      [🔍 Search here... ⌘K] [⚙️]    [☀️/🌙] [🔔] [👤 Profile] |
+------------------------------------+----------------------------------------------+
| SIDEBAR (AppSidebar.tsx)           | MAIN CONTENT AREA (Page View)                |
| w-64 fixed width                   |                                              |
|                                    |  Dashboard / My Desk / Projects Hub / Board   |
| --- WORKSPACE ---                  |                                              |
| 📊 Dashboard                       |                                              |
| ⚡ My Desk                         |                                              |
|                                    |                                              |
| --- STARRED PROJECTS ---           |                                              |
| 📁 Pinned Projects                 |                                              |
| ➕ Projects Drawer                 |                                              |
|                                    |                                              |
| --- SYSTEM ---                     |                                              |
| 📂 Projects Directory              |                                              |
| ⚙️ Settings                         |                                              |
+------------------------------------+----------------------------------------------+
```

### B. Navigation Components
1. **Top Navbar (`AppSidebarHeader.tsx`)**:
   - Inspired by Taskly: Brand pill on left, centralized search bar (`Search here... ⌘K`) + filter button in center, light/dark mode switch, notification bell with unread badge, and user profile pill on right.
2. **Left Navigation Sidebar (`AppSidebar.tsx`)**:
   - Fixed 64px/256px wide sidebar (`w-64`).
   - Group headers: `WORKSPACE`, `STARRED PROJECTS`, `SYSTEM`.
   - Dynamic list of up to 5 starred projects for 1-click access.
3. **Slide-Out Projects Drawer (`ProjectDrawer.tsx`)**:
   - Slide-out panel providing instant search, filtering, and progress tracking across all workspace projects regardless of count.
4. **Command Palette (`CommandPalette.tsx`)**:
   - Keyboard shortcut (`Ctrl+K` / `⌘K`) modal for jumping to any task, sprint, or project.

---

## 3. Core Page Specifications

### A. Dashboard Overview (`resources/js/pages/Dashboard/Index.tsx`)
* **Header Controls**: "Workspace Overview" title + Timeframe selector pills (`Today` | `This Week` | `This Month`).
* **KPI Metrics Grid**:
  - `Completion Rate` (% progress bar + completed/total ratio)
  - `On-Time Execution Rate` (% schedule indicator)
  - `Overdue Tasks Ratio` (Overdue count & warning highlight)
  - `Active Projects` (Total count)
* **Task Status Distribution Breakdown**: Donut/Multi-color progress bar showing proportions of `To Do`, `In Progress`, `In Review`, and `Done` tasks.
* **Active Sprint Card**: Sprint progress bar, sprint goal, end countdown, and total task count.
* **Recent Projects**: High-contrast cards with progress bars and status badge pills (`Ongoing` [emerald], `Planned` [amber]).

### B. My Desk Command Center (`resources/js/pages/MyDesk/Index.tsx`)
* **Urgency Counter Strip**: 🔴 `Overdue`, 🟡 `Due Today`, 🔵 `Due Tomorrow`, ⚪ `Upcoming`.
* **Filter Bar**: Search input, Project selector, Priority selector, Scope toggle (`Assigned to Me` vs `All Workspace Tasks`).
* **Urgency Accordion Sections**:
  - 🔴 **Overdue Activities**: Red-tinted expandable container.
  - 🟡 **Today's Activities**: Amber-tinted expandable container.
  - ⚪ **Upcoming & Backlog**: Slate expandable container.

### C. Projects Directory & Hub (`resources/js/pages/Projects/Index.tsx`)
* Searchable table view listing all projects.
* Columns: Project Name (with Star toggle), Status Pill, Project Lead, Visual Progress Bar (% completed), Action Arrow.

### D. Project Show & Kanban Board (`resources/js/pages/Projects/Show.tsx`)
* **Header Stats Strip**: Project status pill, overall progress bar with overdue duration, and 5 counter blocks (`Total Tasks`, `To Do/Blocked`, `In Progress`, `In Review`, `Completed`).
* **Tabbed Views**: 📋 `Board (Kanban)`, 📝 `List View`, 👥 `Team Members`.
* **Kanban Board (`KanbanBoard.tsx`)**: Dynamic status columns with task cards displaying issue type badges, priority indicators, story points, git branch pills, checklist ratios `(1/3)`, and assignee avatars.

### E. Task Detail Modal (`resources/js/components/tasks/TaskDetailModal.tsx`)
Dual-pane modal layout inspired by Idaara:
* **Left Pane**:
  - Task Title & Editable Description (Markdown).
  - Sub-tabs: `Checklist` (subtasks with checkboxes & inline add), `Comments` thread, `Activity Log`.
* **Right Metadata Sidebar**:
  - `Status Column` dropdown selector.
  - `Priority` selector (`low`, `medium`, `high`, `urgent`).
  - `Assignee` selector.
  - `Story Points` input.
  - `Due Date` range/picker.
  - `Git Reference` input (`feat/auth-service`).

---

## 4. Roles & Access Control Architecture

### A. Level 1: Workspace Roles (`workspace_members` table)
* 👑 **Workspace Owner / Admin**: Full administrative control over all workspace projects, team invitations, and workspace settings.
* 👥 **Workspace Member**: Standard developer; can create projects, manage tasks, and collaborate on boards.

### B. Level 2: Project Roles (`project_members` table)
* 🎯 **Project Lead**: Manages project settings, configures custom status columns, invites project members, and edits/deletes any task or comment.
* ✍️ **Project Contributor**: Can create/edit tasks, reorder Kanban cards, complete checklists, and post comments.
* 👁️ **Project Viewer**: Read-only view of boards, lists, and timelines.

### C. Task Responsibilities
* **`assignee_id`**: Primary user assigned to complete the task.
* **`creator_id`**: User who opened the issue.
* **`task_followers`**: Team members subscribed to task activity updates.

---

## 5. Database Schema & Multi-Tenancy Expansion

All entities maintain a `workspace_id` foreign key from Day 1 to ensure seamless future expansion to multi-tenant organizations without database rewrites:

```
workspaces (id, name, slug, owner_id)
  └─ workspace_members (workspace_id, user_id, role)
  └─ projects (id, workspace_id, name, slug, status, lead_id, start_date, due_date, is_starred)
       └─ project_members (project_id, user_id, role)
       └─ board_columns (id, project_id, name, color, position)
       └─ sprints (id, workspace_id, project_id, name, goal, status, start_date, end_date)
       └─ tasks (id, workspace_id, project_id, board_column_id, sprint_id, title, description, type, priority, story_points, creator_id, assignee_id, due_date, git_branch, position)
            ├─ task_checklists (id, task_id, title, is_completed, position)
            ├─ task_comments (id, task_id, user_id, content)
            ├─ task_activities (id, task_id, user_id, action, details)
            └─ task_followers (task_id, user_id)
```
