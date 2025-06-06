// resources/js/Layouts/GuestLayout.jsx

import React from "react";
// ApplicationLogo is no longer rendered directly in GuestLayout if it's part of Login/Register pages

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
            {/* The children will be the entire card (including logo and form) from Login.jsx or Register.jsx */}
            {children}
        </div>
    );
}
