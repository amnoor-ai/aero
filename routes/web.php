<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DepartmentDocumentController;
use App\Http\Controllers\DocumentationController;
use App\Http\Controllers\MilestoneController;
use App\Http\Controllers\MyDeskController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskDirectoryController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\WorkPlanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard & My Desk Command Center
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/my-desk', MyDeskController::class)->name('my-desk');
    Route::get('/documentation', [DocumentationController::class, 'index'])->name('documentation.index');

    // System Audit & Logs Routes
    Route::get('/system/logs', [ActivityController::class, 'index'])->name('system.logs');
    Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');
    Route::get('/milestones', [MilestoneController::class, 'globalIndex'])->name('milestones.global');
    Route::get('/work-plan', [WorkPlanController::class, 'index'])->name('work-plan.index');
    Route::post('/work-plans', [WorkPlanController::class, 'store'])->name('work-plans.store');
    Route::patch('/work-plans/{workPlan}', [WorkPlanController::class, 'update'])->name('work-plans.update');
    Route::delete('/work-plans/{workPlan}', [WorkPlanController::class, 'destroy'])->name('work-plans.destroy');
    Route::post('/work-plans/{workPlan}/attach-projects', [WorkPlanController::class, 'attachProjects'])->name('work-plans.attach-projects');

    Route::post('/projects/{project}/milestones', [MilestoneController::class, 'store'])->name('projects.milestones.store');
    Route::patch('/milestones/{milestone}', [MilestoneController::class, 'update'])->name('milestones.update');
    Route::delete('/milestones/{milestone}', [MilestoneController::class, 'destroy'])->name('milestones.destroy');

    // Departments & Org Structure Routes
    Route::get('/departments/documents', [DepartmentDocumentController::class, 'index'])->name('departments.documents.index');
    Route::get('/departments/documents/{document}/view', [DepartmentDocumentController::class, 'view'])->name('departments.documents.view');
    Route::get('/departments/documents/{document}/download', [DepartmentDocumentController::class, 'download'])->name('departments.documents.download');
    Route::patch('/departments/documents/{document}', [DepartmentDocumentController::class, 'update'])->name('departments.documents.update');
    Route::delete('/departments/documents/{document}', [DepartmentDocumentController::class, 'destroy'])->name('departments.documents.destroy');
    Route::post('/departments/{department}/documents', [DepartmentDocumentController::class, 'store'])->name('departments.documents.store');

    Route::resource('departments', DepartmentController::class);
    Route::get('/departments/{department}/mandate', [DepartmentController::class, 'downloadMandate'])->name('departments.mandate');
    Route::post('/departments/{department}/members', [DepartmentController::class, 'addMember'])->name('departments.members.add');
    Route::delete('/departments/{department}/members/{user}', [DepartmentController::class, 'removeMember'])->name('departments.members.remove');

    // Sprints & Iterations Routes
    Route::post('/sprints', [SprintController::class, 'store'])->name('sprints.store');
    Route::patch('/sprints/{sprint}', [SprintController::class, 'update'])->name('sprints.update');
    Route::post('/sprints/{sprint}/start', [SprintController::class, 'start'])->name('sprints.start');
    Route::post('/sprints/{sprint}/complete', [SprintController::class, 'complete'])->name('sprints.complete');
    Route::post('/sprints/assign-tasks', [SprintController::class, 'assignTasks'])->name('sprints.assign-tasks');

    // Projects Routes
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::post('/projects/{project}/toggle-star', [ProjectController::class, 'toggleStar'])->name('projects.toggle-star');

    // Tasks Routes
    Route::get('/tasks', [TaskDirectoryController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/export-csv', [TaskDirectoryController::class, 'exportCsv'])->name('tasks.export-csv');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::patch('/tasks/{task}/position', [TaskController::class, 'updatePosition'])->name('tasks.update-position');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    // Task Sub-features (Checklists, Comments & Documents)
    Route::post('/tasks/{task}/checklists', [TaskController::class, 'addChecklist'])->name('tasks.checklists.store');
    Route::patch('/checklists/{checklist}/toggle', [TaskController::class, 'toggleChecklist'])->name('checklists.toggle');
    Route::delete('/checklists/{checklist}', [TaskController::class, 'deleteChecklist'])->name('checklists.destroy');
    Route::post('/tasks/{task}/comments', [TaskController::class, 'addComment'])->name('tasks.comments.store');
    Route::post('/tasks/{task}/documents', [TaskController::class, 'uploadDocument'])->name('tasks.documents.store');
});

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
