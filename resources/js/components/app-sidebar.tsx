import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    CheckSquare,
    Folder,
    Plus,
    ChevronRight,
    Sliders,
    Building2,
    Activity,
    Target,
    BarChart3,
    FileText,
} from 'lucide-react';
import React, { useState } from 'react';
import { NavUser } from '@/components/nav-user';
import { ProjectDrawer } from '@/components/navigation/ProjectDrawer';
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
import { useCurrentUrl } from '@/hooks/use-current-url';

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
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/dashboard')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/dashboard" className="group/link flex items-center gap-2">
                                            <LayoutGrid className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/my-desk')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/my-desk" className="group/link flex items-center gap-2">
                                            <CheckSquare className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">My Desk</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/departments')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/departments" className="group/link flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">Departments</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/documentation')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/documentation" className="group/link flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">Documentation</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* PROJECTS & PLANNING SECTION */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Projects & Planning</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/tasks')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/tasks" className="group/link flex items-center gap-2">
                                            <CheckSquare className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">Tasks Directory</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/projects')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/projects" className="group/link flex items-center gap-2">
                                            <Folder className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">Projects Hub</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/milestones')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/milestones" className="group/link flex items-center gap-2">
                                            <Target className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">Milestones</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/work-plan')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/work-plan" className="group/link flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">Work Plan (Roadmap)</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* STARRED PROJECTS SECTION */}
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
                                            <SidebarMenuButton 
                                                isActive={isCurrentUrl(`/projects/${project.id}`)} 
                                                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                                asChild
                                            >
                                                <Link href={`/projects/${project.id}`} className="group/link flex items-center gap-2">
                                                    <Folder className="w-4 h-4 text-muted-foreground group-hover/link:text-primary shrink-0 transition-colors" />
                                                    <span className="truncate font-medium">{project.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                ) : (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/projects" className="group/link text-muted-foreground hover:text-foreground">
                                                <Folder className="w-4 h-4 text-muted-foreground group-hover/link:text-primary" />
                                                <span>All Projects Hub</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => setIsProjectDrawerOpen(true)} className="text-muted-foreground hover:text-foreground">
                                        <Plus className="w-4 h-4 text-muted-foreground" />
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
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/system/logs') || isCurrentUrl('/activities')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/system/logs" className="group/link flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">System Audit Logs</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isCurrentUrl('/settings/profile')} 
                                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:[&_svg]:text-primary-foreground font-semibold rounded-md transition-all shadow-xs"
                                        asChild
                                    >
                                        <Link href="/settings/profile" className="group/link flex items-center gap-2">
                                            <Sliders className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                            <span className="font-medium">Settings</span>
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
