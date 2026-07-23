import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationBarProps {
    pagination: {
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        links: PaginationLink[];
    };
    className?: string;
}

export function PaginationBar({ pagination, className = '' }: PaginationBarProps) {
    if (!pagination || pagination.total === 0 || pagination.last_page <= 1) {
        return null;
    }

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50 text-xs text-muted-foreground ${className}`}>
            <div>
                Showing <strong className="text-foreground">{pagination.from || 0}</strong> to{' '}
                <strong className="text-foreground">{pagination.to || 0}</strong> of{' '}
                <strong className="text-foreground">{pagination.total}</strong> results
            </div>

            <div className="flex items-center space-x-1">
                {pagination.links.map((link, idx) => {
                    const isPrev = link.label.includes('&laquo;') || link.label.includes('Previous');
                    const isNext = link.label.includes('&raquo;') || link.label.includes('Next');

                    if (!link.url) {
                        return (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-muted-foreground/40 rounded-md border border-border/30 cursor-not-allowed select-none"
                            >
                                {isPrev ? <ChevronLeft className="w-3.5 h-3.5" /> : isNext ? <ChevronRight className="w-3.5 h-3.5" /> : link.label}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={idx}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                                link.active
                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm font-bold'
                                    : 'bg-background hover:bg-muted text-foreground border-border'
                            }`}
                        >
                            {isPrev ? <ChevronLeft className="w-3.5 h-3.5" /> : isNext ? <ChevronRight className="w-3.5 h-3.5" /> : link.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
