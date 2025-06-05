"use client";

import { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import { Link } from "@inertiajs/react";
import {
    Activity,
    Calendar,
    Utensils,
    Pill,
    TrendingUp,
    FileText,
    Users,
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
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                GlucTrack
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow mt-5">
                        <nav className="flex-1 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        item.current
                                            ? "bg-blue-50 border-r-2 border-blue-600 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                >
                                    <item.icon
                                        className={`${
                                            item.current
                                                ? "text-blue-500"
                                                : "text-gray-400 group-hover:text-gray-500"
                                        } mr-3 flex-shrink-0 h-5 w-5`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="px-2 space-y-1">
                            {supportNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    method={item.method || "get"}
                                    as={item.method ? "button" : "a"}
                                    className="flex items-center w-full px-2 py-2 text-sm font-medium text-left text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                                >
                                    <item.icon className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 lg:pl-64">
                <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white shadow">
                    <button
                        type="button"
                        className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
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
                    <div className="flex justify-between flex-1 px-4">
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
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none"
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

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <main className="flex-1">{children}</main>
            </div>

            {/* Mobile menu */}
            {showingNavigationDropdown && (
                <div className="lg:hidden">
                    <div className="fixed inset-0 z-40 flex">
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-75"
                            onClick={() => setShowingNavigationDropdown(false)}
                        />
                        <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
                            <div className="absolute top-0 right-0 pt-2 -mr-12">
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={() =>
                                        setShowingNavigationDropdown(false)
                                    }
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>
                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div className="flex items-center flex-shrink-0 px-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                                            <Activity className="w-5 h-5 text-white" />
                                        </div>
                                        <Link
                                            href={route("dashboard")}
                                            className="text-xl font-bold text-gray-900"
                                        >
                                            GlucTrack
                                        </Link>
                                    </div>
                                </div>
                                <nav className="px-2 mt-5 space-y-1">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`${
                                                item.current
                                                    ? "bg-blue-50 border-r-2 border-blue-600 text-blue-700"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                                        >
                                            <item.icon
                                                className={`${
                                                    item.current
                                                        ? "text-blue-500"
                                                        : "text-gray-400 group-hover:text-gray-500"
                                                } mr-4 flex-shrink-0 h-6 w-6`}
                                            />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
