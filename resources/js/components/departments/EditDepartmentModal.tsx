import React, { useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Building2, Upload, FileText, X } from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    email: string;
}

interface DepartmentData {
    id: number;
    name: string;
    code: string;
    description: string | null;
    director_id: number | null;
    location: string | null;
    status: string;
    mandate_file_name: string | null;
}

interface EditDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    department: DepartmentData | null;
    workspaceUsers: UserItem[];
}

export function EditDepartmentModal({ isOpen, onClose, department, workspaceUsers }: EditDepartmentModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'patch',
        name: '',
        code: '',
        description: '',
        director_id: '',
        location: '',
        status: 'active',
        mandate_file: null as File | null,
    });

    useEffect(() => {
        if (department) {
            setData({
                _method: 'patch',
                name: department.name || '',
                code: department.code || '',
                description: department.description || '',
                director_id: department.director_id ? String(department.director_id) : '',
                location: department.location || '',
                status: department.status || 'active',
                mandate_file: null,
            });
        }
    }, [department]);

    if (!department) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/departments/${department.id}`, {
            forceFormData: true,
            onSuccess: () => {
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
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center space-x-2 text-primary">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <DialogTitle className="text-xl">Edit Department</DialogTitle>
                        </div>
                        <DialogDescription>
                            Update department leadership, description, location, or mandate attachments.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Name & Code Row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 space-y-1.5">
                                <Label htmlFor="edit-name" className="text-xs font-semibold">Department Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-code" className="text-xs font-semibold">Code *</Label>
                                <Input
                                    id="edit-code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    maxLength={10}
                                    required
                                />
                                {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
                            </div>
                        </div>

                        {/* Director & Location */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-director" className="text-xs font-semibold">Department Director</Label>
                                <select
                                    id="edit-director"
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={data.director_id}
                                    onChange={(e) => setData('director_id', e.target.value)}
                                >
                                    <option value="">Select Director...</option>
                                    {workspaceUsers.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.director_id && <p className="text-xs text-destructive">{errors.director_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-location" className="text-xs font-semibold">Location / Office</Label>
                                <Input
                                    id="edit-location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                />
                                {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                            </div>
                        </div>

                        {/* Status Selection */}
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-status" className="text-xs font-semibold">Status</Label>
                            <select
                                id="edit-status"
                                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-description" className="text-xs font-semibold">Description & Mandate Summary</Label>
                            <Textarea
                                id="edit-description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                        </div>

                        {/* Mandate File Upload Dropzone */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Mandate Document {department.mandate_file_name && '(Currently: ' + department.mandate_file_name + ')'}
                            </Label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileChange}
                            />
                            
                            {data.mandate_file ? (
                                <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5">
                                    <div className="flex items-center space-x-2 truncate">
                                        <FileText className="w-5 h-5 text-primary shrink-0" />
                                        <div className="truncate">
                                            <p className="text-xs font-semibold truncate">{data.mandate_file.name}</p>
                                            <p className="text-[10px] text-muted-foreground">New Replacement Document</p>
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={removeFile}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition flex items-center justify-center space-x-2"
                                >
                                    <Upload className="w-4 h-4 text-muted-foreground" />
                                    <p className="text-xs font-medium text-foreground">
                                        {department.mandate_file_name ? 'Click to replace mandate file' : 'Click to upload mandate file'}
                                    </p>
                                </div>
                            )}
                            {errors.mandate_file && <p className="text-xs text-destructive">{errors.mandate_file}</p>}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
