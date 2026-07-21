import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import {
    Search,
    SlidersHorizontal,
    Sun,
    Moon,
    Bell,
    User as UserIcon,
    Zap,
} from 'lucide-react';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
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
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // Toggle dark mode class on document element if needed
        document.documentElement.classList.toggle('dark');
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

                {/* 2. Centralized Search Bar + Filter Button (Inspired by Taskly) */}
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
                        className="flex items-center p-1 bg-muted/50 border border-border rounded-full text-muted-foreground hover:text-foreground transition"
                        title="Toggle theme"
                    >
                        <div
                            className={`p-1.5 rounded-full transition ${
                                isDarkMode ? 'bg-muted text-primary shadow-sm' : 'text-muted-foreground'
                            }`}
                        >
                            <Moon className="w-3.5 h-3.5" />
                        </div>
                        <div
                            className={`p-1.5 rounded-full transition ${
                                !isDarkMode ? 'bg-muted text-primary shadow-sm' : 'text-muted-foreground'
                            }`}
                        >
                            <Sun className="w-3.5 h-3.5" />
                        </div>
                    </button>

                    {/* Notification Bell Button */}
                    <button className="relative p-2 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive ring-2 ring-background" />
                    </button>

                    {/* User Profile Pill */}
                    <div className="flex items-center space-x-2.5 pl-2 pr-3 py-1 bg-muted/50 border border-border rounded-full">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold uppercase">
                            {user.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-foreground hidden md:inline truncate max-w-[100px]">
                            {user.name}
                        </span>
                    </div>
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
