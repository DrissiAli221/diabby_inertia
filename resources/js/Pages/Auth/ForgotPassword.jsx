// resources/js/Pages/Auth/ForgotPassword.jsx

import React from "react";
import ApplicationLogo from "@/Components/ApplicationLogo"; // For the logo
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel"; // Added for consistency
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react"; // Added Link

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email")); // Sends POST request to this named route
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password - Diabby" />

            <div className="w-full max-w-md px-6 py-10 space-y-6 bg-white shadow-2xl dark:bg-slate-800 rounded-xl sm:px-10 sm:py-12">
                {/* Logo and App Name inside the card */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="mb-3">
                        <ApplicationLogo className="w-auto h-16 fill-current text-cyan-600 dark:text-cyan-400" />
                    </Link>
                    {/* <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Diabby</h1> */}
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-center text-slate-800 dark:text-white">
                    Forgot Your Password?
                </h2>

                <div className="my-6 text-sm leading-relaxed text-center text-slate-600 dark:text-slate-400">
                    {" "}
                    {/* Added my-6 and leading-relaxed */}
                    No problem. Just let us know your email address and we will
                    email you a password reset link that will allow you to
                    choose a new one.
                </div>

                {status && (
                    <div className="p-4 mb-6 text-sm font-medium text-green-700 bg-green-100 rounded-md dark:bg-green-200 dark:text-green-800">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
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
                            value={data.email}
                            className="block w-full mt-1 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="you@example.com"
                            required // It's good practice to require the email
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="pt-2">
                        {" "}
                        {/* Added pt-2 for a bit of space */}
                        <PrimaryButton
                            className="flex justify-center w-full py-3 text-base rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:focus:ring-offset-slate-800"
                            disabled={processing}
                        >
                            {processing
                                ? "Sending Link..."
                                : "Email Password Reset Link"}
                        </PrimaryButton>
                    </div>
                </form>

                <p className="mt-10 text-sm text-center text-slate-500 dark:text-slate-400">
                    Remembered your password?{" "}
                    <Link
                        href={route("login")}
                        className="font-medium rounded text-cyan-600 dark:text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
