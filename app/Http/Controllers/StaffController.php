<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::with(['department', 'teams']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('emp_id', 'like', "%{$search}%")
                    ->orWhere('job_title', 'like', "%{$search}%");
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->input('department_id'));
        }

        if ($request->filled('team_id')) {
            $teamId = $request->input('team_id');
            $query->whereHas('teams', function ($q) use ($teamId) {
                $q->where('teams.id', $teamId);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        $departments = Department::select('id', 'name', 'code')->orderBy('name')->get();
        $teams = Team::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Staff/Index', [
            'users' => $users,
            'departments' => $departments,
            'teams' => $teams,
            'filters' => $request->only(['search', 'department_id', 'team_id', 'status']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:50',
            'emp_id' => 'nullable|string|max:50|unique:users,emp_id',
            'job_title' => 'nullable|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'team_ids' => 'nullable|array',
            'team_ids.*' => 'exists:teams,id',
            'status' => 'required|string|in:active,on_leave,suspended',
        ]);

        if (empty($validated['emp_id'])) {
            $nextId = User::max('id') + 1;
            $validated['emp_id'] = 'EMP-'.str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);
        }

        $user = User::create([
            'emp_id' => $validated['emp_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'job_title' => $validated['job_title'] ?? 'Developer',
            'department_id' => $validated['department_id'] ?? null,
            'status' => $validated['status'],
            'password' => Hash::make(Str::random(16)),
        ]);

        if (! empty($validated['team_ids'])) {
            $syncData = collect($validated['team_ids'])->mapWithKeys(fn ($id) => [$id => ['role' => 'member']])->all();
            $user->teams()->sync($syncData);
        }

        return back()->with('success', 'Staff member added successfully.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|max:255|unique:users,email,{$user->id}",
            'phone' => 'nullable|string|max:50',
            'emp_id' => "nullable|string|max:50|unique:users,emp_id,{$user->id}",
            'job_title' => 'nullable|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'team_ids' => 'nullable|array',
            'team_ids.*' => 'exists:teams,id',
            'status' => 'required|string|in:active,on_leave,suspended',
        ]);

        $user->update([
            'emp_id' => $validated['emp_id'] ?? $user->emp_id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'job_title' => $validated['job_title'] ?? $user->job_title,
            'department_id' => $validated['department_id'] ?? null,
            'status' => $validated['status'],
        ]);

        if (array_key_exists('team_ids', $validated)) {
            $syncData = collect($validated['team_ids'] ?? [])->mapWithKeys(fn ($id) => [$id => ['role' => 'member']])->all();
            $user->teams()->sync($syncData);
        }

        return back()->with('success', 'Staff member details updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->update(['status' => 'suspended']);

        return back()->with('success', 'Staff member status set to suspended.');
    }
}
