import { useForm } from '@inertiajs/react';
import { Building2, Upload, FileText, X } from 'lucide-react';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface UserItem {
    id: number;
    name: string;
    email: string;
}

interface CreateDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceUsers: UserItem[];
}

export function CreateDepartmentModal({
    isOpen,
    onClose,
    workspaceUsers,
}: CreateDepartmentModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        description: '',
        director_id: '',
        location: '',
        status: 'active',
        mandate_file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/departments', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('mandate_file', e.target.files[0]);
        }
    };

    const removeFile = () => {
        setData('mandate_file', null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center space-x-2 text-primary">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <DialogTitle className="text-xl">
                                Create Department
                            </DialogTitle>
                        </div>
                        <DialogDescription>
                            Establish a new organizational department, assign
                            leadership, location, and mandate documentation.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Name & Code Row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 space-y-1.5">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-semibold"
                                >
                                    Department Name *
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Engineering & Infrastructure"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="code"
                                    className="text-xs font-semibold"
                                >
                                    Code *
                                </Label>
                                <Input
                                    id="code"
                                    placeholder="e.g. ENG"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData(
                                            'code',
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    maxLength={10}
                                    required
                                />
                                {errors.code && (
                                    <p className="text-xs text-destructive">
                                        {errors.code}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Director & Location */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="director_id"
                                    className="text-xs font-semibold"
                                >
                                    Department Director
                                </Label>
                                <select
                                    id="director_id"
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-ring focus:outline-none"
                                    value={data.director_id}
                                    onChange={(e) =>
                                        setData('director_id', e.target.value)
                                    }
                                >
                                    <option value="">Select Director...</option>
                                    {workspaceUsers.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.director_id && (
                                    <p className="text-xs text-destructive">
                                        {errors.director_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="location"
                                    className="text-xs font-semibold"
                                >
                                    Location / Office
                                </Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. Building A - Floor 3"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                />
                                {errors.location && (
                                    <p className="text-xs text-destructive">
                                        {errors.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="description"
                                className="text-xs font-semibold"
                            >
                                Description & Mandate Summary
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the department's core responsibilities and strategic mandate..."
                                rows={3}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            {errors.description && (
                                <p className="text-xs text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Mandate File Upload Dropzone */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Department Mandate Document (PDF, DOCX, TXT)
                            </Label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileChange}
                            />

                            {data.mandate_file ? (
                                <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
                                    <div className="flex items-center space-x-2 truncate">
                                        <FileText className="h-5 w-5 shrink-0 text-primary" />
                                        <div className="truncate">
                                            <p className="truncate text-xs font-semibold">
                                                {data.mandate_file.name}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {(
                                                    data.mandate_file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{' '}
                                                MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                        onClick={removeFile}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex cursor-pointer flex-col items-center justify-center space-y-1 rounded-lg border-2 border-dashed border-border p-4 text-center transition hover:border-primary/50 hover:bg-muted/50"
                                >
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                    <p className="text-xs font-medium text-foreground">
                                        Click to upload official mandate file
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        Supports PDF, DOCX up to 10MB
                                    </p>
                                </div>
                            )}
                            {errors.mandate_file && (
                                <p className="text-xs text-destructive">
                                    {errors.mandate_file}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-primary-foreground"
                        >
                            {processing ? 'Creating...' : 'Create Department'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
