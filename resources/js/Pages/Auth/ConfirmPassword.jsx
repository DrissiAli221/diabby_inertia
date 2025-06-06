// resources/js/Pages/Auth/ConfirmPassword.jsx

import React from "react";
import ApplicationLogo from "@/Components/ApplicationLogo"; // For the logo
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react"; // Added Link (though not used in this specific form's actions, good for consistency if logo is linked)

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.confirm"), {
            // Ensure 'password.confirm' named route handles POST
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password - Diabby" />

            <div className="w-full max-w-md px-6 py-10 space-y-6 bg-white shadow-2xl dark:bg-slate-800 rounded-xl sm:px-10 sm:py-12">
                {/* Logo and App Name inside the card */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="mb-3">
                        <ApplicationLogo className="w-auto h-16 fill-current text-cyan-600 dark:text-cyan-400" />
                    </Link>
                    {/* <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Diabby</h1> */}
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-center text-slate-800 dark:text-white">
                    Confirm Your Password
                </h2>

                <div className="my-6 text-sm leading-relaxed text-center text-slate-600 dark:text-slate-400">
                    This is a secure area of the application. Please confirm
                    your password before continuing.
                </div>

                {/* Display general form errors or status messages if any (e.g., if password.confirm has a general error) */}
                {errors.form && ( // Assuming you might pass a general form error under 'form' key
                    <div className="p-4 mb-6 text-sm font-medium text-red-700 bg-red-100 rounded-md dark:bg-red-200 dark:text-red-800">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
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
                            className="block w-full mt-1 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                            isFocused={true}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Enter your current password"
                            required
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton
                            className="flex justify-center w-full py-3 text-base rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:focus:ring-offset-slate-800"
                            disabled={processing}
                        >
                            {processing ? "Confirming..." : "Confirm"}
                        </PrimaryButton>
                    </div>
                </form>

                {/* Optional: Add a link to go back or cancel, if appropriate for the flow */}
                {/*
                <p className="mt-8 text-sm text-center">
                    <Link
                        href={route('dashboard')} // Or wherever is appropriate to go back
                        className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                        Cancel and go back
                    </Link>
                </p>
                */}
            </div>
        </GuestLayout>
    );
}
