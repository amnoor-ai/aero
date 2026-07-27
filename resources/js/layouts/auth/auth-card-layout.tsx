import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 text-foreground">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center justify-center gap-2.5 self-center font-bold text-foreground transition-transform hover:scale-105"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-2xs">
                        <AppLogoIcon className="size-6 fill-current text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">Aero DevPM</span>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl border border-border bg-card shadow-xs">
                        <CardHeader className="px-8 pt-8 pb-2 text-center space-y-1.5">
                            <CardTitle className="text-xl font-bold tracking-tight text-foreground">{title}</CardTitle>
                            {description && (
                                <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="px-8 py-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
