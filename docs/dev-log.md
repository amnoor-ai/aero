# Aero DevPM — Daily Development & Architectural Decision Log

This document provides a comprehensive day-by-day record of all features built, bug fixes resolved, architectural decisions made, root causes identified, and solutions implemented in the Aero Project Management Platform.

---

## 📅 July 23, 2026: Projects & Planning Suite, Universal Data Grid, Project Wizard & System Polish

### 1. Persistent Light/Dark Mode Theme Selection
- **Issue**: Toggling the application to Light mode reverted back to Dark mode whenever the page was refreshed.
- **Root Cause Analysis**:
  1. The top header theme toggle button in `AppSidebarHeader.tsx` managed its own local React state (`const [isDarkMode, setIsDarkMode] = useState(true)`). Clicking it toggled in-memory classes without updating `localStorage` or setting the server cookie.
  2. The server-side HTML template (`app.blade.php`) contained an inline script that checked only server cookies and OS preference (`prefers-color-scheme: dark`) before React hydrated, forcing `.dark` onto the `<html>` element on page load.
- **Solution & Architectural Decision**:
  - Updated `AppSidebarHeader.tsx` to use the global `useAppearance()` hook, which writes theme choices directly to `localStorage` and the `appearance` cookie.
  - Rewrote the inline head script in `app.blade.php` to inspect `localStorage.getItem('appearance')` *first* before rendering the DOM. Light mode choices are now restored instantly before the browser renders the page, preventing any flash or reversion.
- **Files Modified**: `resources/views/app.blade.php`, `resources/js/components/app-sidebar-header.tsx`.

---

### 2. High-Density 2-Column Task Detail Modal Redesign
- **User Request**: Redesign the task status update and detail view into a wide 2-column modal/drawer matching enterprise standards (breadcrumbs, editable description, child sub-tasks table, status/priority/assignee/followers/dates/tags sidebar, documents dropzone).
- **Architectural Implementation**:
  - **Modal Shell**: Expanded `TaskDetailModal.tsx` into a responsive `max-w-5xl lg:max-w-6xl` drawer overlay.
  - **Header Bar**: Breadcrumb track (`Activities > [Task Title]`), `TASK-id` badge, `[Delete]` button (red outline), `[Edit]` button (gray outline), and close handle.
  - **Left Pane (~65% Width)**:
    - **Description Card**: Inline text preview with toggleable textarea editor and `Save Description` handler.
    - **Interactive Sub-Tabs**: `Tasks` (child tasks table with `+ Add Task` inline form), `Checklist` (subtask completion items with checkboxes), and `Comments` (team discussion thread with timestamps).
    - **Child Tasks Table**: Responsive data grid displaying task title, assignee, due date, and completion status.
  - **Right Sidebar (~35% Width)**:
    - **Details Card**: Status column dropdown selector, Priority dropdown selector (`Low`, `Medium`, `High`, `Urgent`), Assigned To user selector, Followed By subscriber dropdown, Dates range picker, and Tag pills (`#frontend`, `#v2-api`) with `Add tag...` text input.
    - **Documents Card**: Attachment dropzone area with file icon.
  - **Status Dropdown Fallback Fix**: Resolved an issue where opening tasks directly from the Global Tasks Directory (`/tasks`) resulted in an empty status dropdown. Built fallback column resolution logic (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`) when `columns` prop is not passed.
- **Files Modified**: `resources/js/components/tasks/TaskDetailModal.tsx`.

---

### 3. Automatic Board Column Seeding & Empty Project View Fix
- **Issue**: Visiting newly created or unseeded project pages (`/projects/{id}`) resulted in an empty screen below the tab bar.
- **Root Cause Analysis**:
  1. Projects created manually or prior to default column seeding had 0 board columns in the database, causing the `KanbanBoard` component to render 0 columns.
  2. The relationship property passed from Eloquent (`boardColumns` in camelCase vs `board_columns` in snake_case) lacked a fallback in `Projects/Show.tsx`.
  3. The `List View`, `Discussions`, and `Timeline` tabs contained minimal placeholder text.
- **Solution & Architectural Decision**:
  - Updated `ProjectController@show` to automatically seed the 5 standard board columns (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`) on-the-fly whenever a project with 0 columns is visited.
  - Updated `Projects/Show.tsx` to pass `columns={project.board_columns || project.boardColumns || []}`.
  - Built full interactive components for `List View` (Task Registry data grid), `Discussions` (team RFC thread), and `Timeline` (sprint & milestone roadmap).
  - Added empty state dropzone cards inside `KanbanBoard.tsx` columns with `+ Add Task` buttons.
- **Files Modified**: `app/Http/Controllers/ProjectController.php`, `resources/js/pages/Projects/Show.tsx`, `resources/js/components/board/KanbanBoard.tsx`.

---

### 4. System-Wide Mobile Responsiveness Pass
- **Issue**: Kanban board columns cramped on small mobile viewports (< 768px); page headers and statistics rows overflowed horizontally.
- **Solution & Architectural Decision**:
  - **Kanban Board**: Added touch-friendly momentum snap scrolling (`snap-x`, `scroll-smooth`, `touch-pan-x`, `min-h-[500px]`) on `KanbanBoard.tsx`.
  - **Project Header Stats**: Converted statistics counter row on `Projects/Show.tsx` into a responsive flex-wrap container (`flex-wrap gap-x-6 gap-y-1`).
  - **Task Modal**: Configured 2-column task detail modal to stack vertically (`flex-col lg:flex-row`) on viewports under `1024px` for effortless scrolling.
