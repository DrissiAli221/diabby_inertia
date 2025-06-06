// resources/js/Pages/Auth/ResetPassword.jsx

import React from "react";
import ApplicationLogo from "@/Components/ApplicationLogo"; // For the logo
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react"; // Added Link

export default function ResetPassword({ token, email }) {
    // email and token are passed as props from controller
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email, // Pre-filled email
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.store"), {
            // password.store is typically used for new password from reset link
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Your Password - Diabby" />

            <div className="w-full max-w-md px-6 py-10 space-y-6 bg-white shadow-2xl dark:bg-slate-800 rounded-xl sm:px-10 sm:py-12">
                {/* Logo and App Name inside the card */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="mb-3">
                        <ApplicationLogo className="w-auto h-16 fill-current text-cyan-600 dark:text-cyan-400" />
                    </Link>
                    {/* <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Diabby</h1> */}
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-center text-slate-800 dark:text-white">
                    Set a New Password
                </h2>
                <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-400">
                    Please enter your new password below.
                </p>

                {/* Display general form errors or status messages if any */}
                {errors.form && ( // Assuming you might pass a general form error under 'form' key
                    <div className="p-4 my-4 text-sm font-medium text-red-700 bg-red-100 rounded-md dark:bg-red-200 dark:text-red-800">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={submit} className="mt-8 space-y-6">
                    {/* Email field is often pre-filled and can be read-only or hidden, */}
                    {/* but Breeze usually keeps it editable for correction if needed. */}
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Email Address"
                            className="dark:text-slate-300"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email} // Pre-filled
                            className="block w-full mt-1 rounded-md bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            readOnly // Or remove readOnly if users should be able to edit it
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="New Password"
                            className="dark:text-slate-300"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full mt-1 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                            autoComplete="new-password"
                            isFocused={true} // Focus the new password field
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Enter your new password"
                            required
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm New Password"
                            className="dark:text-slate-300"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full mt-1 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            placeholder="Repeat your new password"
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton
                            className="flex justify-center w-full py-3 text-base rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:focus:ring-offset-slate-800"
                            disabled={processing}
                        >
                            {processing
                                ? "Resetting Password..."
                                : "Reset Password"}
                        </PrimaryButton>
                    </div>
                </form>

                {/* Usually, there's no link back to login from here, as the user is in a specific token-driven flow */}
                {/* If a user lands here by mistake, the browser back button is common. */}
            </div>
        </GuestLayout>
    );
}
