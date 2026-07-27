import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DocumentItem } from './MediaPreviewModal';

interface DeleteDocumentModalProps {
    document: DocumentItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteDocumentModal({ document, isOpen, onClose }: DeleteDocumentModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!document) return null;

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/departments/documents/${document.id}`, {
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
            <DialogContent className="sm:max-w-md bg-background border shadow-lg rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        Delete Document
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2 text-sm text-muted-foreground space-y-2">
                    <p>
                        Are you sure you want to delete <strong className="text-foreground">{document.name}</strong>?
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        This action cannot be undone and will permanently delete the file from department records.
                    </p>
                </div>

                <DialogFooter className="pt-2 gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete Document'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
