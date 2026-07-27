import { Download, FileText } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export interface DocumentItem {
    id: number;
    department_id: number;
    name: string;
    file_path: string;
    file_type: string | null;
    file_size: number;
    created_at: string;
    uploaded_by?: { id: number; name: string };
    department?: { id: number; name: string; code: string };
}

interface MediaPreviewModalProps {
    document: DocumentItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function isMediaFileType(fileType?: string | null): boolean {
    if (!fileType) {
        return false;
    }

    const ext = fileType.toLowerCase().trim();

    return [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'svg',
        'mp4',
        'webm',
        'ogg',
        'mov',
    ].includes(ext);
}

export function isVideoFileType(fileType?: string | null): boolean {
    if (!fileType) {
        return false;
    }

    const ext = fileType.toLowerCase().trim();

    return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
}

export function formatUploadedDate(dateString: string): string {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0) {
        return 'Just now';
    }

    if (diffInSeconds < 60) {
        return 'Just now';
    }

    if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);

        return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
    }

    if (diffInSeconds < 86400) {
        // 24 hours
        const hours = Math.floor(diffInSeconds / 3600);

        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) {
        return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function MediaPreviewModal({
    document,
    isOpen,
    onClose,
}: MediaPreviewModalProps) {
    if (!document) {
        return null;
    }

    const viewUrl = `/departments/documents/${document.id}/view`;
    const downloadUrl = `/departments/documents/${document.id}/download`;
    const isVideo = isVideoFileType(document.file_type);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="flex max-h-[90vh] w-[92vw] max-w-4xl flex-col gap-0 overflow-hidden rounded-xl border bg-background p-0 shadow-2xl">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 border-b p-4">
                    <DialogTitle className="flex max-w-[70%] items-center gap-2 truncate text-base font-semibold">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{document.name}</span>
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <a href={downloadUrl} download className="inline-flex">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5"
                            >
                                <Download className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">
                                    Download
                                </span>
                            </Button>
                        </a>
                        <a
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex"
                        >
                            {/* <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Open in tab</span>
                            </Button> */}
                        </a>
                    </div>
                </DialogHeader>

                <div className="flex min-h-[300px] flex-1 items-center justify-center overflow-auto bg-muted/30 p-4">
                    {isVideo ? (
                        <video
                            controls
                            autoPlay
                            className="max-h-[70vh] max-w-full rounded-md shadow-sm"
                        >
                            <source
                                src={viewUrl}
                                type={`video/${document.file_type || 'mp4'}`}
                            />
                            Your browser does not support playing this video.
                        </video>
                    ) : (
                        <img
                            src={viewUrl}
                            alt={document.name}
                            className="max-h-[70vh] max-w-full rounded-md object-contain shadow-sm"
                        />
                    )}
                </div>

                <div className="flex items-center justify-between border-t bg-card p-3 text-xs text-muted-foreground">
                    <div>
                        {document.department && (
                            <span className="mr-2 font-medium text-foreground">
                                [{document.department.code}]
                            </span>
                        )}
                        <span>Size: {formatFileSize(document.file_size)}</span>
                    </div>
                    <div>
                        Uploaded {formatUploadedDate(document.created_at)}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
