import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppearanceToggleTab from '@/components/appearance-tabs';

export default function Welcome() {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard({ query: { current_team: currentTeam.slug } }).url : '/';

    return (
        <>
            <Head title="Welcome to Aero" />
            <div className="relative min-h-screen bg-background text-foreground flex flex-col">
                
                {/* 1. Navigation Header */}
                <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
                    <div className="container mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                                <span className="text-primary font-bold text-xl leading-none">A</span>
                            </div>
                            <span className="font-semibold text-lg tracking-tight">Aero</span>
                        </div>

                        {/* Right side links & Theme Toggle */}
                        <nav className="flex items-center gap-4 sm:gap-6">
                            <AppearanceToggleTab />
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium hover:text-primary transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col items-center">
                    
                    {/* 2. Hero Section */}
                    <section className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />



                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6 max-w-4xl text-balance">
                            Build with momentum. <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-ring">Ship with confidence.</span>
                        </h1>

                        {/* Sub-headline */}
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 text-balance">
                            The high-density project management workspace designed to keep your engineering workflows fast, focused, and completely in sync.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="inline-flex h-12 items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={register()}
                                    className="inline-flex h-12 items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                                >
                                    Start building for free
                                </Link>
                            )}
                            <a
                                href="https://github.com/amnoor-ai/aero"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-transparent px-8 font-medium hover:bg-muted transition-all"
                            >
                                View Documentation
                            </a>
                        </div>
                    </section>

                    {/* 3. Dashboard Preview Asset (Placeholder) */}
                    <section className="relative w-full max-w-6xl mx-auto px-6 pb-32">
                        <div className="relative aspect-[16/10] sm:aspect-video w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-card to-popover group">
                            <div className="absolute top-4 left-4 flex gap-2 opacity-60">
                                <div className="size-3 rounded-full bg-destructive" />
                                <div className="size-3 rounded-full bg-chart-4" />
                                <div className="size-3 rounded-full bg-chart-2" />
                            </div>
                            
                            <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-6 border border-border shadow-sm group-hover:scale-105 transition-transform">
                                <svg className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-2">Nexus Workspace Preview</h3>
                            <p className="text-muted-foreground max-w-md">
                                Replace this container with a high-resolution screenshot or WebM video loop of the actual Aero dashboard (`/images/dashboard-preview.png`).
                            </p>
                        </div>
                    </section>

                    {/* 4. Lean Feature Grid */}
                    <section className="w-full max-w-7xl mx-auto px-6 pb-32">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="group rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-primary/30">
                                <div className="size-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                                    <svg className="size-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-3">High-Density Tasks</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Manage complex engineering tickets with a distraction-free interface designed for speed, clarity, and deep work.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-chart-4/30">
                                <div className="size-12 rounded-lg bg-chart-4/10 border border-chart-4/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-chart-4/20 transition-all">
                                    <svg className="size-6 text-chart-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-3">Agile Sprints</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Plan, execute, and deliver your sprints with real-time progress tracking, velocity metrics, and burndown analytics.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-chart-2/30">
                                <div className="size-12 rounded-lg bg-chart-2/10 border border-chart-2/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-chart-2/20 transition-all">
                                    <svg className="size-6 text-chart-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium mb-3">Sync Workflows</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Automate state transitions via GitHub integrations and keep your entire team aligned without constant manual updates.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* 5. Footer */}
                <footer className="w-full border-t border-border bg-muted/30 py-12 mt-auto">
                    <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="size-6 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                                <span className="text-primary font-bold text-xs leading-none">A</span>
                            </div>
                            <span className="font-semibold text-base tracking-tight">Aero</span>
                            <span className="text-muted-foreground text-sm ml-2">© {new Date().getFullYear()}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
