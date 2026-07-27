import { Download, FileText, ExternalLink } from 'lucide-react';
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

export function isImageFileType(fileType?: string | null): boolean {
    if (!fileType) {
        return false;
    }

    const ext = fileType.toLowerCase().trim();

    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
}

export function isPdfFileType(fileType?: string | null): boolean {
    if (!fileType) {
        return false;
    }

    return fileType.toLowerCase().trim() === 'pdf';
}

export function formatUploadedDate(dateString: string): string {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0 || diffInSeconds < 60) {
        return 'Just now';
    }

    if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);

        return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
    }

    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);

        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatFileSize(bytes: number | null | undefined): string {
    if (!bytes || bytes === 0) {
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
    const [hasLoadError, setHasLoadError] = React.useState(false);

    React.useEffect(() => {
        setHasLoadError(false);
    }, [document]);

    if (!document) {
        return null;
    }

    const viewUrl = `/departments/documents/${document.id}/view`;
    const downloadUrl = `/departments/documents/${document.id}/download`;

    const isVideo = isVideoFileType(document.file_type);
    const isImage = isImageFileType(document.file_type);
    const isPdf = isPdfFileType(document.file_type);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="flex max-h-[92vh] w-[95vw] max-w-5xl flex-col gap-0 overflow-hidden rounded-xl border border-border bg-background p-0 shadow-2xl">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border p-4">
                    <DialogTitle className="flex max-w-[70%] items-center gap-2 truncate text-base font-bold text-foreground">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{document.name}</span>
                        {document.file_type && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase font-mono text-muted-foreground">
                                .{document.file_type}
                            </span>
                        )}
                    </DialogTitle>

                    <div className="flex items-center gap-2">
                        <a href={downloadUrl} download className="inline-flex">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-xs"
                            >
                                <Download className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Download</span>
                            </Button>
                        </a>
                    </div>
                </DialogHeader>

                <div className="flex min-h-[400px] flex-1 items-center justify-center overflow-auto bg-muted/20 p-4">
                    {hasLoadError ? (
                        <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-border bg-card p-10 text-center">
                            <div className="rounded-2xl bg-amber-500/10 p-4 text-amber-500">
                                <FileText className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-foreground">Unable to Display Preview Directly</h3>
                                <p className="mt-1 text-xs text-muted-foreground max-w-md">
                                    This document or media file could not be displayed directly in the browser. Please download the file to view it using your local computer applications.
                                </p>
                            </div>
                            <div className="pt-2">
                                <a href={downloadUrl} download className="inline-flex">
                                    <Button size="sm" className="gap-2 bg-primary text-primary-foreground text-xs font-semibold">
                                        <Download className="h-4 w-4" />
                                        <span>Download File First to View</span>
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ) : isVideo ? (
                        <video
                            controls
                            autoPlay
                            onError={() => setHasLoadError(true)}
                            className="max-h-[75vh] max-w-full rounded-lg shadow-md"
                        >
                            <source
                                src={viewUrl}
                                type={`video/${document.file_type || 'mp4'}`}
                            />
                            Your browser does not support playing this video.
                        </video>
                    ) : isImage ? (
                        <img
                            src={viewUrl}
                            alt={document.name}
                            onError={() => setHasLoadError(true)}
                            className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-md"
                        />
                    ) : isPdf ? (
                        <iframe
                            src={viewUrl}
                            title={document.name}
                            onError={() => setHasLoadError(true)}
                            className="h-[75vh] w-full rounded-lg border border-border shadow-xs"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-border bg-card p-10 text-center">
                            <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                                <FileText className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-foreground">{document.name}</h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Format: <span className="uppercase font-mono font-semibold">{document.file_type || 'Unknown'}</span> • Size: {formatFileSize(document.file_size)}
                                </p>
                            </div>
                            <div className="pt-2">
                                <a href={downloadUrl} download className="inline-flex">
                                    <Button size="sm" className="gap-2 bg-primary text-primary-foreground text-xs font-semibold">
                                        <Download className="h-4 w-4" />
                                        <span>Download File to View</span>
                                    </Button>
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-border bg-card p-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        {document.department && (
                            <span className="rounded bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                                {document.department.name} ({document.department.code})
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
