import { AlertTriangle, X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    isDeleting?: boolean;
}

export function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    description,
    itemName,
    isDeleting = false,
}: ConfirmDeleteModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl space-y-5 text-foreground"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg transition"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-foreground leading-snug">{title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {description || (
                                <>
                                    Are you sure you want to delete{' '}
                                    {itemName ? <span className="font-semibold text-foreground">"{itemName}"</span> : 'this item'}? This action cannot be undone.
                                </>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border/60">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="text-xs font-semibold h-8 border-border"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="text-xs font-bold h-8 bg-rose-600 hover:bg-rose-700 text-white border-0 px-4"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
