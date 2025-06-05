// resources/js/Layouts/MainLayout.jsx

import React from 'react';
import { Head } from '@inertiajs/react'; // Optional: For setting page title defaults
import MainNavbar from '@/Components/MainNavbar'; // Import the Navbar component you just created

// This component receives the actual Page component as 'children'
// You can also accept other props if needed (e.g., title, auth)
export default function MainLayout({ children, auth, title }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Optional: Add default Head tags */}
            <Head>
                {/* Set a dynamic title, falls back to 'Diabby' */}
                <title>{title ? `${title} - Diabby` : 'Diabby'}</title>
                {/* You can add default meta descriptions, etc. here */}
            </Head>

            {/* === YOUR NAVBAR GOES HERE === */}
            <MainNavbar user={auth?.user} />
            
            {/* === MAIN CONTENT AREA === */}
            {/* '{children}' is where Inertia will automatically render */}
            {/* the content of your Page component (e.g., Welcome.jsx, Dashboard.jsx) */}
            <main>
                {children}
            </main>

            {/* Optional: Add a Footer component here */}
            {/* <Footer /> */}
        </div>
    );
}