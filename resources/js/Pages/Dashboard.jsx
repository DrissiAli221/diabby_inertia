"use client";

import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Plus,
    TrendingUp,
    TrendingDown,
    Edit,
    Trash2,
    Calendar,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Dashboard({
    auth,
    glycemiaStats,
    nutritionStats,
    activityStats,
    weeklyProgress,
    recentEntries,
    todayData,
}) {
    const [selectedPeriod, setSelectedPeriod] = useState("day");
    const [currentDate] = useState(new Date());

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusIcon = (trend) => {
        if (trend === "up")
            return <TrendingUp className="w-4 h-4 text-red-500" />;
        if (trend === "down")
            return <TrendingDown className="w-4 h-4 text-green-500" />;
        return null;
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 60) return "bg-blue-500";
        if (progress >= 40) return "bg-orange-500";
        return "bg-red-500";
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        router.get(route("dashboard"), { period }, { preserveState: true });
    };

    const deleteEntry = (entryType, entryId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
            const routes = {
                glucose: "glycemia.destroy",
                meal: "meals.destroy",
                activity: "activity.destroy",
            };

            if (routes[entryType]) {
                router.delete(route(routes[entryType], entryId));
            }
        }
    };

    // Calculate glucose trend
    const glucoseTrend =
        todayData.glucoseReadings && todayData.glucoseReadings.length >= 2
            ? todayData.glucoseReadings[0].value >
              todayData.glucoseReadings[1].value
                ? "up"
                : todayData.glucoseReadings[0].value <
                  todayData.glucoseReadings[1].value
                ? "down"
                : "stable"
            : "stable";

    // Calculate meal progress
    const mealProgress = {
        logged: todayData.meals ? todayData.meals.length : 0,
        total: 4, // Breakfast, lunch, dinner, snack
        lastMeal:
            todayData.meals && todayData.meals.length > 0
                ? new Date(todayData.meals[0].eaten_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                  })
                : null,
        lastMealType:
            todayData.meals && todayData.meals.length > 0
                ? todayData.meals[0].meal_type_in_french
                : "No meals logged",
    };

    // Calculate activity progress
    const activityProgress = {
        steps: todayData.activities
            ? todayData.activities.reduce((total, activity) => {
                  // Rough estimation: walking = 100 steps/min, running = 150 steps/min
                  if (activity.activity_type === "walking")
                      return total + activity.duration_minutes * 100;
                  if (activity.activity_type === "running")
                      return total + activity.duration_minutes * 150;
                  return total + activity.duration_minutes * 50; // Other activities
              }, 0)
            : 0,
        goal: 10000,
        percentage: 0,
        status: "Start moving!",
    };

    activityProgress.percentage = Math.min(
        100,
        Math.round((activityProgress.steps / activityProgress.goal) * 100)
    );
    activityProgress.status =
        activityProgress.percentage >= 80
            ? "Almost at your goal!"
            : activityProgress.percentage >= 50
            ? "Halfway there!"
            : activityProgress.percentage > 0
            ? "Keep going!"
            : "Start moving!";

    // Prepare chart data
    const chartData = todayData.glucoseReadings
        ? todayData.glucoseReadings.map((reading) => ({
              time: new Date(reading.measured_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
              }),
              value: Math.round(reading.value * 18), // Convert mmol/L to mg/dL
          }))
        : [];

    // Calculate glucose summary
    const glucoseSummary = {
        lowest: {
            value:
                todayData.glucoseReadings &&
                todayData.glucoseReadings.length > 0
                    ? Math.round(
                          Math.min(
                              ...todayData.glucoseReadings.map((r) => r.value)
                          ) * 18
                      )
                    : 0,
            time:
                todayData.glucoseReadings &&
                todayData.glucoseReadings.length > 0
                    ? new Date(
                          todayData.glucoseReadings.reduce(
                              (min, r) => (r.value < min.value ? r : min),
                              todayData.glucoseReadings[0]
                          ).measured_at
                      ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : null,
        },
        average: {
            value:
                todayData.glucoseReadings &&
                todayData.glucoseReadings.length > 0
                    ? Math.round(
                          (todayData.glucoseReadings.reduce(
                              (sum, r) => sum + r.value,
                              0
                          ) /
                              todayData.glucoseReadings.length) *
                              18
                      )
                    : 0,
            note: "Within target range",
        },
        highest: {
            value:
                todayData.glucoseReadings &&
                todayData.glucoseReadings.length > 0
                    ? Math.round(
                          Math.max(
                              ...todayData.glucoseReadings.map((r) => r.value)
                          ) * 18
                      )
                    : 0,
            time:
                todayData.glucoseReadings &&
                todayData.glucoseReadings.length > 0
                    ? new Date(
                          todayData.glucoseReadings.reduce(
                              (max, r) => (r.value > max.value ? r : max),
                              todayData.glucoseReadings[0]
                          ).measured_at
                      ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : null,
        },
    };

    // Calculate daily goals
    const dailyGoals = [
        {
            id: "glucose_range",
            title: "Keep glucose in range",
            target: "80-150 mg/dL",
            progress:
                todayData.glucoseReadings &&
                todayData.glucoseReadings.length > 0
                    ? Math.round(
                          (todayData.glucoseReadings.filter(
                              (r) => r.status === "normal"
                          ).length /
                              todayData.glucoseReadings.length) *
                              100
                      )
                    : 0,
            status: "Not enough data",
            statusColor: "text-gray-600",
            description:
                todayData.glucoseReadings &&
                todayData.glucoseReadings.length > 0
                    ? `${Math.round(
                          (todayData.glucoseReadings.filter(
                              (r) => r.status === "normal"
                          ).length /
                              todayData.glucoseReadings.length) *
                              100
                      )}% of readings in range today`
                    : "No readings today",
        },
        {
            id: "daily_steps",
            title: "Daily steps",
            target: "10,000 steps",
            progress: activityProgress.percentage,
            status: activityProgress.status,
            statusColor:
                activityProgress.percentage >= 80
                    ? "text-green-600"
                    : activityProgress.percentage >= 50
                    ? "text-blue-600"
                    : activityProgress.percentage > 0
                    ? "text-orange-600"
                    : "text-red-600",
            description: `${activityProgress.steps.toLocaleString()} steps taken so far`,
        },
        {
            id: "carb_tracking",
            title: "Carb tracking",
            target: "Log all meals",
            progress: Math.round(
                (mealProgress.logged / mealProgress.total) * 100
            ),
            status:
                mealProgress.logged >= 3
                    ? "Great!"
                    : mealProgress.logged >= 2
                    ? "In Progress"
                    : mealProgress.logged >= 1
                    ? "Getting Started"
                    : "Not Started",
            statusColor:
                mealProgress.logged >= 3
                    ? "text-green-600"
                    : mealProgress.logged >= 2
                    ? "text-blue-600"
                    : mealProgress.logged >= 1
                    ? "text-orange-600"
                    : "text-red-600",
            description: `${mealProgress.logged} of ${mealProgress.total} meals logged today`,
        },
        {
            id: "weekly_activity",
            title: "Weekly activity",
            target: "150 minutes",
            progress: weeklyProgress ? weeklyProgress.percentage : 0,
            status: weeklyProgress
                ? weeklyProgress.on_track
                    ? "On Track"
                    : "Needs Attention"
                : "Not Started",
            statusColor:
                weeklyProgress && weeklyProgress.percentage >= 80
                    ? "text-green-600"
                    : weeklyProgress && weeklyProgress.percentage >= 50
                    ? "text-blue-600"
                    : "text-orange-600",
            description: weeklyProgress
                ? `${weeklyProgress.achieved} of ${weeklyProgress.goal} minutes this week`
                : "No activity recorded",
        },
    ];

    // Generate insights
    const insights = [];

    if (todayData.glucoseReadings && todayData.glucoseReadings.length >= 3) {
        insights.push(
            "Great job staying consistent with your glucose monitoring!"
        );
    }

    if (todayData.meals && todayData.meals.length >= 3) {
        insights.push("You're doing well with meal tracking today.");
    }

    if (todayData.activities && todayData.activities.length >= 1) {
        insights.push("Keep up the great work with staying active!");
    }

    if (weeklyProgress && weeklyProgress.percentage >= 80) {
        insights.push("You're on track to meet your weekly activity goal!");
    }

    if (insights.length === 0) {
        insights.push(
            "Start your day by logging your first glucose reading or meal!"
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Hello, {auth.user.name.split(" ")[0]}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            {formatDate(currentDate)}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            asChild
                        >
                            <a href={route("glycemia.index")}>
                                <Plus className="w-4 h-4 mr-2" />
                                Log Glucose
                            </a>
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            asChild
                        >
                            <a href={route("nutrition.index")}>
                                <Plus className="w-4 h-4 mr-2" />
                                Log Meal
                            </a>
                        </Button>
                        <Button
                            className="bg-purple-600 hover:bg-purple-700"
                            asChild
                        >
                            <a href={route("activity.index")}>
                                <Plus className="w-4 h-4 mr-2" />
                                Log Activity
                            </a>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    {/* Today's Progress */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="flex items-center text-lg font-medium text-gray-900">
                                📊 Today's Progress
                            </h3>
                            <span className="text-sm font-medium text-orange-600">
                                <Calendar className="inline w-4 h-4 mr-1" />
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Glucose Card */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                                <span className="text-blue-600">
                                                    🩸
                                                </span>
                                            </div>
                                            <CardTitle className="text-sm font-medium text-gray-600">
                                                Glucose
                                            </CardTitle>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8"
                                            asChild
                                        >
                                            <a href={route("glycemia.index")}>
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                </svg>
                                            </a>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {todayData.glucoseReadings &&
                                                todayData.glucoseReadings
                                                    .length > 0
                                                    ? Math.round(
                                                          todayData
                                                              .glucoseReadings[0]
                                                              .value * 18
                                                      )
                                                    : "--"}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                mg/dL
                                            </span>
                                            {getStatusIcon(glucoseTrend)}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Last reading:{" "}
                                            {todayData.glucoseReadings &&
                                            todayData.glucoseReadings.length > 0
                                                ? new Date(
                                                      todayData.glucoseReadings[0].measured_at
                                                  ).toLocaleTimeString([], {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : "No readings today"}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-blue-500 h-1.5 rounded-full"
                                                    style={{
                                                        width: `${
                                                            glycemiaStats &&
                                                            glycemiaStats.normal_percentage
                                                                ? glycemiaStats.normal_percentage
                                                                : 0
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-green-600">
                                                {glycemiaStats &&
                                                glycemiaStats.normal_percentage
                                                    ? glycemiaStats.normal_percentage
                                                    : 0}
                                                % in range
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Meals Card */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                                <span className="text-green-600">
                                                    🍽️
                                                </span>
                                            </div>
                                            <CardTitle className="text-sm font-medium text-gray-600">
                                                Meals
                                            </CardTitle>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8"
                                            asChild
                                        >
                                            <a href={route("nutrition.index")}>
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                </svg>
                                            </a>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl font-bold text-green-600">
                                                {mealProgress.logged}/
                                                {mealProgress.total}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                logged
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Last meal:{" "}
                                            {mealProgress.lastMeal ||
                                                "No meals logged"}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-green-500 h-1.5 rounded-full"
                                                    style={{
                                                        width: `${
                                                            (mealProgress.logged /
                                                                mealProgress.total) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-orange-600">
                                                {mealProgress.lastMealType}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Activity Card */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                                                <span className="text-purple-600">
                                                    🚶
                                                </span>
                                            </div>
                                            <CardTitle className="text-sm font-medium text-gray-600">
                                                Activity
                                            </CardTitle>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8"
                                            asChild
                                        >
                                            <a href={route("activity.index")}>
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                </svg>
                                            </a>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl font-bold text-purple-600">
                                                {activityProgress.steps.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                steps
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Goal:{" "}
                                            {activityProgress.goal.toLocaleString()}{" "}
                                            steps
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-purple-500 h-1.5 rounded-full"
                                                    style={{
                                                        width: `${activityProgress.percentage}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-blue-600">
                                                {activityProgress.status}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Glucose Trends */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-blue-600">📈</span>
                                    <CardTitle>Glucose Trends</CardTitle>
                                </div>
                                <div className="flex space-x-2">
                                    {["Day", "Week", "Month"].map((period) => (
                                        <Button
                                            key={period}
                                            variant={
                                                selectedPeriod ===
                                                period.toLowerCase()
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                handlePeriodChange(
                                                    period.toLowerCase()
                                                )
                                            }
                                        >
                                            {period}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {chartData.length > 0 ? (
                                <>
                                    <div className="h-64 mb-6">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="time" />
                                                <YAxis domain={[80, 160]} />
                                                <Tooltip
                                                    formatter={(value) => [
                                                        `${value} mg/dL`,
                                                        "Glucose",
                                                    ]}
                                                    labelFormatter={(label) =>
                                                        `Time: ${label}`
                                                    }
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    dot={{
                                                        fill: "#3b82f6",
                                                        strokeWidth: 2,
                                                        r: 4,
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <Card className="bg-blue-50">
                                            <CardContent className="p-4 text-center">
                                                <div className="flex items-center justify-center mb-2">
                                                    <TrendingDown className="w-5 h-5 mr-1 text-blue-600" />
                                                    <span className="text-sm font-medium text-blue-900">
                                                        Lowest Reading
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {
                                                        glucoseSummary.lowest
                                                            .value
                                                    }{" "}
                                                    mg/dL
                                                </div>
                                                <div className="text-xs text-blue-700">
                                                    {glucoseSummary.lowest.time}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-green-50">
                                            <CardContent className="p-4 text-center">
                                                <div className="flex items-center justify-center mb-2">
                                                    <span className="mr-1 text-green-600">
                                                        =
                                                    </span>
                                                    <span className="text-sm font-medium text-green-900">
                                                        Average Reading
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-bold text-green-600">
                                                    {
                                                        glucoseSummary.average
                                                            .value
                                                    }{" "}
                                                    mg/dL
                                                </div>
                                                <div className="text-xs text-green-700">
                                                    {
                                                        glucoseSummary.average
                                                            .note
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-orange-50">
                                            <CardContent className="p-4 text-center">
                                                <div className="flex items-center justify-center mb-2">
                                                    <TrendingUp className="w-5 h-5 mr-1 text-orange-600" />
                                                    <span className="text-sm font-medium text-orange-900">
                                                        Highest Reading
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-bold text-orange-600">
                                                    {
                                                        glucoseSummary.highest
                                                            .value
                                                    }{" "}
                                                    mg/dL
                                                </div>
                                                <div className="text-xs text-orange-700">
                                                    {
                                                        glucoseSummary.highest
                                                            .time
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            ) : (
                                <div className="py-8 text-center">
                                    <div className="mb-4 text-gray-400">
                                        <svg
                                            className="w-16 h-16 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="mb-4 text-gray-500">
                                        No glucose readings for today
                                    </p>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700"
                                        asChild
                                    >
                                        <a href={route("glycemia.index")}>
                                            Add Your First Reading
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Daily Goals */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-blue-600">🎯</span>
                                    <CardTitle>Daily Goals</CardTitle>
                                </div>
                                <Button
                                    variant="link"
                                    className="text-sm text-blue-600"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit Goals
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {dailyGoals.map((goal) => (
                                <div key={goal.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                                {goal.id ===
                                                    "glucose_range" && (
                                                    <span className="text-blue-600">
                                                        🩸
                                                    </span>
                                                )}
                                                {goal.id === "daily_steps" && (
                                                    <span className="text-purple-600">
                                                        🚶
                                                    </span>
                                                )}
                                                {goal.id ===
                                                    "carb_tracking" && (
                                                    <span className="text-green-600">
                                                        🌾
                                                    </span>
                                                )}
                                                {goal.id ===
                                                    "weekly_activity" && (
                                                    <span className="text-orange-600">
                                                        🏃
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {goal.title}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Target: {goal.target}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`text-sm font-medium ${goal.statusColor}`}
                                            >
                                                {goal.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1">
                                            <Progress
                                                value={goal.progress}
                                                className="h-2"
                                            />
                                        </div>
                                        <span className="flex-shrink-0 min-w-0 text-sm text-gray-600">
                                            {goal.progress}%
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {goal.description}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Motivational Message */}
                    {insights && insights.length > 0 && (
                        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
                                        <span className="text-2xl">⭐</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-blue-900">
                                            You're doing great,{" "}
                                            {auth.user.name.split(" ")[0]}!
                                        </h3>
                                        <div className="mt-1 text-sm text-blue-700">
                                            {insights.map((insight, index) => (
                                                <p
                                                    key={index}
                                                    className={
                                                        index > 0 ? "mt-1" : ""
                                                    }
                                                >
                                                    {insight}
                                                </p>
                                            ))}
                                        </div>
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 mt-2 text-sm text-blue-600"
                                        >
                                            View Insights
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Entries */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-blue-600">📝</span>
                                    <CardTitle>Recent Entries</CardTitle>
                                </div>
                                <Button
                                    variant="link"
                                    className="text-sm text-blue-600"
                                >
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentEntries && recentEntries.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left border-b">
                                                <th className="py-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    TIME
                                                </th>
                                                <th className="py-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    TYPE
                                                </th>
                                                <th className="py-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    VALUE
                                                </th>
                                                <th className="py-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    NOTES
                                                </th>
                                                <th className="py-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    ACTIONS
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {recentEntries.map((entry) => (
                                                <tr
                                                    key={entry.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="py-3 text-sm text-gray-900">
                                                        {entry.time}
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge
                                                            className={
                                                                entry.typeColor
                                                            }
                                                        >
                                                            {entry.icon}{" "}
                                                            {entry.type}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-sm text-gray-900">
                                                        {entry.value}
                                                    </td>
                                                    <td className="py-3 text-sm text-gray-600">
                                                        {entry.notes}
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex space-x-2">
                                                            <button className="text-blue-600 hover:text-blue-800">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-800"
                                                                onClick={() => {
                                                                    const entryType =
                                                                        entry.id.split(
                                                                            "_"
                                                                        )[0];
                                                                    const entryId =
                                                                        entry.id.split(
                                                                            "_"
                                                                        )[1];
                                                                    deleteEntry(
                                                                        entryType,
                                                                        entryId
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <div className="mb-4 text-gray-400">
                                        <svg
                                            className="w-16 h-16 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="mb-4 text-gray-500">
                                        No entries recorded today
                                    </p>
                                    <div className="flex justify-center space-x-4">
                                        <Button variant="outline" asChild>
                                            <a href={route("glycemia.index")}>
                                                Add Glucose Reading
                                            </a>
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <a href={route("nutrition.index")}>
                                                Log Meal
                                            </a>
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <a href={route("activity.index")}>
                                                Record Activity
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