- **Files Modified**: `resources/js/components/board/KanbanBoard.tsx`, `resources/js/pages/Projects/Show.tsx`, `resources/js/components/tasks/TaskDetailModal.tsx`.

---

### 5. Milestone & Project Card Click Navigation Fix
- **Issue**: Clicking milestone cards in `/milestones` or project cards in `/projects` did not trigger navigation.
- **Solution**: Added `router.visit(`/projects/${m.project.id}`)` click handlers to milestone cards in `Milestones/Index.tsx` and project rows in `Projects/Index.tsx`.
- **Files Modified**: `resources/js/pages/Milestones/Index.tsx`, `resources/js/pages/Projects/Index.tsx`.

---

### 6. Phase 9: Multi-Step Project Creation Wizard
- **Features Implemented**:
  - Database migration `2026_07_23_123000_add_budget_tags_and_draft_to_projects_table.php` adding `budget`, `tags`, `logo_path`, and `draft` status attributes to `projects`.
  - Updated `Project` model `$fillable` array and `$casts` (`budget` as `decimal:2`, `tags` as `array`).
  - Created 3-step interactive modal `CreateProjectWizardModal.tsx`:
    - **Step 1: Info & Timeline**: Name, description, department, project lead, start/due dates, budget, focus tag pills.
    - **Step 2: Branding & Team**: Logo dropzone simulator and team member assignment checklist with role selectors (`lead`, `member`, `viewer`).
    - **Step 3: Review & Governance**: Summary card, default status toggle (`Draft` vs `Planned`), compliance checkbox.
  - Updated `ProjectController@store` to validate budget, tags, department, lead, draft status, and sync member roles in `project_members` pivot table.
  - Passed 2/2 Pest tests in `tests/Feature/ProjectWizardTest.php`.
- **Files Created/Modified**: `database/migrations/2026_07_23_123000_...`, `app/Models/Project.php`, `app/Http/Controllers/ProjectController.php`, `resources/js/components/projects/CreateProjectWizardModal.tsx`, `resources/js/pages/Projects/Index.tsx`, `tests/Feature/ProjectWizardTest.php`.

---

### 7. Phase 8: Universal Data Table Pagination & Column Controls
- **Features Implemented**:
  - Built global Tasks Directory (`/tasks`) with `TaskDirectoryController.php`.
  - Reusable UI controls: `DataTableHeader.tsx` (sorting/hiding menu), `ColumnVisibilityPopover.tsx` (column visibility checklist popover), `PaginationBar.tsx` (server-side Inertia pagination links).
  - Streamed CSV export (`/tasks/export-csv`).
  - Integrated column controls and pagination across `Tasks/Index.tsx`, `Projects/Index.tsx`, and `Departments/Index.tsx`.
  - Added `Tasks Directory` item to left sidebar (`AppSidebar.tsx`).
  - Passed 3/3 Pest tests in `tests/Feature/TaskDirectoryTest.php`.
- **Files Created/Modified**: `app/Http/Controllers/TaskDirectoryController.php`, `resources/js/components/tables/DataTableHeader.tsx`, `resources/js/components/tables/ColumnVisibilityPopover.tsx`, `resources/js/components/tables/PaginationBar.tsx`, `resources/js/pages/Tasks/Index.tsx`, `resources/js/pages/Projects/Index.tsx`, `resources/js/pages/Departments/Index.tsx`, `resources/js/components/app-sidebar.tsx`, `tests/Feature/TaskDirectoryTest.php`.

---

### 8. Phase 7: Projects & Planning Suite Integration
- **Features Implemented**:
  - Restructured left navigation sidebar under `Projects & Planning` collapsable group.
  - Global Activities timeline feed (`/activities`) via `ActivityFeedController.php`.
  - Milestones dashboard (`/milestones`) with release gates, target dates, overdue indicators, and dynamic progress bars via `MilestoneController.php`.
  - Work Plan Gantt roadmap (`/work-plan`) with weekly/monthly timeline views via `WorkPlanController.php`.
- **Files Created/Modified**: `app/Http/Controllers/ActivityFeedController.php`, `app/Http/Controllers/MilestoneController.php`, `app/Http/Controllers/WorkPlanController.php`, `resources/js/pages/Activities/Index.tsx`, `resources/js/pages/Milestones/Index.tsx`, `resources/js/pages/WorkPlan/Index.tsx`, `resources/js/components/app-sidebar.tsx`.

---

## 📅 July 22, 2026: Departments & Sprint Planning Engine

### 1. Workspace Departments Suite
- **Features**: Department listing, director assignments, office locations, private mandate document uploads/downloads via `DepartmentController.php`.
- **Files**: `app/Models/Department.php`, `app/Http/Controllers/DepartmentController.php`, `resources/js/pages/Departments/Index.tsx`, `resources/js/pages/Departments/Show.tsx`.

### 2. Sprint Iteration Engine
- **Features**: Sprint lifecycle management (`future` → `active` → `completed`), active sprint banner with story point metrics, Backlog planning drawer, sprint completion rollover dialog.
- **Files**: `app/Models/Sprint.php`, `app/Http/Controllers/SprintController.php`, `resources/js/components/sprints/SprintHeaderStrip.tsx`, `resources/js/components/sprints/BacklogDrawer.tsx`.

---

## 📅 July 20 & 21, 2026: Initial Architecture, Database Setup & UI Design

### 1. Multi-Tenant Ready Schema
- **Features**: Workspace scoping across all tables (`workspace_id`), seeders, models, and factory setup.

### 2. Core User Interface Architecture
- **Features**: Slate-black dark theme design system, `AppSidebar.tsx` navigation, command palette search (`⌘K`), Kanban Board, My Desk command center, Task Detail drawer.
