# Departments & Organization Structure

This document outlines the architecture, database schema, controller specifications, and user interface flow for the **Departments & Organization Structure** module in Aero.

---

## 1. Overview & Purpose
The **Departments & Org Structure** module enables teams to map out organizational hierarchies within their shared workspace. It links users, projects, and leadership roles to specific departments, providing clear oversight of department directors, physical/remote locations, project allocations, and official mandate documentation.

---

## 2. Key Capabilities
- **Department Management**: Create, update, view, and archive departments scoped to the active workspace.
- **Director Assignment**: Assign department leaders/directors from existing workspace members.
- **Mandate Document Management**: Upload and manage official department mandate files (PDF/DOCX) for organizational compliance.
- **Location Tracking**: Associate physical office locations (e.g., "HQ - 4th Floor", "Building B") or remote designations.
- **Resource Linking**: Connect team members and active projects directly to their parent departments for aggregated reporting.

---

## 3. Database Schema

### `departments` Table
| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | `ulid` / `bigIncrements` | Primary Key | Unique department identifier |
| `workspace_id` | `foreignUlid` / `foreignId` | Index, Foreign Key (`workspaces`), Cascade | Scoped multi-tenant workspace |
| `name` | `string` | Required | Department title (e.g., "Engineering") |
| `code` | `string` | Required | Department short code (e.g., "ENG", "MKT") |
| `slug` | `string` | Index | URL-friendly slug |
| `description` | `text` | Nullable | Detailed mandate summary |
| `director_id` | `foreignId` | Nullable, Foreign Key (`users`), Set Null | User ID of the department director |
| `location` | `string` | Nullable | Physical location or "Remote" |
| `mandate_file_path` | `string` | Nullable | Storage path for mandate attachment |
| `mandate_file_name` | `string` | Nullable | Original uploaded document file name |
| `status` | `string` | Default: `'active'` | `'active'`, `'archived'` |
| `created_at` / `updated_at` | `timestamp` | Nullable | Standard timestamps |

### Related Schema Updates
- Add `department_id` (nullable, foreign key) to `users` table.
- Add `department_id` (nullable, foreign key) to `projects` table.

---

## 4. API & Controller Specs

### Routes (`routes/web.php`)
```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('departments', DepartmentController::class);
    Route::get('/departments/{department}/mandate', [DepartmentController::class, 'downloadMandate'])->name('departments.mandate');
});
```

### Endpoints
- `GET /departments` → `DepartmentController@index` (Inertia `Departments/Index`)
- `POST /departments` → `DepartmentController@store` (Validate & store department + mandate file)
- `GET /departments/{department}` → `DepartmentController@show` (Inertia `Departments/Show`)
- `PATCH /departments/{department}` → `DepartmentController@update` (Validate & update details)
- `DELETE /departments/{department}` → `DepartmentController@destroy` (Archive or soft delete)
- `GET /departments/{department}/mandate` → Download/stream stored mandate PDF/doc file.

---

## 5. User Interface (UI/UX) Specs

### Department Directory (`resources/js/pages/Departments/Index.tsx`)
- High-density card grid & table toggle showing department code, name, director avatar, location badge, active project count, and member count.
- Search & filter toolbar (Filter by status, search by name/code).
- **"Add Department" Modal**: Slide-over or dialog form with mandate document drag-and-drop zone.

### Department Details View (`resources/js/pages/Departments/Show.tsx`)
- Header with department badge, director card, location, and quick mandate download button.
- **Tabs**:
  1. **Overview**: Mandate description, key metrics, location info.
  2. **Members**: Grid/list of users belonging to the department.
  3. **Projects**: Active and completed projects owned by the department.
  4. **Documents**: Mandate PDF viewer / document history.

### Sidebar Navigation (`resources/js/components/app-sidebar.tsx`)
- Add **Departments** item in the primary workspace menu under Projects.

---

## 6. Security & Multi-Tenancy Rules
- All database queries must be scoped to the authenticated user's `current_team` / `workspace_id`.
- Mandate file uploads validated for MIME types (`pdf`, `doc`, `docx`, `txt`) up to 10MB.
