"use client";

import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui Progress
import {
    Plus,
    Target,
    TrendingUp,
    Heart,
    Trash2,
    Zap,
    Trophy,
    Smile,
    Weight,
    Activity as ActivityIcon,
    Link as LinkIcon,
    Edit3,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Index({
    auth,
    activities,
    weeklyProgress,
    activityDistribution,
    healthBenefits,
    recommendations,
    todayGlycemia,
    activityTypes,
}) {
    const [showAddForm, setShowAddForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        activity_type: "",
        duration_minutes: "",
        intensity: "",
        activity_date: new Date().toISOString().slice(0, 16),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("activity.store"), {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            },
        });
    };

    const deleteActivity = (activityId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
            router.delete(route("activity.destroy", activityId), {
                preserveScroll: true,
            });
        }
    };

    // Original getIntensityColor, adapted for Badge variant
    const getIntensityBadgeVariant = (intensity) => {
        switch (intensity) {
            case "low":
                return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-700/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600";
            case "moderate":
                return "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-700/30 dark:text-amber-300 border-amber-300 dark:border-amber-600";
            case "high":
                return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-600";
            default:
                return "bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600";
        }
    };

    const getBenefitStyling = (type, level) => {
        const icons = {
            glycemia_stability: <ActivityIcon className="w-5 h-5" />,
            weight_management: <Weight className="w-5 h-5" />,
            mood: <Smile className="w-5 h-5" />,
            default: <Trophy className="w-5 h-5" />,
        };
        const colors = {
            excellent: "text-emerald-600 dark:text-emerald-400",
            good: "text-amber-600 dark:text-amber-400",
            fair: "text-red-600 dark:text-red-400",
            default: "text-slate-600 dark:text-slate-400",
        };
        const progressColors = {
            // For shadcn/ui Progress custom color
            excellent: "bg-emerald-500",
            good: "bg-amber-500",
            fair: "bg-red-500",
            default: "bg-slate-500",
        };

        return {
            icon: icons[type] || icons.default,
            textColor: colors[level] || colors.default,
            progressColorClass: progressColors[level] || progressColors.default, // class for the progress bar indicator
        };
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 shadow-sm bg-emerald-100 dark:bg-emerald-800/30 rounded-xl">
                            <Zap className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold leading-tight text-slate-800 dark:text-slate-100">
                                Activité Physique
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Suivez vos progrès et restez en forme.
                            </p>
                        </div>
                    </div>
                    <Dialog
                        open={showAddForm}
                        onOpenChange={(isOpen) => {
                            setShowAddForm(isOpen);
                            if (!isOpen) reset();
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="text-white transition-all shadow-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 hover:shadow-lg">
                                <Plus className="w-5 h-5 mr-2" />
                                Ajouter une activité
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800">
                            <DialogHeader>
                                <DialogTitle className="text-slate-900 dark:text-slate-100">
                                    Nouvelle activité
                                </DialogTitle>
                                <DialogDescription className="text-slate-600 dark:text-slate-400">
                                    Enregistrez une nouvelle session d'activité
                                    physique.
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={handleSubmit}
                                className="py-4 space-y-6"
                            >
                                <div>
                                    <Label
                                        htmlFor="activity_type"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
                                        Type d'activité
                                    </Label>
                                    <Select
                                        value={data.activity_type}
                                        onValueChange={(value) =>
                                            setData("activity_type", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-emerald-500 focus:border-emerald-500">
                                            <SelectValue placeholder="Sélectionnez une activité" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-slate-700 dark:text-white">
                                            {activityTypes?.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                    className="dark:hover:bg-slate-600"
                                                >
                                                    {type.icon} {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.activity_type && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.activity_type}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="duration_minutes"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
                                        Durée (minutes)
                                    </Label>
                                    <Input
                                        id="duration_minutes"
                                        type="number"
                                        min="1"
                                        max="600"
                                        value={data.duration_minutes}
                                        onChange={(e) =>
                                            setData(
                                                "duration_minutes",
                                                e.target.value
                                            )
                                        }
                                        className={`mt-1 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                            errors.duration_minutes
                                                ? "border-red-500"
                                                : "border-slate-300"
                                        }`}
                                        required
                                    />
                                    {errors.duration_minutes && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.duration_minutes}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="intensity"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
                                        Intensité
                                    </Label>
                                    <Select
                                        value={data.intensity}
                                        onValueChange={(value) =>
                                            setData("intensity", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-emerald-500 focus:border-emerald-500">
                                            <SelectValue placeholder="Sélectionnez l'intensité" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-slate-700 dark:text-white">
                                            <SelectItem
                                                value="low"
                                                className="dark:hover:bg-slate-600"
                                            >
                                                🟢 Intensité légère
                                            </SelectItem>
                                            <SelectItem
                                                value="moderate"
                                                className="dark:hover:bg-slate-600"
                                            >
                                                🟡 Intensité modérée
                                            </SelectItem>
                                            <SelectItem
                                                value="high"
                                                className="dark:hover:bg-slate-600"
                                            >
                                                🔴 Intensité élevée
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.intensity && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.intensity}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="activity_date"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
                                        Date et heure
                                    </Label>
                                    <Input
                                        id="activity_date"
                                        type="datetime-local"
                                        value={data.activity_date}
                                        onChange={(e) =>
                                            setData(
                                                "activity_date",
                                                e.target.value
                                            )
                                        }
                                        className={`mt-1 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                            errors.activity_date
                                                ? "border-red-500"
                                                : "border-slate-300"
                                        }`}
                                        required
                                    />
                                    {errors.activity_date && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.activity_date}
                                        </p>
                                    )}
                                </div>
                                <DialogFooter className="pt-2 space-y-2 sm:justify-end sm:space-y-0 sm:space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddForm(false)}
                                        className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                                    >
                                        {processing
                                            ? "Enregistrement..."
                                            : "Enregistrer"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            }
        >
            <Head title="Activité physique" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content - Left Side */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Weekly Progress */}
                            <Card className="shadow-lg dark:bg-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        Progression Hebdomadaire
                                    </CardTitle>
                                    <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                        Votre objectif d'activité pour la
                                        semaine.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                                        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                                            {" "}
                                            {/* Slightly larger */}
                                            <svg
                                                className="w-full h-full transform -rotate-90"
                                                viewBox="0 0 100 100"
                                            >
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="42"
                                                    stroke="currentColor"
                                                    strokeWidth="10"
                                                    fill="transparent"
                                                    className="text-slate-200 dark:text-slate-700"
                                                />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="42"
                                                    stroke="currentColor"
                                                    strokeWidth="10"
                                                    fill="transparent"
                                                    strokeDasharray={`${
                                                        2 * Math.PI * 42
                                                    }`}
                                                    strokeDashoffset={`${
                                                        2 *
                                                        Math.PI *
                                                        42 *
                                                        (1 -
                                                            (weeklyProgress?.percentage ||
                                                                0) /
                                                                100)
                                                    }`}
                                                    className="text-emerald-500 dark:text-emerald-400"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    {weeklyProgress?.percentage ||
                                                        0}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Objectif:{" "}
                                                    {weeklyProgress?.goal || 0}{" "}
                                                    min
                                                </span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Réalisé:{" "}
                                                    {weeklyProgress?.achieved ||
                                                        0}{" "}
                                                    min
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    weeklyProgress?.percentage ||
                                                    0
                                                }
                                                className="h-2.5 [&>*]:bg-emerald-500 dark:[&>*]:bg-emerald-400"
                                            />{" "}
                                            {/* shadcn progress color */}
                                            <p
                                                className={`mt-2.5 text-xs ${
                                                    (weeklyProgress?.remaining ||
                                                        0) > 0
                                                        ? "text-amber-600 dark:text-amber-400"
                                                        : "text-emerald-600 dark:text-emerald-400"
                                                }`}
                                            >
                                                {(weeklyProgress?.remaining ||
                                                    0) > 0
                                                    ? `Plus que ${weeklyProgress.remaining} minutes pour atteindre votre objectif !`
                                                    : "Objectif atteint, bravo ! 💪"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Activity Types Distribution */}
                            <Card className="shadow-lg dark:bg-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        Répartition des Activités
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {activityDistribution &&
                                    activityDistribution.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                            {activityDistribution.map(
                                                (activity) => (
                                                    <div
                                                        key={activity.type}
                                                        className="flex flex-col items-center p-4 text-center rounded-lg bg-slate-50 dark:bg-slate-700/50"
                                                    >
                                                        <div className="flex items-center justify-center mx-auto mb-2 rounded-full w-14 h-14 bg-sky-100 dark:bg-sky-500/20">
                                                            <span className="text-2xl">
                                                                {activity.icon}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                            {
                                                                activity.type_french
                                                            }
                                                        </div>
                                                        <div className="text-xl font-bold text-sky-600 dark:text-sky-400">
                                                            {
                                                                activity.percentage
                                                            }
                                                            %
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                            {activity.minutes}{" "}
                                                            min
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="py-4 text-sm text-center text-slate-500 dark:text-slate-400">
                                            Aucune donnée de répartition
                                            disponible.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Activity Journal */}
                            <Card className="shadow-lg dark:bg-slate-800">
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                            Journal d'Activité
                                        </CardTitle>
                                        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                            Vos sessions récentes.
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                    >
                                        <LinkIcon className="w-3.5 h-3.5 mr-2" />{" "}
                                        Connecter Appareil
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {activities && activities.length > 0 ? (
                                        activities.slice(0, 3).map(
                                            (
                                                activity // Show first 3, add pagination if needed
                                            ) => (
                                                <div
                                                    key={activity.id}
                                                    className="flex flex-col items-start justify-between p-4 transition-shadow rounded-lg sm:flex-row sm:items-center bg-slate-50 dark:bg-slate-700/50 hover:shadow-md"
                                                >
                                                    <div className="flex items-center mb-3 space-x-4 sm:mb-0">
                                                        <div className="flex items-center justify-center w-12 h-12 text-xl rounded-full bg-sky-100 dark:bg-sky-800/50 text-sky-600 dark:text-sky-400">
                                                            {
                                                                activity.activity_icon
                                                            }
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                                                                {
                                                                    activity.activity_type_french
                                                                }
                                                            </div>
                                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                {
                                                                    activity.formatted_duration
                                                                }{" "}
                                                                •{" "}
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`${getIntensityBadgeVariant(
                                                                        activity.intensity
                                                                    )} px-1.5 py-0.5 text-xs`}
                                                                >
                                                                    {
                                                                        activity.intensity_french
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center mt-1.5 space-x-3">
                                                                <span className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                                                                    <Zap className="w-3.5 h-3.5 mr-1" />{" "}
                                                                    {
                                                                        activity.formatted_calories
                                                                    }
                                                                </span>
                                                                {todayGlycemia &&
                                                                    activity.estimated_glycemia_impact && (
                                                                        <span className="flex items-center text-sm text-sky-600 dark:text-sky-400">
                                                                            <ActivityIcon className="w-3.5 h-3.5 mr-1" />{" "}
                                                                            Δ{" "}
                                                                            {
                                                                                activity.estimated_glycemia_impact
                                                                            }{" "}
                                                                            mmol/L
                                                                        </span>
                                                                    )}
                                                            </div>
                                                            {activity.motivational_message && (
                                                                <p className="mt-1.5 text-xs italic text-slate-500 dark:text-slate-400">
                                                                    "
                                                                    {
                                                                        activity.motivational_message
                                                                    }
                                                                    "
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center self-start pt-2 space-x-2 sm:self-center sm:pt-0">
                                                        <div className="text-right">
                                                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                                {activity.date}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                {activity.time}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                deleteActivity(
                                                                    activity.id
                                                                )
                                                            }
                                                            className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="py-10 text-center">
                                            <Zap className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                                            <p className="mb-3 text-slate-600 dark:text-slate-400">
                                                Aucune activité enregistrée pour
                                                le moment.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="text-emerald-600 border-emerald-500 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500 dark:hover:bg-emerald-900/50"
                                                onClick={() =>
                                                    setShowAddForm(true)
                                                }
                                            >
                                                <Plus className="w-4 h-4 mr-2" />{" "}
                                                Ajouter votre première activité
                                            </Button>
                                        </div>
                                    )}
                                    {activities && activities.length > 3 && (
                                        <div className="pt-2 text-center">
                                            <Button
                                                variant="link"
                                                className="text-indigo-600 dark:text-indigo-400"
                                            >
                                                Voir toutes les activités
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Health Benefits */}
                            <Card className="shadow-lg dark:bg-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        Bénéfices pour la Santé
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {healthBenefits &&
                                        Object.entries(healthBenefits).map(
                                            ([key, benefit]) => {
                                                const styling =
                                                    getBenefitStyling(
                                                        key,
                                                        benefit.level
                                                    );
                                                return (
                                                    <div key={key}>
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <div
                                                                className={`flex items-center space-x-2 text-sm font-medium ${styling.textColor}`}
                                                            >
                                                                {styling.icon}
                                                                <span>
                                                                    {
                                                                        benefit.description
                                                                    }
                                                                </span>
                                                            </div>
                                                            <span
                                                                className={`text-xs font-semibold uppercase ${styling.textColor}`}
                                                            >
                                                                {benefit.level ===
                                                                "excellent"
                                                                    ? "Excellent"
                                                                    : benefit.level ===
                                                                      "good"
                                                                    ? "Bien"
                                                                    : "À Améliorer"}
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={
                                                                benefit.progress
                                                            }
                                                            className={`h-2 [&>*]:${styling.progressColorClass}`}
                                                        />
                                                    </div>
                                                );
                                            }
                                        )}
                                    {(!healthBenefits ||
                                        Object.keys(healthBenefits).length ===
                                            0) && (
                                        <p className="py-3 text-sm text-center text-slate-500 dark:text-slate-400">
                                            Données sur les bénéfices bientôt
                                            disponibles.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Today's Glycemia */}
                            {todayGlycemia && (
                                <Card className="shadow-lg dark:bg-slate-800">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                            Glycémie du Jour
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-700/50">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                        Dernière mesure
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {todayGlycemia.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-sky-600 dark:text-sky-400">
                                                    {
                                                        todayGlycemia.formatted_value
                                                    }
                                                </div>
                                                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                    {todayGlycemia.status}
                                                </div>{" "}
                                                {/* Assuming status is generally positive here */}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className="w-full text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
                                            asChild
                                        >
                                            <a href={route("glycemia.index")}>
                                                <Plus className="w-4 h-4 mr-2" />{" "}
                                                Ajouter une mesure
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}

                            {/* Personalized Recommendations */}
                            <Card className="shadow-lg dark:bg-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        Recommandations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {recommendations &&
                                    recommendations.length > 0 ? (
                                        recommendations.slice(0, 2).map(
                                            (
                                                rec,
                                                index // Show first 2
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="p-3.5 border border-indigo-200 dark:border-indigo-700/50 rounded-lg bg-indigo-50 dark:bg-indigo-900/30"
                                                >
                                                    <div className="flex items-start space-x-2.5">
                                                        <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 text-lg">
                                                            {rec.icon}
                                                        </span>
                                                        <div>
                                                            <span className="block text-sm font-semibold text-indigo-800 dark:text-indigo-200">
                                                                {rec.title}
                                                            </span>
                                                            <p className="text-xs leading-relaxed text-indigo-700 dark:text-indigo-300">
                                                                {
                                                                    rec.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="py-3 text-sm text-center text-slate-500 dark:text-slate-400">
                                            Aucune recommandation pour le
                                            moment.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions Links */}
                            <div className="space-y-3">
                                {[
                                    {
                                        title: "Définir Objectifs",
                                        desc: "Personnalisez vos cibles d'activité.",
                                        icon: Target,
                                        color: "emerald",
                                        href: "#",
                                    },
                                    {
                                        title: "Voir Statistiques",
                                        desc: "Analysez vos performances détaillées.",
                                        icon: TrendingUp,
                                        color: "sky",
                                        href: "#",
                                    },
                                    {
                                        title: "Programmes Guidés",
                                        desc: "Découvrez des entraînements adaptés.",
                                        icon: Heart,
                                        color: "rose",
                                        href: "#",
                                    },
                                ].map((item) => (
                                    <Card
                                        key={item.title}
                                        className="transition-all duration-300 ease-in-out shadow-md cursor-pointer group hover:shadow-xl dark:bg-slate-800"
                                    >
                                        <a
                                            href={item.href}
                                            className="block p-4"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className={`flex items-center justify-center w-10 h-10 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-500/20 group-hover:bg-${item.color}-200 dark:group-hover:bg-${item.color}-500/30 transition-colors`}
                                                >
                                                    <item.icon
                                                        className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`}
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
