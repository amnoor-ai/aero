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

- [ ] **Phase 6: Departments & Org Structure**
  - [ ] Create migration for `departments` table & update `users` table
  - [ ] Build `Department` model and relationships
  - [ ] Implement `DepartmentController` CRUD endpoints
  - [ ] Create `Departments/Index.tsx` page (Table grid + add/edit modals)
  - [ ] Integrate Departments in Sidebar navigation
  - [ ] Write Pest feature tests for Department workflows

- [ ] **Phase 7: Project Assets & Branding**
  - [ ] Add `logo_path` and `cover_image_path` columns to `projects` table
  - [ ] Implement file upload storage logic for project logos and banner images
  - [ ] Build "Docs & Assets" tab inside Project Show page (`Projects/Show.tsx`)
  - [ ] Add file upload attachment list and external link inputs (e.g. Figma, API docs)
