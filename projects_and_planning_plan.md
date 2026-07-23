# Aero DevPM — Projects & Planning Features Implementation Plan

This document outlines the detailed backend and frontend blueprint to implement the **"Projects & Planning"** feature suite, including:
1. **Activities**: Global & project-level chronological feed of task/project changes.
2. **Projects**: Navigation restructuring to group projects and planning views.
3. **Milestones**: Goal-oriented release/phase gates with task progress tracking.
4. **Work Plan**: High-density horizontal Gantt timeline plotting projects, sprints, and milestones.

---

## 1. Navigation Restructuring

Update the left navigation sidebar to replace separate sections with a unified, collapsible **Projects & Planning** sidebar group.

### Proposed Sidebar Structure
- **⚡ My Desk** (Quick personal dashboard)
- **📁 Projects & Planning** (Collapsible accordion group)
  - ⚡ **Activities** (Workspace feed of logs/events)
  - 📁 **Projects** (Links to Project Directory `/projects`)
  - 🎯 **Milestones** (Global milestones dashboard `/milestones`)
  - 📊 **Work Plan** (Global interactive Gantt roadmap `/work-plan`)
- **🏢 Workspace**
  - 🏢 **Departments**
  - ⚙️ **Settings**

---

## 2. Database Schema Changes

### A. Create Milestones Table
Add a new migration `database/migrations/xxxx_xx_xx_xxxxxx_create_milestones_table.php`:
```php
Schema::create('milestones', function (Blueprint $table) {
    $table->id();
    $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
    $table->foreignId('project_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->text('description')->nullable();
    $table->date('due_date')->nullable();
    $table->string('status')->default('active'); // active, completed, overdue
    $table->timestamps();
});
```

### B. Link Tasks to Milestones
Add a migration to add `milestone_id` to the `tasks` table:
```php
Schema::table('tasks', function (Blueprint $table) {
    $table->foreignId('milestone_id')->nullable()->constrained('milestones')->nullOnDelete();
});
```

---

## 3. Backend & Models

### A. Milestone Model (`app/Models/Milestone.php`)
- Define properties: `name`, `description`, `due_date`, `status`, `workspace_id`, `project_id`.
- Define relationships:
  - `project()`: BelongsTo `Project`.
  - `tasks()`: HasMany `Task`.
  - Add progress calculation helper (completed tasks vs total tasks).

### B. Project & Task Relationships
- Update `app/Models/Project.php`:
  - Define `milestones()` relationship (`hasMany(Milestone::class)`).
- Update `app/Models/Task.php`:
  - Define `milestone()` relationship (`belongsTo(Milestone::class)`).

---

## 4. Routes & Controllers

Add the following routes inside the `auth` middleware group in `routes/web.php`:

```php
// Global Activities Feed
Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');

// Global Milestones Dashboard
Route::get('/milestones', [MilestoneController::class, 'globalIndex'])->name('milestones.global');

// Global Work Plan (Roadmap)
Route::get('/work-plan', [WorkPlanController::class, 'index'])->name('work-plan.index');

// Project-Specific Milestones CRUD
Route::post('/projects/{project}/milestones', [MilestoneController::class, 'store'])->name('projects.milestones.store');
Route::patch('/milestones/{milestone}', [MilestoneController::class, 'update'])->name('milestones.update');
Route::delete('/milestones/{milestone}', [MilestoneController::class, 'destroy'])->name('milestones.destroy');
```

---

## 5. Frontend UI/UX Design Specifications

### A. Activities Feed Page (`resources/js/pages/Activities/Index.tsx`)
- **Layout**: High-density vertical timeline.
- **Data Query**: Paginated task activities, showing:
  - User avatar and name.
  - Action badge (e.g. `status_changed`, `comment_added`, `checklist_toggled`).
  - Formatted message: `"John Doe completed subtask 'Write tests' on TASK-102"`.
  - Relative time stamp (e.g. `"2 hours ago"`).
  - Hover highlights with direct links to target tasks.

### B. Milestones Index & Project Tab (`resources/js/pages/Projects/Show.tsx`)
- Replace the placeholder tab with:
  - List of active/completed milestones.
  - Target due date countdowns (e.g. `"Due in 5 days"` or `"Overdue by 2 days"` styled in rose-500).
  - Progress bar displaying completed tasks within that milestone.
  - "Create Milestone" dialog to add a milestone with a name, description, and target date.

### C. Work Plan Gantt Roadmap (`resources/js/pages/WorkPlan/Index.tsx`)
- **Layout**: Horizontal timeline split by Weeks or Months.
- **Visualization**:
  - Horizontal bar cards showing Projects, Sprints, and Milestones.
  - Plotted on a CSS Grid layout using `start_date` and `due_date`.
  - Modern hover tooltips showing start/end date details and progress percentages.
  - Fully responsive with toggle buttons to change timeline zoom (e.g., Weekly vs Monthly views).

---

## 6. Verification Plan

### Automated Tests
Create Pest feature tests to verify:
- `MilestoneTest`:
  - Verify workspace members can create/update/delete project milestones.
  - Verify tasks can be successfully assigned to a milestone.
- `ActivityTest`:
  - Verify global activities retrieve correct paginated results.
- `WorkPlanTest`:
  - Verify Work Plan endpoint returns project and sprint details successfully.

### Manual Verification
- Run local server Herd development environment and open `/activities`, `/milestones`, and `/work-plan` routes to verify visual layout.
- Check styling consistency with the deep slate-blue Aero dark mode palette.
