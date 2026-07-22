# Sprint Planning & Iteration Management

This document outlines the system architecture, database relationships, sprint lifecycle transitions, API endpoints, and user interface specifications for **Sprint Planning & Iteration Management** in Aero.

---

## 1. Overview & Purpose
Sprint Planning enables engineering teams to organize work into fixed-length iterations (e.g., 2-week sprints), establish clear sprint goals, track story point commitments, and manage task movements between the Product Backlog and Active Sprints.

---

## 2. Sprint Lifecycle States
A sprint moves through three sequential states:

```
 [ Future / Draft ] ───( Start Sprint )───► [ Active ] ───( Complete Sprint )───► [ Completed ]
```

1. **`future`**: Draft sprint created during backlog grooming. Tasks are queued, and start/end dates are tentative.
2. **`active`**: Currently running sprint. Tasks on the Kanban board are filtered to this sprint. Only one sprint can be `active` per project at a time.
3. **`completed`**: Finished sprint. Completed tasks remain archived in history; uncompleted tasks are rolled over to the Backlog or a new Future Sprint.

---

## 3. Database Schema

### `sprints` Table
| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | `bigIncrements` | Primary Key | Sprint identifier |
| `workspace_id` | `foreignId` | Foreign Key (`workspaces`), Cascade | Multi-tenant workspace isolation |
| `project_id` | `foreignId` | Foreign Key (`projects`), Cascade | Parent project |
| `name` | `string` | Required | e.g. "Sprint 15 - Navigation Shell" |
| `goal` | `text` | Nullable | Primary objective for the iteration |
| `status` | `string` | Default: `'future'` | `'future'`, `'active'`, `'completed'` |
| `start_date` | `date` | Nullable | Scheduled iteration start |
| `end_date` | `date` | Nullable | Target completion date |
| `created_at` / `updated_at` | `timestamp` | Nullable | Timestamps |

### Task Linkage (`tasks` table)
- `sprint_id` (nullable, foreign key to `sprints` table).
- When `sprint_id` is `null`, the task belongs to the **Product Backlog**.

---

## 4. API & Controller Specs

### Routes (`routes/web.php`)
```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/sprints', [SprintController::class, 'store'])->name('sprints.store');
    Route::patch('/sprints/{sprint}', [SprintController::class, 'update'])->name('sprints.update');
    Route::post('/sprints/{sprint}/start', [SprintController::class, 'start'])->name('sprints.start');
    Route::post('/sprints/{sprint}/complete', [SprintController::class, 'complete'])->name('sprints.complete');
    Route::post('/sprints/assign-tasks', [SprintController::class, 'assignTasks'])->name('sprints.assign-tasks');
});
```

---

## 5. UI/UX Components
- **`SprintHeaderStrip.tsx`**: Header banner on the project board displaying active sprint goal, time remaining, total story points, and sprint control actions.
- **`SprintBacklogDrawer.tsx`**: Slide-over drawer for drag-and-drop backlog planning between Product Backlog and Sprint buckets.
- **`CreateSprintModal.tsx`**: Modal for creating new sprints with name, goal, and target dates.
- **`CompleteSprintModal.tsx`**: Finish-sprint dialog offering choices to move incomplete tasks to Backlog or Next Sprint.
