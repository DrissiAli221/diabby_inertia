import { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import { Link } from "@inertiajs/react";
import {
    Activity,
    Calendar,
    Utensils,
    TrendingUp,
    HelpCircle,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { route } from "ziggy-js";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const navigation = [
        {
            name: "Suivi de glycémie",
            href: route("glycemia.index"),
            icon: Activity,
            current: route().current("glycemia.*"),
        },
        {
            name: "Calendrier",
            href: route("calendar.index"),
            icon: Calendar,
            current: route().current("calendar.*"),
        },
        {
            name: "Nutrition",
            href: route("nutrition.index"),
            icon: Utensils,
            current: route().current("nutrition.*"),
        },
        {
            name: "Activité physique",
            href: route("activity.index"),
            icon: TrendingUp,
            current: route().current("activity.*"),
        },
    ];

    const supportNavigation = [
        { name: "Aide et support", href: "#", icon: HelpCircle },
        {
            name: "Déconnexion",
            href: route("logout"),
            icon: LogOut,
            method: "post",
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
            {/* Sidebar */}
            <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto bg-white border-r shadow-md dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center flex-shrink-0 px-6">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <Link
                                href={route("dashboard")}
                                className="text-2xl font-bold cursor-pointer text-slate-800 dark:text-white"
                            >
                                Diabby
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow mt-8">
                        <nav className="flex-1 px-4 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        item.current
                                            ? "bg-indigo-50 dark:bg-indigo-700/30 text-indigo-700 dark:text-indigo-300 font-semibold border-l-4 border-indigo-600 dark:border-indigo-500"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                                    } group flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 ease-in-out`}
                                >
                                    <item.icon
                                        className={`${
                                            item.current
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300"
                                        } mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="px-4 pt-6 mt-auto space-y-2">
                            {" "}
                            {/* Added mt-auto to push to bottom, and pt-6 for spacing */}
                            {supportNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    method={item.method || "get"}
                                    as={item.method ? "button" : "a"}
                                    className="flex items-center w-full px-3 py-3 text-sm font-medium text-left transition-all duration-200 ease-in-out rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white group"
                                >
                                    <item.icon className="flex-shrink-0 w-6 h-6 mr-3 transition-colors duration-200 text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 lg:pl-72">
                <div className="sticky top-0 z-20 flex items-center flex-shrink-0 border-b shadow-sm h-30 g-white f dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <button
                        type="button"
                        className="px-4 border-r text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                        onClick={() =>
                            setShowingNavigationDropdown(
                                !showingNavigationDropdown
                            )
                        }
                    >
                        <span className="sr-only">Open sidebar</span>
                        {showingNavigationDropdown ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                    <div className="flex justify-between flex-1 px-4 sm:px-6 lg:px-8">
                        <div className="flex-1">
                            {header && (
                                <header className="py-4">{header}</header>
                            )}
                        </div>
                        <div className="flex items-center ml-4 md:ml-6">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out bg-white border border-transparent rounded-md text-slate-600 dark:text-slate-300 dark:bg-slate-800 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {user && user.name
                                                ? user.name
                                                : "Account"}
                                            <svg
                                                className="ml-2 -mr-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content
                                    align="right"
                                    width="48"
                                    contentClasses="bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1"
                                >
                                    <Dropdown.Link
                                        href={route("profile.edit")}
                                        className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                                    >
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="w-full text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <main className="flex-1 py-6">{children}</main>
            </div>

            {/* Mobile menu */}
            {showingNavigationDropdown && (
                <div className="lg:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 z-40 flex">
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-slate-600/75 dark:bg-slate-900/80 backdrop-blur-sm"
                            aria-hidden="true"
                            onClick={() => setShowingNavigationDropdown(false)}
                        />
                        {/* Sidebar */}
                        <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white shadow-xl dark:bg-slate-800">
                            <div className="absolute top-0 right-0 pt-3 -mr-14">
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-full text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
                                    onClick={() =>
                                        setShowingNavigationDropdown(false)
                                    }
                                >
                                    <X className="w-6 h-6" />
                                    <span className="sr-only">
                                        Close sidebar
                                    </span>
                                </button>
                            </div>
                            <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
                                <div className="flex items-center flex-shrink-0 px-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                                            <Activity className="w-6 h-6 text-white" />
                                        </div>
                                        <Link
                                            href={route("dashboard")}
                                            className="text-2xl font-bold text-slate-800 dark:text-white"
                                            onClick={() =>
                                                setShowingNavigationDropdown(
                                                    false
                                                )
                                            }
                                        >
                                            GlucTrack
                                        </Link>
                                    </div>
                                </div>
                                <nav className="px-4 mt-8 space-y-2">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() =>
                                                setShowingNavigationDropdown(
                                                    false
                                                )
                                            }
                                            className={`${
                                                item.current
                                                    ? "bg-indigo-50 dark:bg-indigo-700/30 text-indigo-700 dark:text-indigo-300 font-semibold border-l-4 border-indigo-600 dark:border-indigo-500"
                                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                                            } group flex items-center px-3 py-3 text-base rounded-lg transition-all duration-200 ease-in-out`}
                                        >
                                            <item.icon
                                                className={`${
                                                    item.current
                                                        ? "text-indigo-600 dark:text-indigo-400"
                                                        : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300"
                                                } mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-200`}
                                            />
                                            {item.name}
                                        </Link>
                                    ))}
                                    <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-700">
                                        {supportNavigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                method={item.method || "get"}
                                                as={
                                                    item.method ? "button" : "a"
                                                }
                                                onClick={() =>
                                                    setShowingNavigationDropdown(
                                                        false
                                                    )
                                                }
                                                className="flex items-center w-full px-3 py-3 text-base font-medium text-left transition-all duration-200 ease-in-out rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white group"
                                            >
                                                <item.icon className="flex-shrink-0 w-6 h-6 mr-4 transition-colors duration-200 text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300" />
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </nav>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
