import React from 'react';
import { Columns, Eye, EyeOff } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export interface ColumnDefinition {
    key: string;
    label: string;
    visible: boolean;
}

interface ColumnVisibilityPopoverProps {
    columns: ColumnDefinition[];
    onToggleColumn: (key: string) => void;
    onResetColumns?: () => void;
}

export function ColumnVisibilityPopover({
    columns,
    onToggleColumn,
    onResetColumns,
}: ColumnVisibilityPopoverProps) {
    const hiddenCount = columns.filter((c) => !c.visible).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-border relative">
                    <Columns className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                    <span>View Columns</span>
                    {hiddenCount > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                            {hiddenCount} hidden
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Toggle Column Visibility</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((col) => (
                    <DropdownMenuCheckboxItem
                        key={col.key}
                        checked={col.visible}
                        onCheckedChange={() => onToggleColumn(col.key)}
                        className="text-xs cursor-pointer"
                    >
                        {col.label}
                    </DropdownMenuCheckboxItem>
                ))}

                {onResetColumns && hiddenCount > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <button
                            type="button"
                            onClick={onResetColumns}
                            className="w-full text-left px-2 py-1 text-[11px] text-primary hover:underline font-semibold"
                        >
                            Reset All Columns
                        </button>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
