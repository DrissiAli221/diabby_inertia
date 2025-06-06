// resources/js/Pages/Auth/Register.jsx

import React from "react";
import ApplicationLogo from "@/Components/ApplicationLogo"; // For the logo
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            {" "}
            {/* GuestLayout provides background and centering */}
            <Head title="Create Account - Diabby" />
            {/* This is now the single main card, managed by GuestLayout for positioning */}
            <div className="w-full max-w-md px-6 py-10 space-y-6 bg-white shadow-2xl dark:bg-slate-800 rounded-xl sm:px-10 sm:py-12">
                {/* Logo and App Name inside the card */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="mb-3">
                        <ApplicationLogo className="w-auto h-16 fill-current text-cyan-600 dark:text-cyan-400" />
                    </Link>
                    {/* <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Diabby</h1> */}
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-center text-slate-800 dark:text-white">
                    Create Your Account
                </h2>
                <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-400">
                    Join Diabby to start managing your health today.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-6">
                    {" "}
                    {/* Added mt-8 */}
                    <div>
                        <InputLabel
                            htmlFor="name"
                            value="Full Name"
                            className="dark:text-slate-300"
                        />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="block w-full mt-1 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Your Full Name"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
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
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="dark:text-slate-300"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full mt-1 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Choose a strong password"
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
                            value="Confirm Password"
                            className="dark:text-slate-300"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full mt-1 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            placeholder="Repeat your password"
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                    <div className="pt-2">
                        {" "}
                        {/* Added pt-2 for a bit of space before button */}
                        <PrimaryButton
                            className="flex justify-center w-full py-3 text-base rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:focus:ring-offset-slate-800"
                            disabled={processing}
                        >
                            {processing ? "Registering..." : "Create Account"}
                        </PrimaryButton>
                    </div>
                </form>

                <p className="mt-10 text-sm text-center text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link
                        href={route("login")}
                        className="font-medium rounded text-cyan-600 dark:text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    >
                        Log in here
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
