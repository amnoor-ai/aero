import { router } from '@inertiajs/react';
import { Upload } from 'lucide-react';
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

interface UploadDepartmentDocModalProps {
    departmentId: number;
    isOpen: boolean;
    onClose: () => void;
}

export function UploadDepartmentDocModal({
    departmentId,
    isOpen,
    onClose,
}: UploadDepartmentDocModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            if (!name) {
                // Pre-fill name without extension
                const nameWithoutExt =
                    selectedFile.name.substring(
                        0,
                        selectedFile.name.lastIndexOf('.'),
                    ) || selectedFile.name;
                setName(nameWithoutExt);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file to upload.');

            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        if (name) {
            formData.append('name', name);
        }

        router.post(`/departments/${departmentId}/documents`, formData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsUploading(false);
                setFile(null);
                setName('');
                onClose();
            },
            onError: (errors) => {
                setIsUploading(false);
                setError(
                    (Object.values(errors)[0] as string) ||
                        'Failed to upload document.',
                );
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rounded-xl border bg-background shadow-lg sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Upload className="h-5 w-5 text-primary" />
                        Upload Department Document
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
                            Select File *
                        </label>
                        <div className="flex w-full items-center justify-center">
                            <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:bg-muted/50">
                                <div className="flex flex-col items-center justify-center px-4 pt-5 pb-6 text-center">
                                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {file
                                            ? file.name
                                            : 'Click to select or drag and drop file'}
                                    </p>
                                    <p className="mt-1 text-[10px] text-muted-foreground/70">
                                        PDF, DOCX, XLSX, PNG, JPG, MP4, etc.
                                        (Max 50MB)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Document Title (Optional)
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g. Q3 Strategic Mandate"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="gap-2 pt-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUploading || !file}>
                            {isUploading ? 'Uploading...' : 'Upload Document'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
