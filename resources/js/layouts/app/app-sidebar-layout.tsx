import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background overflow-hidden text-foreground font-sans">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-background">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <main className="flex-1 min-w-0">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    );
}
