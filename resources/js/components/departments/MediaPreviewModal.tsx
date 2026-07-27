import React from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
    if (!fileType) return false;
    const ext = fileType.toLowerCase().trim();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm', 'ogg', 'mov'].includes(ext);
}

export function isVideoFileType(fileType?: string | null): boolean {
    if (!fileType) return false;
    const ext = fileType.toLowerCase().trim();
    return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
}

export function formatUploadedDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0) return 'Just now';
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);
        return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
    }
    if (diffInSeconds < 86400) { // 24 hours
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
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function MediaPreviewModal({ document, isOpen, onClose }: MediaPreviewModalProps) {
    if (!document) return null;

    const viewUrl = `/departments/documents/${document.id}/view`;
    const downloadUrl = `/departments/documents/${document.id}/download`;
    const isVideo = isVideoFileType(document.file_type);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-[92vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background border shadow-2xl rounded-xl">
                <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-base font-semibold truncate flex items-center gap-2 max-w-[70%]">
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{document.name}</span>
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <a href={downloadUrl} download className="inline-flex">
                            <Button variant="outline" size="sm" className="gap-1.5 h-8">
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Download</span>
                            </Button>
                        </a>
                        <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
                            <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Open in tab</span>
                            </Button>
                        </a>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-muted/30 min-h-[300px]">
                    {isVideo ? (
                        <video controls autoPlay className="max-h-[70vh] max-w-full rounded-md shadow-sm">
                            <source src={viewUrl} type={`video/${document.file_type || 'mp4'}`} />
                            Your browser does not support playing this video.
                        </video>
                    ) : (
                        <img
                            src={viewUrl}
                            alt={document.name}
                            className="max-h-[70vh] max-w-full object-contain rounded-md shadow-sm"
                        />
                    )}
                </div>

                <div className="p-3 border-t bg-card text-xs text-muted-foreground flex justify-between items-center">
                    <div>
                        {document.department && <span className="font-medium text-foreground mr-2">[{document.department.code}]</span>}
                        <span>Size: {formatFileSize(document.file_size)}</span>
                    </div>
                    <div>Uploaded {formatUploadedDate(document.created_at)}</div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
