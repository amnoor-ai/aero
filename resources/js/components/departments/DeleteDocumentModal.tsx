import { router } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import type { DocumentItem } from './MediaPreviewModal';

interface DeleteDocumentModalProps {
    document: DocumentItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteDocumentModal({
    document,
    isOpen,
    onClose,
}: DeleteDocumentModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!document) {
        return null;
    }

    const handleDelete = () => {
        setIsDeleting(true);
        const deleteUrl = document.delete_url || (document.view_url ? document.view_url.replace('/view', '') : `/departments/documents/${document.id}`);
        router.delete(deleteUrl, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                onClose();
            },
            onError: () => setIsDeleting(false),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rounded-xl border bg-background shadow-lg sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Document
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-2 py-2 text-sm text-muted-foreground">
                    <p>
                        Are you sure you want to delete{' '}
                        <strong className="text-foreground">
                            {document.name}
                        </strong>
                        ?
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        This action cannot be undone and will permanently delete
                        the file from department records.
                    </p>
                </div>

                <DialogFooter className="gap-2 pt-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Document'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
