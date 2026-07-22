import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    CheckSquare,
    Folder,
    Plus,
    ChevronRight,
    Sliders,
    Building2,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { ProjectDrawer } from '@/components/navigation/ProjectDrawer';
import { useCurrentUrl } from '@/hooks/use-current-url';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function AppSidebar() {
    const { props } = usePage<any>();
    const { isCurrentUrl } = useCurrentUrl();
    const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);

    const starredProjects = props.starredProjects || [];
    const allProjects = props.allProjects || starredProjects;

    return (
        <>
            <Sidebar collapsible="icon" className="border-r border-border">
                {/* Brand Header */}
                <SidebarHeader className="border-b border-border p-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/dashboard" className="flex items-center space-x-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-lg shadow-lg shadow-primary/30 group-hover:scale-105 transition">
                                        ⚡
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="font-extrabold text-foreground text-sm tracking-tight group-hover:text-primary transition">
                                            Aero DevPM
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-mono">v1.0 • Core</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    {/* WORKSPACE SECTION */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={isCurrentUrl('/dashboard')} asChild>
                                        <Link href="/dashboard">
                                            <LayoutGrid className="w-4 h-4 text-primary" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={isCurrentUrl('/my-desk')} asChild>
                                        <Link href="/my-desk">
                                            <CheckSquare className="w-4 h-4 text-emerald-500" />
                                            <span>My Desk</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={isCurrentUrl('/departments')} asChild>
                                        <Link href="/departments">
                                            <Building2 className="w-4 h-4 text-purple-400" />
                                            <span>Departments</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* PROJECTS SECTION */}
                    <SidebarGroup>
                        <SidebarGroupLabel className="flex items-center justify-between w-full pr-0">
                            <span>Starred Projects</span>
                            <button
                                onClick={() => setIsProjectDrawerOpen(true)}
                                className="text-[10px] text-primary hover:text-primary/80 font-medium transition flex items-center mr-1"
                            >
                                Browse <ChevronRight className="w-3 h-3 ml-0.5" />
                            </button>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {starredProjects.length > 0 ? (
                                    starredProjects.slice(0, 5).map((project: any) => (
                                        <SidebarMenuItem key={project.id}>
                                            <SidebarMenuButton isActive={isCurrentUrl(`/projects/${project.id}`)} asChild>
                                                <Link href={`/projects/${project.id}`}>
                                                    <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                                                    <span className="truncate">{project.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                ) : (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/projects" className="text-muted-foreground">
                                                <Folder className="w-4 h-4" />
                                                <span>All Projects Hub</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => setIsProjectDrawerOpen(true)} className="text-muted-foreground">
                                        <Plus className="w-4 h-4" />
                                        <span>Projects Drawer</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* SYSTEM SECTION */}
                    <SidebarGroup>
                        <SidebarGroupLabel>System</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={isCurrentUrl('/projects')} asChild>
                                        <Link href="/projects">
                                            <Folder className="w-4 h-4 text-indigo-500" />
                                            <span>Projects Directory</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={isCurrentUrl('/settings/profile')} asChild>
                                        <Link href="/settings/profile">
                                            <Sliders className="w-4 h-4 text-muted-foreground" />
                                            <span>Settings</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="border-t border-border p-3">
                    <NavUser />
                </SidebarFooter>
            </Sidebar>

            <ProjectDrawer
                isOpen={isProjectDrawerOpen}
                onClose={() => setIsProjectDrawerOpen(false)}
                projects={allProjects}
            />
        </>
    );
}
