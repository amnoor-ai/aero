import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Upload, FileText, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UploadDepartmentDocModalProps {
    departmentId: number;
    isOpen: boolean;
    onClose: () => void;
}

export function UploadDepartmentDocModal({ departmentId, isOpen, onClose }: UploadDepartmentDocModalProps) {
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
                const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
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
                setError(Object.values(errors)[0] as string || 'Failed to upload document.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-background border shadow-lg rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Upload Department Document
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {error && (
                        <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Select File *</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {file ? file.name : 'Click to select or drag and drop file'}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                                        PDF, DOCX, XLSX, PNG, JPG, MP4, etc. (Max 50MB)
                                    </p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Document Title (Optional)</label>
                        <Input
                            type="text"
                            placeholder="e.g. Q3 Strategic Mandate"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="pt-2 gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
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
