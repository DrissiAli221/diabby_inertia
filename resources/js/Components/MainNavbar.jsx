import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/Components/ui/resizable-navbar"; // Assuming this is your custom resizable navbar

import { useState } from "react";
import { Link, router } from "@inertiajs/react"; // Import Inertia Link and router

// Import Shadcn UI Components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"; // Adjust path if Shadcn components are elsewhere
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button"; // Shadcn Button

export default function MainNavbar({ user }) {
    const navItems = [
        { name: "Resources", link: route("resources") },
        { name: "Tracking", link: route("tracking") },
        { name: "About Us", link: route("about") },
        { name: "Contact", link: route("contact") },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const isLoggedIn = !!user;

    // Function to get user initials for AvatarFallback
    const getUserInitials = (name) => {
        if (!name) return "U";
        const nameParts = name.split(" ");
        if (nameParts.length > 1) {
            return nameParts[0][0] + nameParts[nameParts.length - 1][0];
        }
        return name[0];
    };

    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <Navbar className={"fixed top-2 z-50"}>
            {/* --- Desktop Navigation --- */}
            <NavBody>
                <NavbarLogo>
                    <Link href={route("home")}>TravelCo</Link>
                </NavbarLogo>
                <NavItems
                    items={navItems}
                    LinkComponent={Link}
                    LinkHrefProp="href"
                />

                {/* --- Desktop Action Buttons / User Menu --- */}
                <div className="flex items-center gap-4 ml-auto">
                    {" "}
                    {/* Added ml-auto to push to right */}
                    {isLoggedIn ? (
                        // ---- USER AVATAR DROPDOWN ----
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative w-10 h-10 rounded-full"
                                >
                                    <Avatar className="w-10 h-10">
                                        {/* Assuming user.avatar_url exists, otherwise show fallback */}
                                        <AvatarImage
                                            src={
                                                user.avatar_url ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    user.name
                                                )}&background=random`
                                            } // Simple fallback image service
                                            alt={user.name}
                                        />
                                        <AvatarFallback>
                                            {getUserInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route("dashboard")}>
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    {/* Assuming 'profile.edit' is the route name for user profile */}
                                    <Link href={route("profile.edit")}>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Billing (Example)
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings (Example)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer"
                                >
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href={route("login")}>
                                <NavbarButton>Login</NavbarButton>{" "}
                            </Link>
                            <Link href={route("register")}>
                                <NavbarButton>Sign Up</NavbarButton>{" "}
                            </Link>
                        </>
                    )}
                </div>
            </NavBody>

            {/* --- Mobile Navigation --- */}
            <MobileNav>
                <MobileNavHeader>
                    <NavbarLogo>
                        <Link href={route("home")}>TravelCo</Link>
                    </NavbarLogo>
                    <MobileNavToggle
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                </MobileNavHeader>

                <MobileNavMenu
                    isOpen={isMobileMenuOpen}
                    onClose={closeMobileMenu}
                >
                    {navItems.map((item, idx) => (
                        <Link
                            key={`mobile-link-${idx}`}
                            href={item.link}
                            onClick={closeMobileMenu}
                            className="block py-2 text-lg text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Mobile user-specific links */}
                    {isLoggedIn && (
                        <>
                            <DropdownMenuSeparator className="my-2" />{" "}
                            {/* Visually separate app links from user links */}
                            <Link
                                href={route("dashboard")}
                                className="block py-2 text-lg text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                                onClick={closeMobileMenu}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={route("profile.edit")} // Ensure this route exists
                                className="block py-2 text-lg text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                                onClick={closeMobileMenu}
                            >
                                Profile
                            </Link>
                        </>
                    )}

                    <div className="flex flex-col w-full gap-4 pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-700">
                        {isLoggedIn ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    handleLogout();
                                    closeMobileMenu();
                                }}
                                className="w-full"
                            >
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="w-full"
                                    onClick={closeMobileMenu}
                                >
                                    <Button variant="ghost" className="w-full">
                                        Login
                                    </Button>
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="w-full"
                                    onClick={closeMobileMenu}
                                >
                                    <Button className="w-full">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}
