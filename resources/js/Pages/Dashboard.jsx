"use client"; // Assuming this might be needed for some environments/tooling

import { useState } from "react";
import { Head, router } from "@inertiajs/react"; // `useForm` is not used in this file
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"; // Added CardDescription & CardFooter
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui Progress
import {
    Plus,
    TrendingUp,
    TrendingDown,
    Edit,
    Trash2,
    CalendarDays as Calendar, // Using a more common Calendar icon
    BarChart3, // For Trends/Stats
    Activity as ActivityIcon, // For Glucose
    Utensils, // For Meals
    Zap, // For Activity
    Target, // For Goals
    Edit3, // For Editing goals
    FileText, // For Recent Entries or no data
    MessageSquareQuote, // For Insights
    Palette, // Generic icon for type
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function Dashboard({
    auth,
    // Original props
    glycemiaStats,
    nutritionStats,
    activityStats,
    weeklyProgress,
    recentEntries,
    todayData,
}) {
    const [selectedPeriod, setSelectedPeriod] = useState("day"); // In French "jour" might be better if used in UI
    const [currentDate] = useState(new Date());

    const formatDateInFrench = (date) => {
        return date.toLocaleDateString("fr-FR", {
            // Changed to French locale
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusIcon = (trend) => {
        if (trend === "up")
            return (
                <TrendingUp className="w-4 h-4 text-red-500 dark:text-red-400" />
            );
        if (trend === "down")
            return (
                <TrendingDown className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            ); // Green for down trend (positive for glucose)
        return null;
    };

    // Assuming this function is for shadcn/ui Progress, we can pass the class directly
    const getProgressColorClass = (progress) => {
        if (progress >= 80) return "bg-emerald-500 dark:bg-emerald-400";
        if (progress >= 60) return "bg-sky-500 dark:bg-sky-400"; // Changed blue to sky
        if (progress >= 40) return "bg-amber-500 dark:bg-amber-400";
        return "bg-red-500 dark:bg-red-400";
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        router.get(
            route("dashboard"),
            { period },
            { preserveState: true, preserveScroll: true }
        ); // Added preserveScroll
    };

    const deleteEntry = (entryType, entryId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
            const routes = {
                glucose: "glycemia.destroy", // Make sure this route exists for DELETE
                meal: "meals.destroy",
                activity: "activity.destroy",
            };
            if (routes[entryType]) {
                router.delete(route(routes[entryType], entryId), {
                    preserveScroll: true,
                });
            }
        }
    };

    // Original calculations, just ensuring null/undefined checks for robustness
    const glucoseTrend =
        todayData?.glucoseReadings && todayData.glucoseReadings.length >= 2
            ? todayData.glucoseReadings[0].value >
              todayData.glucoseReadings[1].value
                ? "up"
                : todayData.glucoseReadings[0].value <
                  todayData.glucoseReadings[1].value
                ? "down"
                : "stable"
            : "stable";

    const mealProgress = {
        logged: todayData?.meals?.length ?? 0,
        total: 4, // Petit-déj, Déjeuner, Dîner, Collation
        lastMeal:
            todayData?.meals && todayData.meals.length > 0
                ? new Date(todayData.meals[0].eaten_at).toLocaleTimeString(
                      "fr-FR",
                      {
                          // French time
                          hour: "2-digit",
                          minute: "2-digit",
                      }
                  )
                : null,
        lastMealType:
            todayData?.meals && todayData.meals.length > 0
                ? todayData.meals[0].meal_type_in_french // Assuming this prop exists and is in French
                : "Aucun repas enregistré", // French
    };

    const activityProgress = {
        steps: todayData?.activities
            ? todayData.activities.reduce((total, activity) => {
                  if (activity.activity_type === "walking")
                      return total + activity.duration_minutes * 100;
                  if (activity.activity_type === "running")
                      return total + activity.duration_minutes * 150;
                  return total + activity.duration_minutes * 50;
              }, 0)
            : 0,
        goal: 10000,
        percentage: 0,
        status: "Commencez à bouger !", // French
    };

    activityProgress.percentage = Math.min(
        100,
        Math.round((activityProgress.steps / activityProgress.goal) * 100)
    );
    activityProgress.status =
        activityProgress.percentage >= 80
            ? "Presque à votre objectif !" // French
            : activityProgress.percentage >= 50
            ? "À mi-chemin !" // French
            : activityProgress.percentage > 0
            ? "Continuez comme ça !" // French
            : "Commencez à bouger !"; // French

    const chartData = todayData?.glucoseReadings
        ? todayData.glucoseReadings
              .map((reading) => ({
                  time: new Date(reading.measured_at).toLocaleTimeString(
                      "fr-FR",
                      {
                          // French time
                          hour: "2-digit",
                          minute: "2-digit",
                      }
                  ),
                  value: Math.round(reading.value * 18),
              }))
              .reverse() // Reverse for chronological order on chart
        : [];

    const glucoseSummary = {
        lowest: {
            value:
                todayData?.glucoseReadings?.length > 0
                    ? Math.round(
                          Math.min(
                              ...todayData.glucoseReadings.map((r) => r.value)
                          ) * 18
                      )
                    : 0,
            time:
                todayData?.glucoseReadings?.length > 0
                    ? new Date(
                          todayData.glucoseReadings.reduce(
                              (min, r) => (r.value < min.value ? r : min),
                              todayData.glucoseReadings[0]
                          ).measured_at
                      ).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : null,
        },
        average: {
            value:
                todayData?.glucoseReadings?.length > 0
                    ? Math.round(
                          (todayData.glucoseReadings.reduce(
                              (sum, r) => sum + r.value,
                              0
                          ) /
                              todayData.glucoseReadings.length) *
                              18
                      )
                    : 0,
            note: "Dans la plage cible", // French
        },
        highest: {
            value:
                todayData?.glucoseReadings?.length > 0
                    ? Math.round(
                          Math.max(
                              ...todayData.glucoseReadings.map((r) => r.value)
                          ) * 18
                      )
                    : 0,
            time:
                todayData?.glucoseReadings?.length > 0
                    ? new Date(
                          todayData.glucoseReadings.reduce(
                              (max, r) => (r.value > max.value ? r : max),
                              todayData.glucoseReadings[0]
                          ).measured_at
                      ).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : null,
        },
    };

    const dailyGoals = [
        {
            id: "glucose_range",
            title: "Glycémie dans la plage",
            target: "80-150 mg/dL", // French
            progress:
                todayData?.glucoseReadings?.length > 0
                    ? Math.round(
                          (todayData.glucoseReadings.filter(
                              (r) => r.status === "normal"
                          ).length /
                              todayData.glucoseReadings.length) *
                              100
                      )
                    : 0,
            status: "Pas assez de données",
            statusColor: "text-slate-600 dark:text-slate-400", // French
            description:
                todayData?.glucoseReadings?.length > 0
                    ? `${Math.round(
                          (todayData.glucoseReadings.filter(
                              (r) => r.status === "normal"
                          ).length /
                              todayData.glucoseReadings.length) *
                              100
                      )}% des lectures dans la plage aujourd'hui`
                    : "Aucune lecture aujourd'hui", // French
        },
        {
            id: "daily_steps",
            title: "Pas quotidiens",
            target: "10,000 pas", // French
            progress: activityProgress.percentage,
            status: activityProgress.status,
            statusColor:
                activityProgress.percentage >= 80
                    ? "text-emerald-600 dark:text-emerald-400"
                    : activityProgress.percentage >= 50
                    ? "text-sky-600 dark:text-sky-400"
                    : activityProgress.percentage > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400",
            description: `${activityProgress.steps.toLocaleString(
                "fr-FR"
            )} pas effectués jusqu'à présent`, // French
        },
        {
            id: "carb_tracking",
            title: "Suivi des glucides",
            target: "Enregistrer tous les repas", // French
            progress: Math.round(
                (mealProgress.logged / mealProgress.total) * 100
            ),
            status:
                mealProgress.logged >= 3
                    ? "Excellent !"
                    : mealProgress.logged >= 2
                    ? "En cours"
                    : mealProgress.logged >= 1
                    ? "Débuté"
                    : "Non commencé", // French
            statusColor:
                mealProgress.logged >= 3
                    ? "text-emerald-600 dark:text-emerald-400"
                    : mealProgress.logged >= 2
                    ? "text-sky-600 dark:text-sky-400"
                    : mealProgress.logged >= 1
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400",
            description: `${mealProgress.logged} sur ${mealProgress.total} repas enregistrés aujourd'hui`, // French
        },
        {
            id: "weekly_activity",
            title: "Activité hebdomadaire",
            target: "150 minutes", // French
            progress: weeklyProgress?.percentage ?? 0,
            status: weeklyProgress
                ? weeklyProgress.on_track
                    ? "Sur la bonne voie"
                    : "Attention requise"
                : "Non commencé", // French
            statusColor:
                weeklyProgress && weeklyProgress.percentage >= 80
                    ? "text-emerald-600 dark:text-emerald-400"
                    : weeklyProgress && weeklyProgress.percentage >= 50
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-amber-600 dark:text-amber-400",
            description: weeklyProgress
                ? `${weeklyProgress.achieved} sur ${weeklyProgress.goal} minutes cette semaine`
                : "Aucune activité enregistrée", // French
        },
    ];

    const insights = [];
    if (todayData?.glucoseReadings?.length >= 3)
        insights.push("Bravo pour la régularité de votre suivi glycémique !");
    if (todayData?.meals?.length >= 3)
        insights.push("Vous gérez bien le suivi de vos repas aujourd'hui.");
    if (todayData?.activities?.length >= 1)
        insights.push("Continuez votre excellent travail en restant actif !");
    if (weeklyProgress?.percentage >= 80)
        insights.push(
            "Vous êtes en bonne voie pour atteindre votre objectif d'activité hebdomadaire !"
        );
    if (insights.length === 0)
        insights.push(
            "Commencez votre journée en enregistrant votre première lecture de glycémie ou votre repas !"
        );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center space-x-4">
                        <img
                            src={
                                auth.user.profile_photo_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    auth.user.name
                                )}&color=7F9CF5&background=EBF4FF`
                            }
                            alt="Avatar"
                            className="w-12 h-12 rounded-full shadow-md"
                        />
                        <div>
                            <h2 className="text-2xl font-semibold leading-tight text-slate-800 dark:text-slate-100">
                                Bonjour, {auth.user.name.split(" ")[0]} !
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {formatDateInFrench(currentDate)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            {
                                href: route("glycemia.index"),
                                label: "Glycémie",
                                Icon: ActivityIcon,
                                color: "indigo",
                            },
                            {
                                href: route("nutrition.index"),
                                label: "Repas",
                                Icon: Utensils,
                                color: "emerald",
                            },
                            {
                                href: route("activity.index"),
                                label: "Activité",
                                Icon: Zap,
                                color: "sky",
                            },
                        ].map((action) => (
                            <Button
                                key={action.label}
                                className={`bg-${action.color}-600 hover:bg-${action.color}-700 dark:bg-${action.color}-500 dark:hover:bg-${action.color}-600 text-white shadow-md hover:shadow-lg transition-all`}
                                asChild
                            >
                                <a href={action.href}>
                                    <action.Icon className="w-4 h-4 mr-2" />{" "}
                                    {action.label}
                                </a>
                            </Button>
                        ))}
                    </div>
                </div>
            }
        >
            <Head title="Tableau de Bord" />

            <div className="py-6">
                <div className="mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
                    {" "}
                    {/* Increased space-y */}
                    {/* Today's Progress Section */}
                    <section>
                        <div className="flex flex-col items-start justify-between mb-5 sm:flex-row sm:items-center">
                            <h3 className="flex items-center text-xl font-semibold text-slate-800 dark:text-slate-100">
                                <BarChart3 className="w-6 h-6 mr-2.5 text-indigo-500 dark:text-indigo-400" />{" "}
                                Progression d'Aujourd'hui
                            </h3>
                            <span className="flex items-center mt-1 text-sm font-medium sm:mt-0 text-amber-600 dark:text-amber-400">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                {currentDate.toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    title: "Glycémie",
                                    data: todayData?.glucoseReadings,
                                    value:
                                        todayData?.glucoseReadings?.length > 0
                                            ? `${Math.round(
                                                  todayData.glucoseReadings[0]
                                                      .value * 18
                                              )} mg/dL`
                                            : "--",
                                    trend: glucoseTrend,
                                    time:
                                        todayData?.glucoseReadings?.length > 0
                                            ? new Date(
                                                  todayData.glucoseReadings[0].measured_at
                                              ).toLocaleTimeString("fr-FR", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "N/A",
                                    progressPercent:
                                        glycemiaStats?.normal_percentage ?? 0,
                                    progressLabel: "dans la cible",
                                    Icon: ActivityIcon,
                                    color: "indigo",
                                    routeName: "glycemia.index",
                                },
                                {
                                    title: "Repas",
                                    data: todayData?.meals,
                                    value: `${mealProgress.logged}/${mealProgress.total}`,
                                    time: mealProgress.lastMeal,
                                    progressPercent:
                                        (mealProgress.logged /
                                            mealProgress.total) *
                                        100,
                                    progressLabel: mealProgress.lastMealType,
                                    Icon: Utensils,
                                    color: "emerald",
                                    routeName: "nutrition.index",
                                },
                                {
                                    title: "Activité",
                                    data: todayData?.activities,
                                    value: `${activityProgress.steps.toLocaleString(
                                        "fr-FR"
                                    )} pas`,
                                    time: `Objectif: ${activityProgress.goal.toLocaleString(
                                        "fr-FR"
                                    )}`,
                                    progressPercent:
                                        activityProgress.percentage,
                                    progressLabel: activityProgress.status,
                                    Icon: Zap,
                                    color: "sky",
                                    routeName: "activity.index",
                                },
                            ].map((card) => (
                                <Card
                                    key={card.title}
                                    className="transition-shadow duration-300 shadow-lg hover:shadow-xl dark:bg-slate-800"
                                >
                                    <CardHeader className="flex flex-row items-start justify-between pb-3 space-y-0">
                                        <div className="space-y-1">
                                            <CardTitle className="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                <card.Icon
                                                    className={`w-5 h-5 mr-2 text-${card.color}-500 dark:text-${card.color}-400`}
                                                />
                                                {card.title}
                                            </CardTitle>
                                            <div className="flex items-baseline space-x-1">
                                                <p
                                                    className={`text-2xl font-bold text-${card.color}-600 dark:text-${card.color}-400`}
                                                >
                                                    {card.value}
                                                </p>
                                                {card.trend &&
                                                    getStatusIcon(card.trend)}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            asChild
                                        >
                                            <a href={route(card.routeName)}>
                                                <BarChart3 className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                                            Dernière MàJ:{" "}
                                            {card.time || "Aujourd'hui"}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <Progress
                                                value={card.progressPercent}
                                                className={`h-1.5 flex-1 [&>*]:bg-${card.color}-500 dark:[&>*]:bg-${card.color}-400`}
                                            />
                                            <span
                                                className={`text-xs font-medium text-${card.color}-600 dark:text-${card.color}-400`}
                                            >
                                                {card.progressLabel}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                    {/* Glucose Trends Chart */}
                    <Card className="transition-shadow duration-300 shadow-lg hover:shadow-xl dark:bg-slate-800">
                        <CardHeader className="border-b dark:border-slate-700">
                            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                                <CardTitle className="flex items-center text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    <BarChart3 className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />{" "}
                                    Tendances Glycémiques
                                </CardTitle>
                                <div className="flex p-0.5 space-x-1 bg-slate-100 dark:bg-slate-700 rounded-md">
                                    {[
                                        { label: "Jour", period: "day" },
                                        { label: "Semaine", period: "week" },
                                        { label: "Mois", period: "month" },
                                    ].map((item) => (
                                        <Button
                                            key={item.period}
                                            variant="ghost"
                                            size="sm"
                                            className={`px-3 py-1 text-xs data-[active=true]:bg-white dark:data-[active=true]:bg-slate-600 data-[active=true]:shadow data-[active=true]:text-indigo-600 dark:data-[active=true]:text-indigo-400 hover:bg-white dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300`}
                                            data-active={
                                                selectedPeriod === item.period
                                            }
                                            onClick={() =>
                                                handlePeriodChange(item.period)
                                            }
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {chartData.length > 0 ? (
                                <>
                                    <div className="mb-6 h-72 sm:h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart
                                                data={chartData}
                                                margin={{
                                                    top: 5,
                                                    right: 20,
                                                    left: -10,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    strokeOpacity={0.2}
                                                    className="dark:stroke-slate-600"
                                                />
                                                <XAxis
                                                    dataKey="time"
                                                    tick={{ fontSize: 11 }}
                                                    className="fill-slate-500 dark:fill-slate-400"
                                                />
                                                <YAxis
                                                    domain={[
                                                        "dataMin - 10",
                                                        "dataMax + 10",
                                                    ]}
                                                    tick={{ fontSize: 11 }}
                                                    className="fill-slate-500 dark:fill-slate-400"
                                                    unit=" mg/dL"
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor:
                                                            "var(--card-background, white)",
                                                        borderColor:
                                                            "var(--border-color, #e2e8f0)",
                                                        borderRadius: "0.5rem",
                                                        boxShadow:
                                                            "var(--card-shadow)",
                                                    }}
                                                    labelStyle={{
                                                        fontWeight: "600",
                                                        color: "var(--text-strong)",
                                                    }}
                                                    formatter={(value) => [
                                                        `${value} mg/dL`,
                                                        "Glycémie",
                                                    ]}
                                                    labelFormatter={(label) =>
                                                        `Heure: ${label}`
                                                    }
                                                />
                                                <Legend
                                                    verticalAlign="top"
                                                    wrapperStyle={{
                                                        paddingBottom: "10px",
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    name="Glycémie"
                                                    stroke="var(--color-indigo-500, #4f46e5)"
                                                    strokeWidth={2.5}
                                                    dot={{
                                                        fill: "var(--color-indigo-500, #4f46e5)",
                                                        strokeWidth: 2,
                                                        r: 4,
                                                        stroke: "var(--card-background, white)",
                                                    }}
                                                    activeDot={{
                                                        r: 6,
                                                        strokeWidth: 2,
                                                        stroke: "var(--card-background, white)",
                                                        fill: "var(--color-indigo-600, #4338ca)",
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        {[
                                            {
                                                title: "Plus Basse",
                                                value: `${glucoseSummary.lowest.value} mg/dL`,
                                                time: glucoseSummary.lowest
                                                    .time,
                                                IconComp: TrendingDown,
                                                color: "sky",
                                            },
                                            {
                                                title: "Moyenne",
                                                value: `${glucoseSummary.average.value} mg/dL`,
                                                time: glucoseSummary.average
                                                    .note,
                                                IconComp: () => (
                                                    <span
                                                        className={`text-2xl font-bold text-${
                                                            glucoseSummary
                                                                .average
                                                                .value >= 80 &&
                                                            glucoseSummary
                                                                .average
                                                                .value <= 150
                                                                ? "emerald"
                                                                : "amber"
                                                        }-600`}
                                                    >
                                                        =
                                                    </span>
                                                ),
                                                color:
                                                    glucoseSummary.average
                                                        .value >= 80 &&
                                                    glucoseSummary.average
                                                        .value <= 150
                                                        ? "emerald"
                                                        : "amber",
                                            },
                                            {
                                                title: "Plus Élevée",
                                                value: `${glucoseSummary.highest.value} mg/dL`,
                                                time: glucoseSummary.highest
                                                    .time,
                                                IconComp: TrendingUp,
                                                color: "red",
                                            },
                                        ].map((summary) => (
                                            <Card
                                                key={summary.title}
                                                className={`bg-${summary.color}-50 dark:bg-${summary.color}-900/30 border-${summary.color}-200 dark:border-${summary.color}-700`}
                                            >
                                                <CardContent className="p-4 text-center">
                                                    <div className="flex items-center justify-center mb-1.5">
                                                        <summary.IconComp
                                                            className={`w-5 h-5 mr-1 text-${summary.color}-600 dark:text-${summary.color}-400`}
                                                        />
                                                        <span
                                                            className={`text-sm font-semibold text-${summary.color}-800 dark:text-${summary.color}-200`}
                                                        >
                                                            {summary.title}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={`text-2xl font-bold text-${summary.color}-600 dark:text-${summary.color}-400`}
                                                    >
                                                        {summary.value}
                                                    </div>
                                                    <div
                                                        className={`text-xs text-${summary.color}-700 dark:text-${summary.color}-300`}
                                                    >
                                                        {summary.time}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="py-12 text-center">
                                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                                    <p className="mb-3 text-slate-600 dark:text-slate-400">
                                        Aucune lecture de glycémie pour
                                        aujourd'hui.
                                    </p>
                                    <Button
                                        className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                        asChild
                                    >
                                        <a href={route("glycemia.index")}>
                                            <Plus className="mr-2" /> Ajouter
                                            votre Première Lecture
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    {/* Daily Goals */}
                    <Card className="transition-shadow duration-300 shadow-lg hover:shadow-xl dark:bg-slate-800">
                        <CardHeader className="border-b dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    <Target className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                                    Objectifs Quotidiens
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                >
                                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                                    Modifier Objectifs
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {dailyGoals.map((goal) => {
                                const iconsMap = {
                                    glucose_range: ActivityIcon,
                                    daily_steps: Zap,
                                    carb_tracking: Utensils,
                                    weekly_activity: TrendingUp,
                                };
                                const GoalIcon = iconsMap[goal.id] || Target;
                                return (
                                    <div key={goal.id}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center rounded-full w-9 h-9 bg-slate-100 dark:bg-slate-700">
                                                    <GoalIcon
                                                        className={`w-5 h-5 ${goal.statusColor.replace(
                                                            "text-",
                                                            "text-"
                                                        )}`}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200">
                                                        {goal.title}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        Cible: {goal.target}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span
                                                    className={`text-sm font-semibold ${goal.statusColor}`}
                                                >
                                                    {goal.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Progress
                                                value={goal.progress}
                                                className={`h-2 flex-1 [&>*]:${getProgressColorClass(
                                                    goal.progress
                                                )}`}
                                            />
                                            <span className="flex-shrink-0 min-w-[3rem] text-sm text-right text-slate-600 dark:text-slate-300">
                                                {goal.progress}%
                                            </span>
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {goal.description}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                    {/* Motivational Message / Insights */}
                    {insights?.length > 0 && (
                        <Card className="border-indigo-200 shadow-lg dark:border-indigo-700/50 bg-gradient-to-r from-indigo-50 dark:from-indigo-900/30 to-sky-50 dark:to-sky-900/30">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400">
                                        <MessageSquareQuote className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-indigo-800 dark:text-indigo-200">
                                            Excellent travail,{" "}
                                            {auth.user.name.split(" ")[0]} !
                                        </h3>
                                        <div className="mt-1.5 space-y-1 text-sm text-indigo-700 dark:text-indigo-300">
                                            {insights.map((insight, index) => (
                                                <p key={index}>{insight}</p>
                                            ))}
                                        </div>
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 mt-2.5 text-sm text-indigo-600 dark:text-indigo-400"
                                        >
                                            Voir plus d'analyses
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {/* Recent Entries Table */}
                    <Card className="transition-shadow duration-300 shadow-lg hover:shadow-xl dark:bg-slate-800">
                        <CardHeader className="border-b dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    <FileText className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                                    Entrées Récentes
                                </CardTitle>
                                <Button
                                    variant="link"
                                    className="h-auto px-0 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                >
                                    Voir Tout
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="-mx-6 overflow-x-auto sm:mx-0">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b dark:border-slate-700">
                                            {[
                                                "HEURE",
                                                "TYPE",
                                                "VALEUR",
                                                "NOTES",
                                                "ACTIONS",
                                            ].map((header) => (
                                                <th
                                                    key={header}
                                                    className={`py-3 px-4 text-xs font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400 ${
                                                        header === "ACTIONS"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {recentEntries &&
                                        recentEntries.length > 0 ? (
                                            recentEntries.map((entry) => {
                                                const [
                                                    entrySystemType,
                                                    entryIdNum,
                                                ] = entry.id.split("_"); // e.g. glucose_123
                                                return (
                                                    <tr
                                                        key={entry.id}
                                                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                                    >
                                                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                            {entry.time}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Badge
                                                                variant="outline"
                                                                className={`${
                                                                    entry.typeColor
                                                                        ?.replace(
                                                                            "bg-",
                                                                            "bg-"
                                                                        )
                                                                        .replace(
                                                                            "text-",
                                                                            "text-"
                                                                        ) ||
                                                                    "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                                                } px-2 py-0.5 text-xs font-medium`}
                                                            >
                                                                {entry.icon || (
                                                                    <Palette className="w-3 h-3 mr-1" />
                                                                )}{" "}
                                                                {entry.type}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                                            {entry.value}
                                                        </td>
                                                        <td className="max-w-xs px-4 py-3 text-sm truncate text-slate-600 dark:text-slate-400">
                                                            {entry.notes || "-"}
                                                        </td>
                                                        <td className="px-4 py-3 space-x-1 text-right whitespace-nowrap">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-8 h-8 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-8 h-8 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500"
                                                                onClick={() =>
                                                                    deleteEntry(
                                                                        entrySystemType,
                                                                        entryIdNum
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-4 py-12 text-center"
                                                >
                                                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                                                    <p className="mb-3 text-slate-600 dark:text-slate-400">
                                                        Aucune entrée
                                                        enregistrée aujourd'hui.
                                                    </p>
                                                    <div className="flex flex-wrap justify-center gap-3">
                                                        {[
                                                            {
                                                                href: route(
                                                                    "glycemia.index"
                                                                ),
                                                                label: "Ajouter Glycémie",
                                                            },
                                                            {
                                                                href: route(
                                                                    "nutrition.index"
                                                                ),
                                                                label: "Enregistrer Repas",
                                                            },
                                                            {
                                                                href: route(
                                                                    "activity.index"
                                                                ),
                                                                label: "Noter Activité",
                                                            },
                                                        ].map((action) => (
                                                            <Button
                                                                key={
                                                                    action.label
                                                                }
                                                                variant="outline"
                                                                size="sm"
                                                                className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={
                                                                        action.href
                                                                    }
                                                                >
                                                                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                                                                    {
                                                                        action.label
                                                                    }
                                                                </a>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
