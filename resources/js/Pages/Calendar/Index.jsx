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
    CalendarIcon, // Original Icon Name
    CheckCircle, // Original Icon Name
    Clock, // Original Icon Name
} from "lucide-react";
import { route } from "ziggy-js";

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

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]; // Original DAYS array

export default function CalendarIndex({
    auth,
    calendarData,
    currentMonth,
    currentYear,
}) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewMonth, setViewMonth] = useState(currentMonth);
    const [viewYear, setViewYear] = useState(currentYear);

    // Original calendarDays logic
    const calendarDays = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth - 1, 1);
        // const lastDay = new Date(viewYear, viewMonth, 0); // Original had this, not strictly used in loop
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

    // Original navigateMonth logic
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
            { month: newMonth, year: newYear },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Original getDayStatus logic
    const getDayStatus = (dayData) => {
        const hasGlucose = dayData.glucose_readings.length > 0;
        const hasMeals = dayData.meals.length > 0;
        const hasActivity = dayData.activities.length > 0;

        if (hasGlucose && hasMeals && hasActivity) return "complete";
        if (hasGlucose || hasMeals || hasActivity) return "partial";
        return "empty";
    };

    // Modified getStatusColor for spiced up visuals & dark mode
    const getStatusColorClasses = (status, isSelected, dayIsCurrentMonth) => {
        if (isSelected) {
            return "bg-indigo-100 dark:bg-indigo-700/40 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500 dark:ring-indigo-400";
        }
        if (!dayIsCurrentMonth) {
            return "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/60";
        }
        switch (status) {
            case "complete":
                return "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800/60";
            case "partial":
                return "bg-amber-50 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/60";
            default: // empty
                return "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60";
        }
    };

    // Original getStatusIcon logic, with minor class changes for consistency
    const getStatusIconDisplay = (status, dayIsCurrentMonth) => {
        if (!dayIsCurrentMonth) return null; // No icon for non-current month days if they were empty
        switch (status) {
            case "complete":
                return (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                );
            case "partial":
                return (
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                );
            default:
                return null;
        }
    };

    const selectedDayData = selectedDate ? calendarData[selectedDate] : null;

    // Original selectedDate formatting logic for the sidebar
    const formattedSelectedDate = selectedDate
        ? new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", {
              // Adding T00:00:00 for robust local date parsing
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Sélectionnez une date";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-100 shadow-sm dark:bg-indigo-800/30 rounded-xl">
                            <CalendarIcon className="text-indigo-600 w-7 h-7 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                                Calendrier de suivi
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Vue d'ensemble de vos données de santé.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {[
                            {
                                href: route("glycemia.index"),
                                label: "Glycémie",
                                IconComp: Activity,
                            },
                            {
                                href: route("nutrition.index"),
                                label: "Nutrition",
                                IconComp: Utensils,
                            },
                            {
                                href: route("activity.index"),
                                label: "Activité",
                                IconComp: TrendingUp,
                            },
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <link.IconComp className="w-4 h-4 mr-1.5" />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            }
        >
            <Head title="Calendrier" />

            <div className="py-6">
                {/* Original max-w-7xl and grid structure */}
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div className="lg:col-span-3">
                            <div className="overflow-hidden bg-white shadow-lg dark:bg-slate-800 rounded-xl">
                                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                            {MONTHS[viewMonth - 1]} {viewYear}
                                        </h3>
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <button
                                                onClick={() =>
                                                    navigateMonth(-1)
                                                }
                                                className="p-2 transition-colors rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                aria-label="Mois précédent"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Original "Aujourd'hui" logic
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
                                                className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
                                            >
                                                Aujourd'hui
                                            </button>
                                            <button
                                                onClick={() => navigateMonth(1)}
                                                className="p-2 transition-colors rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                aria-label="Mois suivant"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5">
                                    <div className="grid grid-cols-7 gap-px mb-2 sm:gap-1">
                                        {DAYS.map(
                                            (
                                                day // Original DAYS array
                                            ) => (
                                                <div
                                                    key={day}
                                                    className="py-2 text-xs font-medium tracking-wider text-center uppercase text-slate-500 dark:text-slate-400"
                                                >
                                                    {day}
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="grid grid-cols-7 gap-px sm:gap-1">
                                        {calendarDays.map((day, index) => {
                                            const status = getDayStatus(
                                                day.data
                                            );
                                            const isSelected =
                                                selectedDate === day.dateKey;
                                            const dayClasses =
                                                getStatusColorClasses(
                                                    status,
                                                    isSelected,
                                                    day.isCurrentMonth
                                                );

                                            return (
                                                <button
                                                    key={day.dateKey} // Use dateKey for more stable key
                                                    onClick={() =>
                                                        setSelectedDate(
                                                            day.dateKey
                                                        )
                                                    }
                                                    className={`
                                                        relative p-2 h-24 sm:h-28 flex flex-col items-start justify-start border rounded-lg text-left transition-all duration-150 focus:z-10 focus:outline-none focus:ring-offset-1
                                                        ${
                                                            day.isCurrentMonth
                                                                ? "text-slate-900 dark:text-slate-100"
                                                                : "text-slate-400 dark:text-slate-600 opacity-70"
                                                        }
                                                        ${
                                                            day.isToday &&
                                                            !isSelected &&
                                                            day.isCurrentMonth
                                                                ? "ring-2 ring-indigo-500 dark:ring-indigo-400"
                                                                : ""
                                                        }
                                                        ${dayClasses}
                                                    `}
                                                >
                                                    <div className="flex items-start justify-between w-full mb-1">
                                                        <span
                                                            className={`text-sm font-semibold ${
                                                                day.isToday &&
                                                                day.isCurrentMonth
                                                                    ? isSelected
                                                                        ? "text-indigo-700 dark:text-indigo-200"
                                                                        : "text-indigo-600 dark:text-indigo-300"
                                                                    : day.isCurrentMonth
                                                                    ? "text-slate-700 dark:text-slate-200"
                                                                    : "text-slate-400 dark:text-slate-600"
                                                            }`}
                                                        >
                                                            {day.date.getDate()}
                                                        </span>
                                                        {getStatusIconDisplay(
                                                            status,
                                                            day.isCurrentMonth
                                                        )}
                                                    </div>

                                                    {/* Original display of entries within the cell, with enhanced styling */}
                                                    {day.isCurrentMonth &&
                                                        day.data.total_entries >
                                                            0 && (
                                                            <div className="mt-auto w-full space-y-0.5 text-[0.65rem] leading-tight">
                                                                {day.data
                                                                    .glucose_readings
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                                                                        <Activity className="w-2.5 h-2.5 flex-shrink-0" />
                                                                        <span className="truncate">
                                                                            {
                                                                                day
                                                                                    .data
                                                                                    .glucose_readings
                                                                                    .length
                                                                            }{" "}
                                                                            glyc.
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {day.data.meals
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                                                                        <Utensils className="w-2.5 h-2.5 flex-shrink-0" />
                                                                        <span className="truncate">
                                                                            {
                                                                                day
                                                                                    .data
                                                                                    .meals
                                                                                    .length
                                                                            }{" "}
                                                                            repas
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {day.data
                                                                    .activities
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex items-center space-x-1 text-sky-600 dark:text-sky-400">
                                                                        <TrendingUp className="w-2.5 h-2.5 flex-shrink-0" />
                                                                        <span className="truncate">
                                                                            {
                                                                                day
                                                                                    .data
                                                                                    .activities
                                                                                    .length
                                                                            }{" "}
                                                                            act.
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    {!day.isCurrentMonth && (
                                                        <div className="absolute inset-0 rounded-lg pointer-events-none bg-slate-100/30 dark:bg-slate-800/40"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            {" "}
                            {/* Original col-span for sidebar */}
                            <div className="bg-white shadow-lg dark:bg-slate-800 rounded-xl">
                                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        {formattedSelectedDate}
                                    </h3>
                                </div>

                                <div className="p-5 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
                                    {selectedDayData ? (
                                        <>
                                            {/* Glucose Readings - Original Logic, Spiced Styling */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2.5">
                                                    <h4 className="flex items-center font-semibold text-md text-slate-700 dark:text-slate-200">
                                                        <Activity className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                                                        Glycémie
                                                    </h4>
                                                    {selectedDayData
                                                        .glucose_readings
                                                        .length > 0 && (
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
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
                                                                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                                >
                                                                    <span className="text-sm text-slate-600 dark:text-slate-300">
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
                                                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
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
                                                    <p className="text-sm italic text-slate-500 dark:text-slate-400">
                                                        Aucune lecture
                                                        enregistrée.
                                                    </p>
                                                )}
                                            </div>

                                            {/* Meals - Original Logic, Spiced Styling */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2.5">
                                                    <h4 className="flex items-center font-semibold text-md text-slate-700 dark:text-slate-200">
                                                        <Utensils className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                                                        Repas
                                                    </h4>
                                                    {selectedDayData.meals
                                                        .length > 0 && (
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
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
                                                                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                                            {
                                                                                meal.name
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                            {
                                                                                meal.total_calories
                                                                            }{" "}
                                                                            cal
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
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
                                                    <p className="text-sm italic text-slate-500 dark:text-slate-400">
                                                        Aucun repas enregistré.
                                                    </p>
                                                )}
                                            </div>

                                            {/* Activities - Original Logic, Spiced Styling */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2.5">
                                                    <h4 className="flex items-center font-semibold text-md text-slate-700 dark:text-slate-200">
                                                        <TrendingUp className="w-4 h-4 mr-2 text-sky-500 dark:text-sky-400" />
                                                        Activités
                                                    </h4>
                                                    {selectedDayData.activities
                                                        .length > 0 && (
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
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
                                                                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                                            {
                                                                                activity.type
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                            {
                                                                                activity.calories_burned
                                                                            }{" "}
                                                                            cal
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
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
                                                    <p className="text-sm italic text-slate-500 dark:text-slate-400">
                                                        Aucune activité
                                                        enregistrée.
                                                    </p>
                                                )}
                                            </div>

                                            {/* Quick Actions - Original Logic, Spiced Styling */}
                                            <div className="pt-5 border-t border-slate-200 dark:border-slate-700">
                                                <h4 className="mb-3 font-semibold text-md text-slate-700 dark:text-slate-200">
                                                    Actions rapides
                                                </h4>
                                                <div className="space-y-2">
                                                    {[
                                                        // Original links, styled buttons
                                                        {
                                                            href: route(
                                                                "glycemia.index",
                                                                selectedDate
                                                                    ? {
                                                                          date: selectedDate,
                                                                      }
                                                                    : {}
                                                            ),
                                                            label: "Ajouter glycémie",
                                                            Icon: Activity,
                                                            color: "red",
                                                        },
                                                        {
                                                            href: route(
                                                                "nutrition.index",
                                                                selectedDate
                                                                    ? {
                                                                          date: selectedDate,
                                                                      }
                                                                    : {}
                                                            ),
                                                            label: "Ajouter repas",
                                                            Icon: Utensils,
                                                            color: "emerald",
                                                        },
                                                        {
                                                            href: route(
                                                                "activity.index",
                                                                selectedDate
                                                                    ? {
                                                                          date: selectedDate,
                                                                      }
                                                                    : {}
                                                            ),
                                                            label: "Ajouter activité",
                                                            Icon: TrendingUp,
                                                            color: "sky",
                                                        },
                                                    ].map((action) => (
                                                        <Link
                                                            key={action.label}
                                                            href={action.href}
                                                            className={`inline-flex items-center justify-center w-full px-3 py-2.5 text-sm font-medium leading-4 text-${action.color}-700 dark:text-${action.color}-300 bg-${action.color}-100 dark:bg-${action.color}-900/40 border border-transparent rounded-lg shadow-sm hover:bg-${action.color}-200 dark:hover:bg-${action.color}-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${action.color}-500 transition-colors`}
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />{" "}
                                                            {action.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-12 text-center">
                                            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                                            <p className="font-medium text-md text-slate-600 dark:text-slate-400">
                                                Sélectionnez une date
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Cliquez sur un jour du
                                                calendrier pour afficher les
                                                détails et ajouter des entrées.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 bg-white shadow-lg dark:bg-slate-800 rounded-xl">
                                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="font-semibold text-md text-slate-800 dark:text-slate-100">
                                        Légende
                                    </h3>
                                </div>
                                <div className="p-5 space-y-3">
                                    {[
                                        {
                                            label: "Journée complète",
                                            classes: getStatusColorClasses(
                                                "complete",
                                                false,
                                                true
                                            ),
                                        },
                                        {
                                            label: "Données partielles",
                                            classes: getStatusColorClasses(
                                                "partial",
                                                false,
                                                true
                                            ),
                                        },
                                        {
                                            label: "Aucune donnée (mois actuel)",
                                            classes: getStatusColorClasses(
                                                "empty",
                                                false,
                                                true
                                            ),
                                        },
                                        {
                                            label: "Jour hors mois actuel",
                                            classes: getStatusColorClasses(
                                                "empty",
                                                false,
                                                false
                                            ),
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center space-x-3"
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-sm border ${item.classes
                                                    .split(" ")
                                                    .filter(
                                                        (c) =>
                                                            c.startsWith(
                                                                "bg-"
                                                            ) ||
                                                            c.startsWith(
                                                                "border-"
                                                            )
                                                    )
                                                    .join(" ")}`.replace(
                                                    /hover:[^\s]+/g,
                                                    ""
                                                )}
                                            ></div>
                                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 border-2 border-indigo-500 rounded-sm dark:border-indigo-400 ring-1 ring-offset-1 ring-indigo-500 dark:ring-indigo-400"></div>
                                        <span className="text-sm text-slate-600 dark:text-slate-300">
                                            Aujourd'hui
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-4 h-4 rounded-sm border ${getStatusColorClasses(
                                                "",
                                                true,
                                                true
                                            )}`.replace(/hover:[^\s]+/g, "")}
                                        ></div>
                                        <span className="text-sm text-slate-600 dark:text-slate-300">
                                            Date sélectionnée
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
