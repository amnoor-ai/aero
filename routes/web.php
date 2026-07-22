<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\MyDeskController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Teams\TeamInvitationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard & My Desk Command Center
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/my-desk', MyDeskController::class)->name('my-desk');

    // Departments & Org Structure Routes
    Route::resource('departments', DepartmentController::class);
    Route::get('/departments/{department}/mandate', [DepartmentController::class, 'downloadMandate'])->name('departments.mandate');

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
    Route::post('/projects/{project}/toggle-star', [ProjectController::class, 'toggleStar'])->name('projects.toggle-star');

    // Tasks Routes
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::patch('/tasks/{task}/position', [TaskController::class, 'updatePosition'])->name('tasks.update-position');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    // Task Sub-features (Checklists & Comments)
    Route::post('/tasks/{task}/checklists', [TaskController::class, 'addChecklist'])->name('tasks.checklists.store');
    Route::patch('/checklists/{checklist}/toggle', [TaskController::class, 'toggleChecklist'])->name('checklists.toggle');
    Route::post('/tasks/{task}/comments', [TaskController::class, 'addComment'])->name('tasks.comments.store');
});

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
