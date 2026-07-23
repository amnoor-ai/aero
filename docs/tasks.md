# Task Checklist: Aero DevPM Build

- [x] **Phase 1: Database & Core Models**
  - [x] Create migration for `workspaces` & `workspace_members`
  - [x] Create migration for `projects` & `project_members`
  - [x] Create migration for `board_columns` & `sprints`
  - [x] Create migration for `tasks`, `task_checklists`, `task_comments`, `task_activities`, `task_followers`
  - [x] Define Eloquent Models & relationships (`Workspace`, `Project`, `BoardColumn`, `Sprint`, `Task`, `TaskChecklist`, `TaskComment`, `TaskActivity`)
  - [x] Create Database Seeders & Factories for rich realistic dev data

- [x] **Phase 2: Backend Controllers & Actions**
  - [x] `DashboardController` (KPI stats, velocity chart data, recent activity)
  - [x] `MyDeskController` (Personal task command center grouped by urgency)
  - [x] `ProjectController` (Index, Show, Store, Update, Toggle Star)
  - [x] `TaskController` (Store, Update, Reorder columns, Destroy, Checklist toggle, Comment store)
  - [x] Register routes in `routes/web.php`

- [x] **Phase 3: Core Layout & Navigation UI**
  - [x] Build dark design system tokens & base UI elements
  - [x] Create layout shell with high-density dark theme
  - [x] Build `AppSidebar.tsx` with Starred Projects section & group headers
  - [x] Build `ProjectDrawer.tsx` (Slide-out drawer for infinite project browsing)
  - [x] Build `CommandPalette.tsx` (`Ctrl+K` quick search modal)

- [x] **Phase 4: Core Pages & Views**
  - [x] Build `Dashboard/Index.tsx` page (Ring charts, velocity area graph, announcements)
  - [x] Build `MyDesk/Index.tsx` page (Urgency accordions: Overdue, Due Today, Tomorrow, Upcoming)
  - [x] Build `Projects/Index.tsx` (Projects Hub table & grid view)
  - [x] Build `Projects/Show.tsx` (Header Stats Strip + Tabbed Views: Board, List, Timeline, Team)
  - [x] Build `KanbanBoard.tsx` (Drag-and-Drop column board with optimistic UI)
  - [x] Build `TaskDetailModal.tsx` (Dual-pane modal: left description/checklists/comments, right metadata sidebar)

- [x] **Phase 5: Verification & Automated Tests**
  - [x] Write Pest feature tests for Project & Task workflows (`DevPMTest.php`)
  - [x] Run `vendor/bin/pint --format agent` to format PHP code (Passed)
  - [x] Run `npm run build` to compile Vite assets (Passed)
  - [x] Execute Pest test suite (Passed - 5/5 tests)

- [x] **Phase 6: Departments & Org Structure**
  - [x] Create migration for `departments` table & update `users` table
  - [x] Build `Department` model and relationships
  - [x] Implement `DepartmentController` CRUD endpoints & private mandate download
  - [x] Create `Departments/Index.tsx` & `Departments/Show.tsx` pages (Table grid + add/edit modals)
  - [x] Integrate Departments in Sidebar navigation
  - [x] Write Pest feature tests for Department workflows (`DepartmentTest.php`)

- [x] **Phase 7: Projects & Planning Feature Suite**
  - [x] Create migration for `milestones` table & add `milestone_id` to `tasks`
  - [x] Build `Milestone` model with dynamic progress and overdue attributes
  - [x] Implement `ActivityController`, `MilestoneController`, `WorkPlanController`
  - [x] Build `Activities/Index.tsx` (Chronological task audit feed)
  - [x] Build `Milestones/Index.tsx` (Phase gates & progress dashboard)
  - [x] Build `WorkPlan/Index.tsx` (Horizontal Gantt roadmap)
  - [x] Restructure left navigation sidebar under `Projects & Planning` group
  - [x] Write Pest feature tests (`ProjectsAndPlanningTest.php`)

- [x] **Phase 8: Global Tasks Directory & Advanced Data Grid**
  - [x] Build `Tasks/Index.tsx` page (All Issues / Activities view)
  - [x] Implement column-level dropdown sorting (`Asc` / `Desc` / `Hide`)
  - [x] Create `View` dropdown manager checklist to toggle column visibility back on
  - [x] Create advanced `Filters` popover (Status, Project, Team, Department, Assignee, Date Range)
  - [x] Add View Type dropdown selection (All, Subtasks, Project, Department)
  - [x] Build CSV data export action (`Export to CSV`)
  - [x] Universal server-side pagination & sorting across Tasks, Projects, and Departments
  - [x] Write Pest feature tests (`TaskDirectoryTest.php`)

