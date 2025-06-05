"use client";

import { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Activity,
    Utensils,
    TrendingUp,
    CalendarIcon,
    CheckCircle,
    Clock,
} from "lucide-react";
import { route } from "ziggy-js"; // Import route from ziggy-js

const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
];

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function CalendarIndex({
    auth,
    calendarData,
    currentMonth,
    currentYear,
}) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewMonth, setViewMonth] = useState(currentMonth);
    const [viewYear, setViewYear] = useState(currentYear);

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth - 1, 1);
        const lastDay = new Date(viewYear, viewMonth, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            const dateKey = current.toISOString().split("T")[0];
            const dayData = calendarData[dateKey] || {
                glucose_readings: [],
                meals: [],
                activities: [],
                total_entries: 0,
            };

            days.push({
                date: new Date(current),
                dateKey,
                isCurrentMonth: current.getMonth() === viewMonth - 1,
                isToday: current.toDateString() === new Date().toDateString(),
                data: dayData,
            });

            current.setDate(current.getDate() + 1);
        }

        return days;
    }, [viewMonth, viewYear, calendarData]);

    const navigateMonth = (direction) => {
        let newMonth = viewMonth + direction;
        let newYear = viewYear;

        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        setViewMonth(newMonth);
        setViewYear(newYear);

        router.get(
            route("calendar.index"),
            {
                month: newMonth,
                year: newYear,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const getDayStatus = (dayData) => {
        const hasGlucose = dayData.glucose_readings.length > 0;
        const hasMeals = dayData.meals.length > 0;
        const hasActivity = dayData.activities.length > 0;

        if (hasGlucose && hasMeals && hasActivity) return "complete";
        if (hasGlucose || hasMeals || hasActivity) return "partial";
        return "empty";
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "complete":
                return "bg-green-100 border-green-300";
            case "partial":
                return "bg-yellow-100 border-yellow-300";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "complete":
                return <CheckCircle className="w-3 h-3 text-green-600" />;
            case "partial":
                return <Clock className="w-3 h-3 text-yellow-600" />;
            default:
                return null;
        }
    };

    const selectedDayData = selectedDate ? calendarData[selectedDate] : null;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CalendarIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Calendrier de suivi
                            </h2>
                            <p className="text-sm text-gray-600">
                                Vue d'ensemble de vos données de santé
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={route("glycemia.index")}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Activity className="w-4 h-4 mr-2" />
                            Glycémie
                        </Link>
                        <Link
                            href={route("nutrition.index")}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Utensils className="w-4 h-4 mr-2" />
                            Nutrition
                        </Link>
                        <Link
                            href={route("activity.index")}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Activité
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Calendrier" />

            <div className="py-6">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        {/* Calendar */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow">
                                {/* Calendar Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {MONTHS[viewMonth - 1]} {viewYear}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    navigateMonth(-1)
                                                }
                                                className="p-2 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const today = new Date();
                                                    setViewMonth(
                                                        today.getMonth() + 1
                                                    );
                                                    setViewYear(
                                                        today.getFullYear()
                                                    );
                                                    router.get(
                                                        route("calendar.index")
                                                    );
                                                }}
                                                className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Aujourd'hui
                                            </button>
                                            <button
                                                onClick={() => navigateMonth(1)}
                                                className="p-2 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Calendar Grid */}
                                <div className="p-6">
                                    {/* Days of week header */}
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {DAYS.map((day) => (
                                            <div
                                                key={day}
                                                className="p-2 text-sm font-medium text-center text-gray-500"
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar days */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {calendarDays.map((day, index) => {
                                            const status = getDayStatus(
                                                day.data
                                            );
                                            const isSelected =
                                                selectedDate === day.dateKey;

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        setSelectedDate(
                                                            day.dateKey
                                                        )
                                                    }
                                                    className={`
                            relative p-2 h-20 border rounded-lg text-left transition-all duration-200
                            ${
                                day.isCurrentMonth
                                    ? "text-gray-900"
                                    : "text-gray-400"
                            }
                            ${day.isToday ? "ring-2 ring-blue-500" : ""}
                            ${
                                isSelected
                                    ? "ring-2 ring-blue-300 bg-blue-50"
                                    : getStatusColor(status)
                            }
                            hover:bg-blue-50 hover:border-blue-300
                          `}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <span
                                                            className={`text-sm font-medium ${
                                                                day.isToday
                                                                    ? "text-blue-600"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {day.date.getDate()}
                                                        </span>
                                                        {getStatusIcon(status)}
                                                    </div>

                                                    {day.data.total_entries >
                                                        0 && (
                                                        <div className="mt-1 space-y-1">
                                                            {day.data
                                                                .glucose_readings
                                                                .length > 0 && (
                                                                <div className="flex items-center space-x-1">
                                                                    <Activity className="w-3 h-3 text-red-500" />
                                                                    <span className="text-xs text-gray-600">
                                                                        {
                                                                            day
                                                                                .data
                                                                                .glucose_readings
                                                                                .length
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {day.data.meals
                                                                .length > 0 && (
                                                                <div className="flex items-center space-x-1">
                                                                    <Utensils className="w-3 h-3 text-green-500" />
                                                                    <span className="text-xs text-gray-600">
                                                                        {
                                                                            day
                                                                                .data
                                                                                .meals
                                                                                .length
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {day.data.activities
                                                                .length > 0 && (
                                                                <div className="flex items-center space-x-1">
                                                                    <TrendingUp className="w-3 h-3 text-blue-500" />
                                                                    <span className="text-xs text-gray-600">
                                                                        {
                                                                            day
                                                                                .data
                                                                                .activities
                                                                                .length
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Day Details Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {selectedDate
                                            ? new Date(
                                                  selectedDate
                                              ).toLocaleDateString("fr-FR", {
                                                  weekday: "long",
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                              })
                                            : "Sélectionnez une date"}
                                    </h3>
                                </div>

                                <div className="p-6">
                                    {selectedDayData ? (
                                        <div className="space-y-6">
                                            {/* Glucose Readings */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="flex items-center text-sm font-medium text-gray-900">
                                                        <Activity className="w-4 h-4 mr-2 text-red-500" />
                                                        Glycémie
                                                    </h4>
                                                    {selectedDayData
                                                        .glucose_readings
                                                        .length > 0 && (
                                                        <span className="text-xs text-gray-500">
                                                            {
                                                                selectedDayData
                                                                    .glucose_readings
                                                                    .length
                                                            }{" "}
                                                            lecture(s)
                                                        </span>
                                                    )}
                                                </div>
                                                {selectedDayData
                                                    .glucose_readings.length >
                                                0 ? (
                                                    <div className="space-y-2">
                                                        {selectedDayData.glucose_readings.map(
                                                            (reading) => (
                                                                <div
                                                                    key={
                                                                        reading.id
                                                                    }
                                                                    className="flex items-center justify-between p-2 rounded bg-gray-50"
                                                                >
                                                                    <span className="text-sm text-gray-600">
                                                                        {new Date(
                                                                            reading.measured_at
                                                                        ).toLocaleTimeString(
                                                                            "fr-FR",
                                                                            {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                    <span className="text-sm font-medium">
                                                                        {(
                                                                            reading.glucose_level *
                                                                            18
                                                                        ).toFixed(
                                                                            0
                                                                        )}{" "}
                                                                        mg/dL
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        Aucune lecture
                                                    </p>
                                                )}
                                            </div>

                                            {/* Meals */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="flex items-center text-sm font-medium text-gray-900">
                                                        <Utensils className="w-4 h-4 mr-2 text-green-500" />
                                                        Repas
                                                    </h4>
                                                    {selectedDayData.meals
                                                        .length > 0 && (
                                                        <span className="text-xs text-gray-500">
                                                            {
                                                                selectedDayData
                                                                    .meals
                                                                    .length
                                                            }{" "}
                                                            repas
                                                        </span>
                                                    )}
                                                </div>
                                                {selectedDayData.meals.length >
                                                0 ? (
                                                    <div className="space-y-2">
                                                        {selectedDayData.meals.map(
                                                            (meal) => (
                                                                <div
                                                                    key={
                                                                        meal.id
                                                                    }
                                                                    className="p-2 rounded bg-gray-50"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            {
                                                                                meal.name
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {
                                                                                meal.total_calories
                                                                            }{" "}
                                                                            cal
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-xs text-gray-500">
                                                                        {new Date(
                                                                            meal.consumed_at
                                                                        ).toLocaleTimeString(
                                                                            "fr-FR",
                                                                            {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        Aucun repas
                                                    </p>
                                                )}
                                            </div>

                                            {/* Activities */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="flex items-center text-sm font-medium text-gray-900">
                                                        <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                                                        Activités
                                                    </h4>
                                                    {selectedDayData.activities
                                                        .length > 0 && (
                                                        <span className="text-xs text-gray-500">
                                                            {
                                                                selectedDayData
                                                                    .activities
                                                                    .length
                                                            }{" "}
                                                            activité(s)
                                                        </span>
                                                    )}
                                                </div>
                                                {selectedDayData.activities
                                                    .length > 0 ? (
                                                    <div className="space-y-2">
                                                        {selectedDayData.activities.map(
                                                            (activity) => (
                                                                <div
                                                                    key={
                                                                        activity.id
                                                                    }
                                                                    className="p-2 rounded bg-gray-50"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            {
                                                                                activity.type
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {
                                                                                activity.calories_burned
                                                                            }{" "}
                                                                            cal
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                                        <span>
                                                                            {
                                                                                activity.duration
                                                                            }{" "}
                                                                            min
                                                                        </span>
                                                                        <span>
                                                                            {new Date(
                                                                                activity.performed_at
                                                                            ).toLocaleTimeString(
                                                                                "fr-FR",
                                                                                {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                }
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        Aucune activité
                                                    </p>
                                                )}
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="pt-4 border-t border-gray-200">
                                                <h4 className="mb-3 text-sm font-medium text-gray-900">
                                                    Actions rapides
                                                </h4>
                                                <div className="space-y-2">
                                                    <Link
                                                        href={route(
                                                            "glycemia.index"
                                                        )}
                                                        className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Ajouter glycémie
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "nutrition.index"
                                                        )}
                                                        className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Ajouter repas
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "activity.index"
                                                        )}
                                                        className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Ajouter activité
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-sm text-gray-500">
                                                Cliquez sur une date pour voir
                                                les détails
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-6 bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Légende
                                    </h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                                        <span className="text-sm text-gray-600">
                                            Journée complète
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                                        <span className="text-sm text-gray-600">
                                            Données partielles
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 border border-gray-200 rounded bg-gray-50"></div>
                                        <span className="text-sm text-gray-600">
                                            Aucune donnée
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
                                        <span className="text-sm text-gray-600">
                                            Aujourd'hui
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
