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
            <div className="flex h-screen w-full bg-muted/20 overflow-hidden text-foreground font-sans">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0 h-screen">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <div className="flex-1 flex flex-col px-2 pb-2 min-h-0">
                        <main className="flex-1 min-w-0 bg-background rounded-xl border border-border/60 shadow-sm overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
