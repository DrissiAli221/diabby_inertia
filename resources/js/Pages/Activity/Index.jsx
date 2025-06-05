"use client";

import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, TrendingUp, Heart, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
            router.delete(route("activity.destroy", activityId));
        }
    };

    const getIntensityColor = (intensity) => {
        switch (intensity) {
            case "low":
                return "bg-green-100 text-green-800";
            case "moderate":
                return "bg-orange-100 text-orange-800";
            case "high":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getBenefitIcon = (type) => {
        switch (type) {
            case "glycemia_stability":
                return "🩸";
            case "weight_management":
                return "⚖️";
            case "mood":
                return "😊";
            default:
                return "💪";
        }
    };

    const getBenefitColor = (level) => {
        switch (level) {
            case "excellent":
                return "text-green-600";
            case "good":
                return "text-orange-600";
            case "fair":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Activité physique
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Suivez vos progrès et restez en forme
                        </p>
                    </div>
                    <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter une activité
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nouvelle activité</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="activity_type">
                                        Type d'activité
                                    </Label>
                                    <Select
                                        value={data.activity_type}
                                        onValueChange={(value) =>
                                            setData("activity_type", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez une activité" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activityTypes.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.icon} {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.activity_type && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.activity_type}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="duration_minutes">
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
                                        className={
                                            errors.duration_minutes
                                                ? "border-red-500"
                                                : ""
                                        }
                                        required
                                    />
                                    {errors.duration_minutes && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.duration_minutes}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="intensity">Intensité</Label>
                                    <Select
                                        value={data.intensity}
                                        onValueChange={(value) =>
                                            setData("intensity", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez l'intensité" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                🟢 Intensité légère
                                            </SelectItem>
                                            <SelectItem value="moderate">
                                                🟡 Intensité modérée
                                            </SelectItem>
                                            <SelectItem value="high">
                                                🔴 Intensité élevée
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.intensity && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.intensity}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="activity_date">
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
                                        className={
                                            errors.activity_date
                                                ? "border-red-500"
                                                : ""
                                        }
                                        required
                                    />
                                    {errors.activity_date && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.activity_date}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? "Enregistrement..."
                                            : "Enregistrer"}
                                    </Button>
                                </div>
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Progression hebdomadaire
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-6">
                                        <div className="relative w-24 h-24">
                                            <svg
                                                className="w-24 h-24 transform -rotate-90"
                                                viewBox="0 0 100 100"
                                            >
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="transparent"
                                                    className="text-gray-200"
                                                />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="transparent"
                                                    strokeDasharray={`${
                                                        2 * Math.PI * 40
                                                    }`}
                                                    strokeDashoffset={`${
                                                        2 *
                                                        Math.PI *
                                                        40 *
                                                        (1 -
                                                            weeklyProgress.percentage /
                                                                100)
                                                    }`}
                                                    className="text-green-500"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-green-600">
                                                    {weeklyProgress.percentage}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">
                                                    Objectif:{" "}
                                                    {weeklyProgress.goal} min
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    Réalisé:{" "}
                                                    {weeklyProgress.achieved}{" "}
                                                    min
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    weeklyProgress.percentage
                                                }
                                                className="h-2"
                                            />
                                            <p className="mt-2 text-xs text-green-600">
                                                {weeklyProgress.remaining > 0
                                                    ? `Plus que ${weeklyProgress.remaining} minutes pour atteindre votre objectif !`
                                                    : "En bonne voie ! 💪"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Activity Types Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Types d'activités</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        {activityDistribution.map(
                                            (activity, index) => (
                                                <div
                                                    key={activity.type}
                                                    className="text-center"
                                                >
                                                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-full">
                                                        <span className="text-2xl">
                                                            {activity.icon}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm font-medium">
                                                        {activity.type_french}
                                                    </div>
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {activity.percentage}%
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {activity.minutes} min
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Activity Journal */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>
                                            Journal d'activité
                                        </CardTitle>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">
                                                Connecter ma montre
                                            </span>
                                            <div className="relative w-8 h-4 bg-gray-200 rounded-full">
                                                <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full shadow"></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {activities.length > 0 ? (
                                        activities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                                        <span className="text-xl">
                                                            {
                                                                activity.activity_icon
                                                            }
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {
                                                                activity.activity_type_french
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {
                                                                activity.formatted_duration
                                                            }{" "}
                                                            •{" "}
                                                            {
                                                                activity.intensity_french
                                                            }
                                                        </div>
                                                        <div className="flex items-center mt-1 space-x-4">
                                                            <span className="text-sm text-orange-600">
                                                                🔥{" "}
                                                                {
                                                                    activity.formatted_calories
                                                                }
                                                            </span>
                                                            {todayGlycemia && (
                                                                <span className="text-sm text-blue-600">
                                                                    🩸 Glycémie:
                                                                    -
                                                                    {
                                                                        activity.estimated_glycemia_impact
                                                                    }{" "}
                                                                    mmol/L
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-xs italic text-gray-500">
                                                            {
                                                                activity.motivational_message
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium">
                                                            {activity.date}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {activity.time}
                                                        </div>
                                                        <Badge
                                                            className={
                                                                activity.activity_color
                                                            }
                                                        >
                                                            {
                                                                activity.activity_type_french
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            deleteActivity(
                                                                activity.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center">
                                            <p className="mb-4 text-gray-500">
                                                Aucune activité enregistrée
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="text-green-600 border-green-600 hover:bg-green-50"
                                                onClick={() =>
                                                    setShowAddForm(true)
                                                }
                                            >
                                                + Ajouter votre première
                                                activité
                                            </Button>
                                        </div>
                                    )}
                                    {activities.length > 0 && (
                                        <div className="text-center">
                                            <Button
                                                variant="link"
                                                className="text-blue-600"
                                            >
                                                Voir plus d'activités
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Health Benefits */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Bénéfices santé</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {Object.entries(healthBenefits).map(
                                        ([key, benefit]) => (
                                            <div
                                                key={key}
                                                className="space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span>
                                                            {getBenefitIcon(
                                                                key
                                                            )}
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            {
                                                                benefit.description
                                                            }
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`text-sm font-medium ${getBenefitColor(
                                                            benefit.level
                                                        )}`}
                                                    >
                                                        {benefit.level ===
                                                        "excellent"
                                                            ? "Excellent"
                                                            : benefit.level ===
                                                              "good"
                                                            ? "Bien"
                                                            : "À améliorer"}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={benefit.progress}
                                                    className="h-2"
                                                />
                                            </div>
                                        )
                                    )}
                                </CardContent>
                            </Card>

                            {/* Today's Glycemia */}
                            {todayGlycemia && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Glycémie du jour</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <div>
                                                    <div className="font-medium">
                                                        Dernière mesure
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {todayGlycemia.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-blue-600">
                                                    {
                                                        todayGlycemia.formatted_value
                                                    }
                                                </div>
                                                <div className="text-sm text-green-600">
                                                    {todayGlycemia.status}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                                            asChild
                                        >
                                            <a href={route("glycemia.index")}>
                                                + Ajouter une mesure
                                            </a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Personalized Recommendations */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Recommandations personnalisées
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recommendations.map(
                                        (recommendation, index) => (
                                            <div
                                                key={index}
                                                className="p-3 border border-blue-200 rounded-lg bg-blue-50"
                                            >
                                                <div className="flex items-center mb-2 space-x-2">
                                                    <span>
                                                        {recommendation.icon}
                                                    </span>
                                                    <span className="font-medium text-blue-900">
                                                        {recommendation.title}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-blue-800">
                                                    {recommendation.description}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 gap-4">
                                <Card className="transition-shadow cursor-pointer hover:shadow-md">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                                <Target className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Objectifs
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Définissez vos objectifs
                                                    d'activité
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="transition-shadow cursor-pointer hover:shadow-md">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Statistiques
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Analysez vos performances
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="transition-shadow cursor-pointer hover:shadow-md">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                                                <Heart className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Programmes
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Programmes d'entraînement
                                                    adaptés
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
