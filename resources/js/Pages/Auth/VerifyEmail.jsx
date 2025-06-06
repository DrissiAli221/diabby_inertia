// resources/js/Pages/Auth/VerifyEmail.jsx

import React from "react";
import ApplicationLogo from "@/Components/ApplicationLogo"; // For the logo
import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    // 'status' prop indicates if a link was just sent
    const { post, processing } = useForm({}); // Form is simple, just for resending

    const submitResend = (e) => {
        e.preventDefault();
        post(route("verification.send")); // Ensure 'verification.send' named route exists (POST)
    };

    return (
        <GuestLayout>
            <Head title="Verify Your Email - Diabby" />

            <div className="w-full max-w-md px-6 py-10 space-y-6 bg-white shadow-2xl dark:bg-slate-800 rounded-xl sm:px-10 sm:py-12">
                {/* Logo and App Name inside the card */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="mb-3">
                        {" "}
                        {/* Link to homepage */}
                        <ApplicationLogo className="w-auto h-16 fill-current text-cyan-600 dark:text-cyan-400" />
                    </Link>
                    {/* <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Diabby</h1> */}
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-center text-slate-800 dark:text-white">
                    Verify Your Email Address
                </h2>

                <div className="my-6 space-y-3 text-sm leading-relaxed text-center text-slate-600 dark:text-slate-400">
                    <p>
                        Thanks for signing up! Before getting started, could you
                        verify your email address by clicking on the link we
                        just emailed to you?
                    </p>
                    <p>
                        If you didn't receive the email, we will gladly send you
                        another.
                    </p>
                </div>

                {status === "verification-link-sent" && (
                    <div className="p-4 mb-6 text-sm font-medium text-center text-green-700 bg-green-100 rounded-md dark:bg-green-200 dark:text-green-800">
                        A new verification link has been sent to the email
                        address you provided during registration. Please check
                        your inbox (and spam folder).
                    </div>
                )}

                {/* Form only contains buttons here */}
                <form onSubmit={submitResend} className="mt-6 space-y-4">
                    {" "}
                    {/* Changed to space-y-4 */}
                    <div>
                        <PrimaryButton
                            className="flex justify-center w-full py-3 text-base rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:focus:ring-offset-slate-800"
                            disabled={processing}
                        >
                            {processing
                                ? "Sending..."
                                : "Resend Verification Email"}
                        </PrimaryButton>
                    </div>
                </form>

                {/* Secondary action: Log out */}
                <div className="mt-6 text-center">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button" // Renders as a button, but uses Inertia Link for the POST request
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-md shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                        disabled={processing} // Can also be disabled if resend is processing
                    >
                        Log Out
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
