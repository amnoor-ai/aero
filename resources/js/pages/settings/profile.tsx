import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Camera, Trash2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        (auth.user as any).avatar_url || null
    );

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        email: string;
        avatar: File | null;
        remove_avatar: boolean;
        _method: string;
    }>({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null,
        remove_avatar: false,
        _method: 'PATCH',
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('avatar', file);
            setData('remove_avatar', false);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveAvatar = () => {
        setData('avatar', null);
        setData('remove_avatar', true);
        setAvatarPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/profile', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name, email address, and profile photo"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload Section */}
                    <div className="flex items-center space-x-6 p-4 rounded-2xl bg-card border border-border">
                        <div className="relative group">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt={auth.user.name}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center border-2 border-primary/20">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition cursor-pointer"
                                title="Change Avatar"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-foreground">Profile Picture</h4>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP up to 2MB.</p>
                            <div className="flex items-center space-x-2 pt-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Upload Photo
                                </Button>
                                {avatarPreview && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={handleRemoveAvatar}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                    </Button>
                                )}
                            </div>
                            {errors.avatar && <InputError message={errors.avatar} />}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Full name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="Email address"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                        <div>
                            <p className="-mt-4 text-sm text-muted-foreground">
                                Your email address is unverified.{' '}
                                <Link
                                    href={send()}
                                    as="button"
                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                >
                                    Click here to re-send the verification email.
                                </Link>
                            </p>
                            {status === 'verification-link-sent' && (
                                <div className="mt-2 text-sm font-medium text-green-600">
                                    A new verification link has been sent to your email address.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <Button disabled={processing} data-test="update-profile-button">
                            Save
                        </Button>
                    </div>
                </form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
