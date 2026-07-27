import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DocumentItem } from './MediaPreviewModal';

interface RenameDocumentModalProps {
    document: DocumentItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function RenameDocumentModal({ document, isOpen, onClose }: RenameDocumentModalProps) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (document) {
            setName(document.name);
        }
    }, [document]);

    if (!document) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Document title cannot be empty.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        router.patch(
            `/departments/documents/${document.id}`,
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
                    setError(Object.values(errors)[0] as string || 'Failed to rename document.');
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-background border shadow-lg rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-primary" />
                        Rename Document
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {error && (
                        <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Document Title</label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter document title"
                            autoFocus
                        />
                    </div>

                    <DialogFooter className="pt-2 gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !name.trim()}>
                            {isSubmitting ? 'Saving...' : 'Save Title'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
