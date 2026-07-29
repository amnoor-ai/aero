import { X, FolderPlus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateFolder: (folderName: string) => void;
}

export function CreateFolderModal({ isOpen, onClose, onCreateFolder }: CreateFolderModalProps) {
    const [folderName, setFolderName] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!folderName.trim()) {
            toast.error('Please enter a folder name.');

            return;
        }

        onCreateFolder(folderName.trim());
        toast.success(`Folder "${folderName.trim()}" created successfully!`);
        setFolderName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto text-foreground"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                    <div>
                        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                            <FolderPlus className="w-4 h-4 text-primary" />
                            <span>Create New Folder</span>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Organize your project documents, designs, and media into folders.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-foreground block">Folder Name <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="e.g. Design Assets, Specifications, Wireframes"
                            autoFocus
                            className="w-full mt-1.5 h-9 px-3 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition"
                            required
                        />
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose} className="h-9 text-xs">
                            Cancel
                        </Button>
                        <Button type="submit" className="h-9 px-4 bg-primary text-primary-foreground font-bold text-xs">
                            Create Folder
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
