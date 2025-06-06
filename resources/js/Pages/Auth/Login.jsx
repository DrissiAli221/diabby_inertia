// resources/js/Pages/Auth/Login.jsx

import React from "react";
import ApplicationLogo from "@/Components/ApplicationLogo"; // For the logo
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            {" "}
            {/* GuestLayout provides background and centering */}
            <Head title="Log in - Diabby" />
            {/* This is now the single main card, managed by GuestLayout for positioning */}
            <div className="w-full max-w-md px-6 py-10 space-y-6 bg-white shadow-2xl dark:bg-slate-800 rounded-xl sm:px-10 sm:py-12">
                {" "}
                {/* Added more vertical padding */}
                {/* Logo and App Name inside the card */}
                <div className="flex flex-col items-center mb-8">
                    {" "}
                    {/* Increased mb */}
                    <Link href="/" className="mb-3">
                        {" "}
                        {/* Link around the logo */}
                        <ApplicationLogo className="w-auto h-16 fill-current text-cyan-600 dark:text-cyan-400" />
                        {/* Adjusted logo size, you can fine-tune */}
                    </Link>
                    {/* <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Diabby</h1> */}
                    {/* Optionally display app name if logo isn't clear enough */}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-center text-slate-800 dark:text-white">
                    Welcome Back!
                </h2>
                {/* Optional: Sub-text for login can go here if needed
                <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-400">
                    Log in to manage your health.
                </p>
                */}
                {status && (
                    <div className="p-4 my-4 text-sm font-medium text-green-700 bg-green-100 rounded-md dark:bg-green-200 dark:text-green-800">
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
                            className="block w-full mt-1 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400" // Ensure rounded-md for consistency
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="you@example.com"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="dark:text-slate-300"
                            />
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm rounded text-cyan-600 dark:text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full mt-1 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400" // Ensure rounded-md
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="••••••••"
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-cyan-500 dark:focus:ring-cyan-600"
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm select-none ms-2 text-slate-600 dark:text-slate-300"
                        >
                            Remember me
                        </label>
                    </div>

                    <div>
                        <PrimaryButton
                            className="flex justify-center w-full py-3 text-base rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:focus:ring-offset-slate-800"
                            disabled={processing}
                        >
                            {processing ? "Logging in..." : "Log In"}
                        </PrimaryButton>
                    </div>
                </form>
                <p className="mt-10 text-sm text-center text-slate-500 dark:text-slate-400">
                    {" "}
                    {/* Increased mt */}
                    Don't have an account?{" "}
                    <Link
                        href={route("register")}
                        className="font-medium rounded text-cyan-600 dark:text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    >
                        Sign up here
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
