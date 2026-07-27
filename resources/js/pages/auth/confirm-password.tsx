import { Form, Head } from '@inertiajs/react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label="Confirm with passkey"
                loadingLabel="Confirming..."
                separator="Or confirm with password"
            />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className="text-xs font-semibold text-foreground">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                autoFocus
                                className="h-9 rounded-md border-input bg-background text-xs shadow-xs focus-visible:ring-1 focus-visible:ring-ring"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center pt-2">
                            <Button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs h-9 rounded-md transition"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner className="w-4 h-4 mr-2" />}
                                Confirm Password
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};
