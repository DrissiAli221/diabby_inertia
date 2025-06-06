// MainNavbar.jsx
import {
    Navbar,
    NavBody,
    // NavItems,
    MobileNav,
    NavbarLogo,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/Components/ui/resizable-navbar";

import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import clsx from "clsx";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    LifeBuoy,
    LogOut as LogOutIcon,
    Settings,
    User as UserIcon,
    BarChart3,
} from "lucide-react";

// Diabby Logo Components
const DiabbyIconLogo = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform stroke-current w-7 h-7 text-cyan-600 dark:text-cyan-400 group-hover:scale-105"
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
        <path d="M12 12l-2-2m4 0l-2 2"></path>
    </svg>
);
const DiabbyTextLogo = () => (
    <span className="text-xl font-bold transition-colors text-cyan-700 dark:text-cyan-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
        Diabby
    </span>
);

export default function MainNavbar() {
    const { auth, url } = usePage().props;
    const user = auth.user;
    const isLoggedIn = !!user;

    const isActive = (href) => {
        const currentPath = new URL(url, window.location.origin).pathname;
        const linkPath = new URL(href, window.location.origin).pathname;
        return (
            currentPath === linkPath ||
            (linkPath !== "/" &&
                currentPath.startsWith(linkPath) &&
                linkPath.length > 1)
        );
    };

    const navItems = [
        ...(isLoggedIn
            ? [{ name: "Tableau de Bord", link: route("dashboard") }]
            : []),
        { name: "Glycémie", link: route("glycemia.index") },
        { name: "Nutrition", link: route("nutrition.index") },
        { name: "Activité", link: route("activity.index") },
        { name: "Calendrier", link: route("calendar.index") },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const getUserInitials = (name) => {
        if (!name) return "?";
        const nameParts = name.split(" ");
        return (
            nameParts[0][0] +
            (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "")
        ).toUpperCase();
    };

    const handleLogout = () => {
        router.post(route("logout"));
        closeMobileMenu();
    };

    const navLinkClasses = (href) =>
        clsx(
            "relative px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950",
            isActive(href)
                ? "text-cyan-700 dark:text-cyan-200 bg-cyan-100 dark:bg-cyan-700/60"
                : "text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-200 hover:bg-cyan-50 dark:hover:bg-cyan-800/40"
        );

    const mobileNavLinkClasses = (href) =>
        clsx(
            "block px-4 py-3.5 text-base font-medium rounded-lg transition-colors duration-150",
            isActive(href)
                ? "bg-cyan-100 dark:bg-cyan-700/60 text-cyan-700 dark:text-cyan-200"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-700 dark:hover:text-cyan-200"
        );

    // Remove the top box: The <Navbar> component from your library likely adds a default top margin or sticky offset (e.g. "top-20").
    // To remove the box/space at the top, override the className to remove any top margin or top offset.
    // We'll set "top-0" and remove any extra margin/padding.

    return (
        <Navbar className="sticky top-0 z-40 w-full print:hidden">
            <NavBody className="flex items-center justify-between h-16 px-4 sm:px-6">
                <NavbarLogo>
                    <Link
                        href={isLoggedIn ? route("dashboard") : route("home")}
                        className="flex items-center gap-2 group"
                    >
                        <DiabbyIconLogo />
                        <DiabbyTextLogo />
                    </Link>
                </NavbarLogo>

                <div className="absolute inset-0 flex-row items-center justify-center flex-1 hidden space-x-1 lg:flex">
                    {navItems.map((item, idx) => (
                        <Link
                            key={`desktop-link-${idx}`}
                            href={item.link}
                            className={navLinkClasses(item.link)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2.5 ml-auto relative z-30">
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative flex items-center justify-center w-10 h-10 p-0 rounded-full focus-visible:ring-2 focus-visible:ring-cyan-500 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
                                >
                                    <Avatar className="transition-colors border-2 border-transparent w-9 h-9 hover:border-cyan-400 dark:hover:border-cyan-500">
                                        <AvatarImage
                                            src={
                                                user.profile_photo_url ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    user.name
                                                )}&background=06b6d4&color=fff&font-size=0.45&bold=true`
                                            }
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="text-sm bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                                            {getUserInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="mt-1 bg-white border shadow-xl w-60 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal px-3 py-2.5">
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-50">
                                            {user.name}
                                        </p>
                                        <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                <DropdownMenuGroup className="py-1">
                                    <DropdownMenuItem
                                        asChild
                                        className="px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-cyan-50 dark:focus:bg-cyan-700/50 focus:text-cyan-700 dark:focus:text-cyan-200"
                                    >
                                        <Link
                                            href={route("dashboard")}
                                            className="flex items-center w-full"
                                        >
                                            <BarChart3 className="w-4 h-4 mr-2.5 text-slate-500 dark:text-slate-400" />
                                            Tableau de Bord
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-cyan-50 dark:focus:bg-cyan-700/50 focus:text-cyan-700 dark:focus:text-cyan-200"
                                    >
                                        <Link
                                            href={route("profile.edit")}
                                            className="flex items-center w-full"
                                        >
                                            <UserIcon className="w-4 h-4 mr-2.5 text-slate-500 dark:text-slate-400" />
                                            Profil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-cyan-50 dark:focus:bg-cyan-700/50 focus:text-cyan-700 dark:focus:text-cyan-200">
                                        <Settings className="w-4 h-4 mr-2.5 text-slate-500 dark:text-slate-400" />
                                        Paramètres
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                <DropdownMenuItem className="px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-cyan-50 dark:focus:bg-cyan-700/50 focus:text-cyan-700 dark:focus:text-cyan-200">
                                    <LifeBuoy className="w-4 h-4 mr-2.5 text-slate-500 dark:text-slate-400" />
                                    Aide & Support
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="px-3 py-2 text-red-600 cursor-pointer dark:text-red-400 focus:bg-red-100 dark:focus:bg-red-700/50 focus:text-red-700 dark:focus:text-red-300"
                                >
                                    <LogOutIcon className="w-4 h-4 mr-2.5" />
                                    Déconnexion
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                asChild
                                className="text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/60 px-4 py-1.5 h-auto rounded-lg"
                            >
                                <Link href={route("login")}>Connexion</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white shadow-md px-4 py-1.5 h-auto rounded-lg"
                            >
                                <Link href={route("register")}>S'inscrire</Link>
                            </Button>
                        </>
                    )}
                </div>
                <div className="lg:hidden">
                    <MobileNavToggle
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 -mr-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    />
                </div>
            </NavBody>

            <MobileNav className="max-w-[calc(100vw-2rem)] md:max-w-sm">
                <MobileNavHeader className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
                    <NavbarLogo>
                        <Link
                            href={
                                isLoggedIn ? route("dashboard") : route("home")
                            }
                            className="flex items-center gap-2 group"
                        >
                            <DiabbyIconLogo />
                            <DiabbyTextLogo />
                        </Link>
                    </NavbarLogo>
                    <MobileNavToggle
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 -mr-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    />
                </MobileNavHeader>
                <MobileNavMenu
                    isOpen={isMobileMenuOpen}
                    onClose={closeMobileMenu}
                    className="px-3 pt-2 pb-6 space-y-1.5"
                >
                    {navItems.map((item, idx) => (
                        <Link
                            key={`mobile-link-${idx}`}
                            href={item.link}
                            onClick={closeMobileMenu}
                            className={mobileNavLinkClasses(item.link)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="pt-5 mt-4 space-y-3 border-t border-slate-200 dark:border-slate-700">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href={route("profile.edit")}
                                    onClick={closeMobileMenu}
                                    className={`${mobileNavLinkClasses(
                                        route("profile.edit")
                                    )} flex items-center`}
                                >
                                    <UserIcon className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400" />
                                    Profil
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="w-full text-red-600 border-red-500 hover:bg-red-100 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-700/50 dark:hover:text-red-300 justify-start px-4 py-3.5 text-base"
                                >
                                    <LogOutIcon className="w-5 h-5 mr-3" />
                                    Déconnexion
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="w-full"
                                    onClick={closeMobileMenu}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 px-4 py-3.5 text-base"
                                    >
                                        Connexion
                                    </Button>
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="w-full"
                                    onClick={closeMobileMenu}
                                >
                                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white justify-center px-4 py-3.5 text-base">
                                        S'inscrire
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}
