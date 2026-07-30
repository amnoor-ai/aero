import { Head, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    UserCheck,
    Grid,
    List,
    Pencil,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Mail,
    Phone,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PaginationBar } from '@/components/ui/pagination-bar';

interface DepartmentItem {
    id: number;
    name: string;
    code?: string;
}

interface TeamItem {
    id: number;
    name: string;
}

interface StaffMember {
    id: number;
    emp_id?: string;
    name: string;
    email: string;
    phone?: string;
    job_title?: string;
    status: 'active' | 'on_leave' | 'suspended';
    department_id?: number;
    department?: DepartmentItem;
    teams?: TeamItem[];
    avatar_url?: string;
}

interface StaffIndexProps {
    users: {
        data: StaffMember[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: any[];
    };
    departments: DepartmentItem[];
    teams: TeamItem[];
    filters: {
        search?: string;
        department_id?: string;
        team_id?: string;
        status?: string;
    };
}

export default function StaffIndex({
    users,
    departments = [],
    teams = [],
    filters = {},
}: StaffIndexProps) {
    const staffList = users.data || [];

    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [departmentFilter, setDepartmentFilter] = useState(filters.department_id || 'all');
    const [teamFilter, setTeamFilter] = useState(filters.team_id || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Create / Edit Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<StaffMember | null>(null);

    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formEmpId, setFormEmpId] = useState('');
    const [formJobTitle, setFormJobTitle] = useState('Developer');
    const [formDepartmentId, setFormDepartmentId] = useState<string>('');
    const [formSelectedTeamIds, setFormSelectedTeamIds] = useState<number[]>([]);
    const [formStatus, setFormStatus] = useState<string>('active');

    // Suspend / Delete Confirmation State
    const [deletingUser, setDeletingUser] = useState<StaffMember | null>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get(
            '/staff',
            {
                search: searchQuery.trim() || undefined,
                department_id: departmentFilter !== 'all' ? departmentFilter : undefined,
                team_id: teamFilter !== 'all' ? teamFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const openAddModal = () => {
        setEditingUser(null);
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormEmpId('');
        setFormJobTitle('Developer');
        setFormDepartmentId(departments[0]?.id ? String(departments[0].id) : '');
        setFormSelectedTeamIds([]);
        setFormStatus('active');
        setIsAddModalOpen(true);
    };

    const openEditModal = (user: StaffMember) => {
        setEditingUser(user);
        setFormName(user.name);
        setFormEmail(user.email);
        setFormPhone(user.phone || '');
        setFormEmpId(user.emp_id || '');
        setFormJobTitle(user.job_title || 'Developer');
        setFormDepartmentId(user.department_id ? String(user.department_id) : '');
        setFormSelectedTeamIds((user.teams || []).map((t) => t.id));
        setFormStatus(user.status || 'active');
        setIsAddModalOpen(true);
    };

    const toggleTeamSelection = (teamId: number) => {
        setFormSelectedTeamIds((prev) =>
            prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
        );
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formName.trim() || !formEmail.trim()) {
            toast.error('Please fill in required fields (Name and Email).');

            return;
        }

        const payload = {
            name: formName.trim(),
            email: formEmail.trim(),
            phone: formPhone.trim() || null,
            emp_id: formEmpId.trim() || null,
            job_title: formJobTitle.trim() || 'Developer',
            department_id: formDepartmentId ? parseInt(formDepartmentId, 10) : null,
            team_ids: formSelectedTeamIds,
            status: formStatus,
        };

        if (editingUser) {
            router.put(`/staff/${editingUser.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Staff member details updated successfully.');
                    setIsAddModalOpen(false);
                },
                onError: (err) => {
                    toast.error(Object.values(err)[0] as string || 'Failed to update staff member.');
                },
            });
        } else {
            router.post('/staff', payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Staff member added successfully.');
                    setIsAddModalOpen(false);
                },
                onError: (err) => {
                    toast.error(Object.values(err)[0] as string || 'Failed to add staff member.');
                },
            });
        }
    };

    const formatStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                );
            case 'on_leave':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-accent text-accent-foreground border border-border flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> On Leave
                    </span>
                );
            case 'suspended':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-destructive/10 text-destructive border border-destructive/30 flex items-center gap-1 w-fit">
                        <AlertCircle className="w-3 h-3" /> Suspended
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-muted text-muted-foreground border border-border flex items-center gap-1 w-fit">
                        Active
                    </span>
                );
        }
    };

    return (
        <>
            <Head title="Staff Directory - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-primary" />
                            <span>Staff</span>
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Manage member accounts, roles, employee IDs, and team assignments.
                        </p>
                    </div>

                    <Button
                        onClick={openAddModal}
                        className="bg-primary text-primary-foreground font-semibold text-xs shadow-lg h-9 px-4"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Add User
                    </Button>
                </div>

                {/* Controls & Filter Bar (Matching Idaara System layout) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border">
                    <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 flex-1">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search Staff..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-9 bg-background border border-input rounded-xl pl-9 pr-3 text-xs text-foreground focus:outline-none focus:border-primary"
                            />
                        </div>

                        {/* Department Filter */}
                        <select
                            value={departmentFilter}
                            onChange={(e) => {
                                setDepartmentFilter(e.target.value);
                                router.get('/staff', { search: searchQuery || undefined, department_id: e.target.value !== 'all' ? e.target.value : undefined, team_id: teamFilter !== 'all' ? teamFilter : undefined, status: statusFilter !== 'all' ? statusFilter : undefined }, { preserveState: true });
                            }}
                            className="h-9 px-3 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Departments</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>

                        {/* Team Filter */}
                        <select
                            value={teamFilter}
                            onChange={(e) => {
                                setTeamFilter(e.target.value);
                                router.get('/staff', { search: searchQuery || undefined, department_id: departmentFilter !== 'all' ? departmentFilter : undefined, team_id: e.target.value !== 'all' ? e.target.value : undefined, status: statusFilter !== 'all' ? statusFilter : undefined }, { preserveState: true });
                            }}
                            className="h-9 px-3 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Teams</option>
                            {teams.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                router.get('/staff', { search: searchQuery || undefined, department_id: departmentFilter !== 'all' ? departmentFilter : undefined, team_id: teamFilter !== 'all' ? teamFilter : undefined, status: e.target.value !== 'all' ? e.target.value : undefined }, { preserveState: true });
                            }}
                            className="h-9 px-3 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="on_leave">On Leave</option>
                            <option value="suspended">Suspended</option>
                        </select>

                        <button type="submit" className="hidden" />
                    </form>

                    {/* View Switcher Toggle */}
                    <div className="flex bg-muted/40 border border-border p-1 rounded-xl shrink-0">
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <List className="w-3.5 h-3.5" /> List
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Grid className="w-3.5 h-3.5" /> Grid
                        </button>
                    </div>
                </div>

                {/* Content Display */}
                {staffList.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
                        <UserCheck className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                        <h3 className="text-sm font-bold text-foreground">No Staff Members Found</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            {searchQuery ? `No staff members match "${searchQuery}".` : 'Add staff members to assign roles, departments, and project teams.'}
                        </p>
                        <Button onClick={openAddModal} size="sm" className="mt-2 text-xs font-bold bg-primary text-primary-foreground">
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add User
                        </Button>
                    </div>
                ) : viewMode === 'list' ? (
                    /* LIST TABLE VIEW (Matching Idaara System screenshot) */
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-muted-foreground">
                                <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                                    <tr>
                                        <th className="p-3.5">Name</th>
                                        <th className="p-3.5">Email</th>
                                        <th className="p-3.5">Phone</th>
                                        <th className="p-3.5">Emp ID</th>
                                        <th className="p-3.5">Role</th>
                                        <th className="p-3.5">Department</th>
                                        <th className="p-3.5">Team</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {staffList.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/30 transition">
                                            {/* NAME with Avatar */}
                                            <td className="p-3.5 font-bold text-foreground">
                                                <div className="flex items-center space-x-2.5">
                                                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
                                                        {user.avatar_url ? (
                                                            <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            user.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <span>{user.name}</span>
                                                </div>
                                            </td>

                                            {/* EMAIL */}
                                            <td className="p-3.5 font-mono text-foreground">{user.email}</td>

                                            {/* PHONE */}
                                            <td className="p-3.5 font-mono">{user.phone || '—'}</td>

                                            {/* EMP ID */}
                                            <td className="p-3.5 font-mono font-semibold text-foreground">{user.emp_id || '—'}</td>

                                            {/* ROLE / Job Title */}
                                            <td className="p-3.5 font-semibold text-foreground">{user.job_title || 'Developer'}</td>

                                            {/* DEPARTMENT */}
                                            <td className="p-3.5">
                                                {user.department ? (
                                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[11px] border border-primary/20">
                                                        {user.department.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground italic text-[11px]">Unassigned</span>
                                                )}
                                            </td>

                                            {/* TEAM */}
                                            <td className="p-3.5">
                                                {user.teams && user.teams.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.teams.map((t) => (
                                                            <span key={t.id} className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-bold text-[11px] border border-border">
                                                                {t.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic text-[11px]">No team</span>
                                                )}
                                            </td>

                                            {/* STATUS */}
                                            <td className="p-3.5">
                                                {formatStatusBadge(user.status)}
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="p-3.5 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(user)}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                        title="Edit Staff Member"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingUser(user)}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                                                        title="Suspend / Delete User"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <PaginationBar
                            currentPage={users.current_page}
                            lastPage={users.last_page}
                            from={users.from}
                            to={users.to}
                            total={users.total}
                            links={users.links}
                        />
                    </div>
                ) : (
                    /* GRID CARDS VIEW */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {staffList.map((user) => (
                            <div
                                key={user.id}
                                className="p-5 bg-card border border-border/80 hover:border-primary/40 rounded-2xl shadow-2xs transition space-y-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-foreground">{user.name}</h3>
                                            <p className="text-xs text-muted-foreground">{user.job_title || 'Developer'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(user)}
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeletingUser(user)}
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs text-muted-foreground border-t border-border/60 pt-3">
                                    <div className="flex items-center justify-between font-mono">
                                        <span className="flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {user.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between font-mono">
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {user.phone || 'No phone'}
                                        </span>
                                        <span className="font-bold text-foreground">ID: {user.emp_id || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
                                    <div>
                                        {user.department ? (
                                            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px] border border-primary/20">
                                                {user.department.name}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground italic text-[10px]">No Department</span>
                                        )}
                                    </div>
                                    {formatStatusBadge(user.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ADD / EDIT USER MODAL */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-md">
                    <form onSubmit={handleFormSubmit}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-primary" />
                                <span>{editingUser ? 'Edit Staff Member' : 'Add New Staff Member'}</span>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Full Name & Email */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground block">
                                        Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="e.g. Mohamed Ali"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground block">
                                        Email Address <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        type="email"
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        placeholder="user@organization.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone & Employee ID */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground block">Phone Number</label>
                                    <Input
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        placeholder="+252 61 5500000"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground block">Employee ID</label>
                                    <Input
                                        value={formEmpId}
                                        onChange={(e) => setFormEmpId(e.target.value)}
                                        placeholder="e.g. TCHN1001 (Auto-generated if empty)"
                                    />
                                </div>
                            </div>

                            {/* Role / Job Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground block">Role / Job Title</label>
                                <Input
                                    value={formJobTitle}
                                    onChange={(e) => setFormJobTitle(e.target.value)}
                                    placeholder="e.g. Senior Software Engineer, Super Admin"
                                />
                            </div>

                            {/* Department Selection */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground block">Department</label>
                                <select
                                    value={formDepartmentId}
                                    onChange={(e) => setFormDepartmentId(e.target.value)}
                                    className="w-full h-9.5 px-3 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="">No Department Assigned</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Teams Multi-select Badges */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground block">Assign Teams</label>
                                <div className="flex flex-wrap gap-1.5 p-2 bg-muted/30 border border-input rounded-xl min-h-[42px]">
                                    {teams.length === 0 ? (
                                        <span className="text-xs text-muted-foreground italic">No teams available</span>
                                    ) : (
                                        teams.map((t) => {
                                            const isSelected = formSelectedTeamIds.includes(t.id);

                                            return (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => toggleTeamSelection(t.id)}
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                                        isSelected
                                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                    }`}
                                                >
                                                    {isSelected ? '✓ ' : '+ '}{t.name}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground block">Status</label>
                                <select
                                    value={formStatus}
                                    onChange={(e) => setFormStatus(e.target.value)}
                                    className="w-full h-9.5 px-3 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="active">Active</option>
                                    <option value="on_leave">On Leave</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>

                            <div className="pt-3 border-t border-border flex items-center justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="h-9 text-xs">
                                    Cancel
                                </Button>
                                <Button type="submit" className="h-9 px-4 bg-primary text-primary-foreground font-bold text-xs">
                                    {editingUser ? 'Save Changes' : 'Add Staff Member'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* SUSPEND / DELETE CONFIRMATION MODAL */}
            <ConfirmDeleteModal
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={() => {
                    if (deletingUser) {
                        router.delete(`/staff/${deletingUser.id}`, {
                            preserveScroll: true,
                            onSuccess: () => {
                                toast.success(`Staff member "${deletingUser.name}" status set to suspended.`);
                                setDeletingUser(null);
                            },
                        });
                    }
                }}
                title="Suspend Staff Member"
                itemName={deletingUser?.name}
                description="Are you sure you want to suspend this staff member? Their access will be restricted."
            />
        </>
    );
}

StaffIndex.layout = {
    breadcrumbs: [
        {
            title: 'Staff',
            href: '/staff',
        },
    ],
};
