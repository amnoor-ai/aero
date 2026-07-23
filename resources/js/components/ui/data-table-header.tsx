import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, EyeOff } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableHeaderProps {
    title: string;
    columnKey: string;
    currentSortBy?: string;
    currentOrder?: string;
    onSort: (columnKey: string, order: 'asc' | 'desc') => void;
    onHideColumn?: (columnKey: string) => void;
    className?: string;
}

export function DataTableHeader({
    title,
    columnKey,
    currentSortBy,
    currentOrder,
    onSort,
    onHideColumn,
    className = '',
}: DataTableHeaderProps) {
    const isSorted = currentSortBy === columnKey;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={`flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition group focus:outline-none ${className}`}
                >
                    <span>{title}</span>
                    {isSorted ? (
                        currentOrder === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-primary shrink-0" />
                        ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-primary shrink-0" />
                        )
                    ) : (
                        <ArrowUpDown className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground transition shrink-0" />
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onClick={() => onSort(columnKey, 'asc')} className="text-xs cursor-pointer">
                    <ArrowUp className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                    Sort Ascending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSort(columnKey, 'desc')} className="text-xs cursor-pointer">
                    <ArrowDown className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                    Sort Descending
                </DropdownMenuItem>

                {onHideColumn && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onHideColumn(columnKey)} className="text-xs text-rose-400 focus:text-rose-400 cursor-pointer">
                            <EyeOff className="w-3.5 h-3.5 mr-2" />
                            Hide Column
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
