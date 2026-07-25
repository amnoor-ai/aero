import { Link, router, usePage } from '@inertiajs/react';
import {
    Search,
    SlidersHorizontal,
    Sun,
    Moon,
    User,
    ShieldCheck,
    Palette,
    Users,
    LogOut,
    ChevronDown,
} from 'lucide-react';
import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { NotificationDropdown } from '@/components/navigation/NotificationDropdown';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { props } = usePage<any>();
    const user = props.auth?.user || { name: 'Developer', email: 'dev@aero.test' };
    const allProjects = props.allProjects || [];

    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDarkMode = resolvedAppearance === 'dark';

    const toggleTheme = () => {
        updateAppearance(isDarkMode ? 'light' : 'dark');
    };

    return (
        <>
            <header className="h-16 px-4 sm:px-6 lg:px-8 bg-transparent flex items-center justify-between sticky top-0 z-40 select-none">
                {/* 1. Left Controls: Collapse Toggle & Breadcrumbs */}
                <div className="flex items-center space-x-3">
                    <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg p-1.5 transition" />
                    
                    {/* Breadcrumbs */}
                    {breadcrumbs.length > 0 && (
                        <div className="hidden sm:block text-xs text-muted-foreground">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    )}
                </div>

                {/* 2. Centralized Search Bar + Filter Button */}
                <div className="flex items-center space-x-2 flex-1 max-w-md mx-4 justify-center">
                    <button
                        onClick={() => setIsCommandPaletteOpen(true)}
                        className="w-full max-w-sm flex items-center justify-between px-4 py-2 bg-muted/50 border border-border hover:border-border/80 rounded-full text-xs text-muted-foreground hover:text-foreground transition shadow-sm group"
                    >
                        <span className="flex items-center text-left truncate pr-2">
                            <Search className="w-3.5 h-3.5 mr-2 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                            <span className="truncate">Search tasks, projects, users, inventory...</span>
                        </span>
                        <kbd className="px-1.5 py-0.5 text-[10px] bg-muted border border-border text-muted-foreground rounded-md font-mono">
                            ⌘K
                        </kbd>
                    </button>

                    {/* Filter Icon Button */}
                    <button
                        onClick={() => setIsCommandPaletteOpen(true)}
                        className="p-2 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        title="Filters"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* 3. Right Controls: Theme Toggle, Notifications, User Profile */}
                <div className="flex items-center space-x-3">
                    {/* Dark/Light Mode Switch Pill */}
                    <button
                        onClick={toggleTheme}
                        suppressHydrationWarning
                        className="flex items-center p-1 bg-muted/50 border border-border rounded-full text-muted-foreground hover:text-foreground transition cursor-pointer"
                        title="Toggle theme"
                    >
                        <div
                            suppressHydrationWarning
                            className={`p-1.5 rounded-full transition ${
                                isDarkMode ? 'bg-muted text-primary shadow-sm' : 'text-muted-foreground'
                            }`}
                        >
                            <Moon className="w-3.5 h-3.5" />
                        </div>
                        <div
                            suppressHydrationWarning
                            className={`p-1.5 rounded-full transition ${
                                !isDarkMode ? 'bg-muted text-primary shadow-sm' : 'text-muted-foreground'
                            }`}
                        >
                            <Sun className="w-3.5 h-3.5" />
                        </div>
                    </button>

                    {/* Notification Bell Dropdown */}
                    <NotificationDropdown />

                    {/* User Profile Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center space-x-2.5 pl-2 pr-3 py-1 bg-muted/50 border border-border hover:border-primary/50 rounded-full cursor-pointer transition shadow-sm group">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.name}
                                        className="w-6 h-6 rounded-full object-cover border border-primary/30"
                                    />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                                <span className="text-xs font-semibold text-foreground hidden md:inline truncate max-w-[100px]">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-64 p-1.5 rounded-2xl shadow-xl border border-border">
                            {/* User Identity Header */}
                            <div className="flex items-center space-x-3 p-2.5 border-b border-border mb-1">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.name}
                                        className="w-9 h-9 rounded-full object-cover border border-primary/30"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-foreground truncate">{user.name}</h4>
                                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>

                            {/* Category 1: Account Settings */}
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                                    Account Settings
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-xl">
                                    <Link href="/settings/profile" className="flex items-center w-full px-2 py-1.5">
                                        <User className="w-4 h-4 mr-2.5 text-primary" />
                                        Profile Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-xl">
                                    <Link href="/settings/security" className="flex items-center w-full px-2 py-1.5">
                                        <ShieldCheck className="w-4 h-4 mr-2.5 text-emerald-500" />
                                        Security & Passwords
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator className="my-1" />

                            {/* Category 2: App Settings */}
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                                    App Settings
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-xl">
                                    <Link href="/settings/appearance" className="flex items-center w-full px-2 py-1.5">
                                        <Palette className="w-4 h-4 mr-2.5 text-violet-500" />
                                        Appearance & Theme
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer text-xs rounded-xl">
                                    <Link href="/settings/teams" className="flex items-center w-full px-2 py-1.5">
                                        <Users className="w-4 h-4 mr-2.5 text-amber-500" />
                                        Team & Members
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator className="my-1" />

                            {/* Logout Button */}
                            <DropdownMenuItem
                                onClick={() => router.post('/logout')}
                                className="cursor-pointer text-xs rounded-xl text-destructive focus:text-destructive focus:bg-destructive/10 px-2 py-1.5"
                            >
                                <LogOut className="w-4 h-4 mr-2.5 text-destructive" />
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Command Palette Modal */}
            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                projects={allProjects}
            />
        </>
    );
}
