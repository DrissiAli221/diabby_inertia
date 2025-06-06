// resources/js/Layouts/MainLayout.jsx

import React from "react";
import { Head } from "@inertiajs/react"; // Optional: For setting page title defaults
import MainNavbar from "@/Components/MainNavbar"; // Import the Navbar component you just created
import Footer from "@/Components/Footer";

// This component receives the actual Page component as 'children'
// You can also accept other props if needed (e.g., title, auth)
export default function MainLayout({ children, auth, title }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Optional: Add default Head tags */}
            <Head>
                <title>{title ? `${title} - Diabby` : "Diabby"}</title>
            </Head>

            <MainNavbar user={auth?.user} />

            <main>{children}</main>
            <Footer />
        </div>
    );
}
