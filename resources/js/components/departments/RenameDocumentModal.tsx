import { router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { DocumentItem } from './MediaPreviewModal';

interface RenameDocumentModalProps {
    document: DocumentItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function RenameDocumentModal({
    document,
    isOpen,
    onClose,
}: RenameDocumentModalProps) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prevDocId, setPrevDocId] = useState<number | null>(null);

    if (document && document.id !== prevDocId) {
        setPrevDocId(document.id);
        setName(document.name);
        setError(null);
    }

    if (!document) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Document title cannot be empty.');

            return;
        }

        setIsSubmitting(true);
        setError(null);

        const updateUrl = document.view_url ? document.view_url.replace('/view', '') : `/departments/documents/${document.id}`;

        router.patch(
            updateUrl,
            { name: name.trim() },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    setError(
                        (Object.values(errors)[0] as string) ||
                            'Failed to rename document.',
                    );
                },
            },
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rounded-xl border bg-background shadow-lg sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Pencil className="h-4 w-4 text-primary" />
                        Rename Document
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {error && (
                        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Document Title
                        </label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter document title"
                            autoFocus
                        />
                    </div>

                    <DialogFooter className="gap-2 pt-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Title'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
