import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Link>;

export default function TextLink({
    className = '',
    children,
    ...props
}: Props) {
    return (
        <Link
            className={cn(
                'text-primary font-semibold underline underline-offset-4 hover:text-primary/80 transition-colors text-xs',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
