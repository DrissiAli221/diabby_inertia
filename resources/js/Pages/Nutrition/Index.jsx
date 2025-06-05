"use client";

import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Trash2,
    AlertTriangle,
    Info,
} from "lucide-react";
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
    date,
    meals,
    dailyTotals,
    glycemiaReadings,
    recipeSuggestions,
    nutritionalTips,
    mealTypes,
}) {
    const [showAddMealForm, setShowAddMealForm] = useState(false);
    const [showAddItemForm, setShowAddItemForm] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);

    const {
        data: mealData,
        setData: setMealData,
        post: postMeal,
        processing: processingMeal,
        errors: mealErrors,
        reset: resetMeal,
    } = useForm({
        meal_type: "",
        eaten_at: "",
    });

    const {
        data: itemData,
        setData: setItemData,
        post: postItem,
        processing: processingItem,
        errors: itemErrors,
        reset: resetItem,
    } = useForm({
        name: "",
        calories: "",
        carbs: "",
        fat: "",
        protein: "",
        portion_description: "",
    });

    const handleAddMeal = (e) => {
        e.preventDefault();
        postMeal(route("meals.store"), {
            onSuccess: () => {
                resetMeal();
                setShowAddMealForm(false);
            },
        });
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (selectedMeal) {
            postItem(route("meal-items.store", selectedMeal.id), {
                onSuccess: () => {
                    resetItem();
                    setShowAddItemForm(false);
                    setSelectedMeal(null);
                },
            });
        }
    };

    const deleteMeal = (mealId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce repas ?")) {
            router.delete(route("meals.destroy", mealId));
        }
    };

    const navigateDate = (direction) => {
        const newDate = direction === "prev" ? date.previous : date.next;
        router.get(route("nutrition.index", { date: newDate }));
    };

    const openAddItemForm = (meal) => {
        setSelectedMeal(meal);
        setShowAddItemForm(true);
    };

    const getMealIcon = (mealType) => {
        const icons = {
            breakfast: "🍳",
            lunch: "🍽️",
            dinner: "🌙",
            snack: "🍎",
        };
        return icons[mealType] || "🍴";
    };

    const getMealBackgroundClass = (mealType) => {
        const classes = {
            breakfast: "bg-blue-50",
            lunch: "bg-orange-50",
            dinner: "bg-purple-50",
            snack: "bg-green-50",
        };
        return classes[mealType] || "bg-gray-50";
    };

    const getMealTextClass = (mealType) => {
        const classes = {
            breakfast: "text-blue-900",
            lunch: "text-orange-900",
            dinner: "text-purple-900",
            snack: "text-green-900",
        };
        return classes[mealType] || "text-gray-900";
    };

    const getMealButtonClass = (mealType) => {
        const classes = {
            breakfast: "text-blue-600",
            lunch: "text-orange-600",
            dinner: "text-purple-600",
            snack: "text-green-600",
        };
        return classes[mealType] || "text-gray-600";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Suivi nutritionnel
                    </h2>
                    <Dialog
                        open={showAddMealForm}
                        onOpenChange={setShowAddMealForm}
                    >
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter un repas
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nouveau repas</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleAddMeal}
                                className="space-y-4"
                            >
                                <div>
                                    <Label htmlFor="meal_type">
                                        Type de repas
                                    </Label>
                                    <Select
                                        value={mealData.meal_type}
                                        onValueChange={(value) => {
                                            setMealData("meal_type", value);
                                            const selectedType = mealTypes.find(
                                                (type) => type.value === value
                                            );
                                            if (selectedType) {
                                                const today = new Date()
                                                    .toISOString()
                                                    .split("T")[0];
                                                setMealData(
                                                    "eaten_at",
                                                    `${today}T${selectedType.default_time}`
                                                );
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un type de repas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mealTypes?.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.icon} {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {mealErrors.meal_type && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {mealErrors.meal_type}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="eaten_at">
                                        Date et heure
                                    </Label>
                                    <Input
                                        id="eaten_at"
                                        type="datetime-local"
                                        value={mealData.eaten_at}
                                        onChange={(e) =>
                                            setMealData(
                                                "eaten_at",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            mealErrors.eaten_at
                                                ? "border-red-500"
                                                : ""
                                        }
                                        required
                                    />
                                    {mealErrors.eaten_at && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {mealErrors.eaten_at}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setShowAddMealForm(false)
                                        }
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processingMeal}
                                    >
                                        {processingMeal
                                            ? "Création..."
                                            : "Créer"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            }
        >
            <Head title="Suivi nutritionnel" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content - Left Side */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Date Navigation */}
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigateDate("prev")}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <div className="text-center">
                                    <h3 className="text-lg font-medium">
                                        {date?.formatted}
                                    </h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigateDate("next")}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Daily Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Résumé de la journée</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full">
                                                <span className="font-bold text-blue-600">
                                                    🔥
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold">
                                                {Math.round(
                                                    dailyTotals.calories
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Calories
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full">
                                                <span className="font-bold text-green-600">
                                                    🌾
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold">
                                                {Math.round(dailyTotals.carbs)}g
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Glucides
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-full">
                                                <span className="font-bold text-orange-600">
                                                    🥩
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold">
                                                {Math.round(
                                                    dailyTotals.protein
                                                )}
                                                g
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Protéines
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-red-100 rounded-full">
                                                <span className="font-bold text-red-600">
                                                    🥑
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold">
                                                {Math.round(dailyTotals.fat)}g
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Lipides
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Meals */}
                            {meals.map((meal) => (
                                <Card key={meal.id}>
                                    <CardHeader
                                        className={getMealBackgroundClass(
                                            meal.meal_type
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span>
                                                    {getMealIcon(
                                                        meal.meal_type
                                                    )}
                                                </span>
                                                <CardTitle
                                                    className={getMealTextClass(
                                                        meal.meal_type
                                                    )}
                                                >
                                                    {meal.meal_type_french}
                                                </CardTitle>
                                                <span
                                                    className={`text-sm ${getMealTextClass(
                                                        meal.meal_type
                                                    )}`}
                                                >
                                                    {meal.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium">
                                                    {Math.round(
                                                        meal.total_calories
                                                    )}{" "}
                                                    calories
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteMeal(meal.id)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="space-y-3">
                                            {meal.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className={`w-2 h-2 bg-${item.category_color}-500 rounded-full`}
                                                        ></div>
                                                        <div>
                                                            <span className="font-medium">
                                                                {item.name}
                                                            </span>
                                                            <div className="text-sm text-gray-600">
                                                                {
                                                                    item.portion_description
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">
                                                            {Math.round(
                                                                item.calories
                                                            )}{" "}
                                                            cal
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {Math.round(
                                                                item.carbs
                                                            )}
                                                            g glucides
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            variant="link"
                                            className={`mt-3 p-0 h-auto ${getMealButtonClass(
                                                meal.meal_type
                                            )}`}
                                            onClick={() =>
                                                openAddItemForm(meal)
                                            }
                                        >
                                            + Ajouter un aliment
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Add Meal Button */}
                            {meals.length === 0 && (
                                <div className="py-8 text-center">
                                    <p className="mb-4 text-gray-500">
                                        Aucun repas enregistré pour cette
                                        journée
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                        onClick={() => setShowAddMealForm(true)}
                                    >
                                        + Ajouter votre premier repas
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Glucose Readings */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Glycémie du jour</CardTitle>
                                        <Button
                                            variant="link"
                                            className="text-sm text-blue-600"
                                            asChild
                                        >
                                            <a href={route("glycemia.index")}>
                                                Voir l'historique
                                            </a>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {glycemiaReadings?.length > 0 ? (
                                        glycemiaReadings.map((reading) => (
                                            <div
                                                key={reading.id}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {reading.context}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {reading.time}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-blue-600">
                                                        {
                                                            reading.value_mg_dl_with_unit
                                                        }
                                                    </div>
                                                    <div
                                                        className={`text-sm ${reading.status_class}`}
                                                    >
                                                        {reading.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Aucune mesure pour aujourd'hui
                                        </p>
                                    )}
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        asChild
                                    >
                                        <a href={route("glycemia.index")}>
                                            + Ajouter une mesure
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Recipe Suggestions */}
                            {recipeSuggestions?.map((recipe) => (
                                <Card key={recipe.id}>
                                    <CardHeader>
                                        <CardTitle>
                                            Idée de repas équilibré
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex space-x-3">
                                                <img
                                                    src={
                                                        recipe.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={recipe.name}
                                                    className="object-cover rounded-lg w-15 h-15"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium">
                                                        {recipe.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {recipe.description}
                                                    </p>
                                                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                                                        <span>
                                                            ⏱️{" "}
                                                            {
                                                                recipe.preparation_time
                                                            }{" "}
                                                            min
                                                        </span>
                                                        <span>
                                                            🔥 {recipe.calories}{" "}
                                                            cal
                                                        </span>
                                                        <span>
                                                            📊 IG{" "}
                                                            {
                                                                recipe.glycemic_index
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="link"
                                                className="p-0 text-sm text-blue-600"
                                            >
                                                Voir la recette
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Nutritional Tips */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Conseils nutritionnels
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {nutritionalTips?.map((tip) => (
                                            <div
                                                key={tip.id}
                                                className="flex items-start space-x-3"
                                            >
                                                <div
                                                    className={`w-6 h-6 bg-${tip.color}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                                                >
                                                    {tip.icon === "warning" && (
                                                        <AlertTriangle
                                                            className={`w-3 h-3 text-${tip.color}-600`}
                                                        />
                                                    )}
                                                    {tip.icon === "check" && (
                                                        <span
                                                            className={`text-${tip.color}-600 text-xs`}
                                                        >
                                                            ✓
                                                        </span>
                                                    )}
                                                    {tip.icon === "info" && (
                                                        <Info
                                                            className={`w-3 h-3 text-${tip.color}-600`}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {tip.title}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {tip.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Item Dialog */}
            <Dialog open={showAddItemForm} onOpenChange={setShowAddItemForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Ajouter un aliment -{" "}
                            {selectedMeal?.meal_type_french}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nom de l'aliment</Label>
                            <Input
                                id="name"
                                value={itemData.name}
                                onChange={(e) =>
                                    setItemData("name", e.target.value)
                                }
                                className={
                                    itemErrors.name ? "border-red-500" : ""
                                }
                                required
                            />
                            {itemErrors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {itemErrors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="calories">Calories</Label>
                                <Input
                                    id="calories"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={itemData.calories}
                                    onChange={(e) =>
                                        setItemData("calories", e.target.value)
                                    }
                                    className={
                                        itemErrors.calories
                                            ? "border-red-500"
                                            : ""
                                    }
                                    required
                                />
                                {itemErrors.calories && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {itemErrors.calories}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="carbs">Glucides (g)</Label>
                                <Input
                                    id="carbs"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={itemData.carbs}
                                    onChange={(e) =>
                                        setItemData("carbs", e.target.value)
                                    }
                                    className={
                                        itemErrors.carbs ? "border-red-500" : ""
                                    }
                                    required
                                />
                                {itemErrors.carbs && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {itemErrors.carbs}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="protein">Protéines (g)</Label>
                                <Input
                                    id="protein"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={itemData.protein}
                                    onChange={(e) =>
                                        setItemData("protein", e.target.value)
                                    }
                                    className={
                                        itemErrors.protein
                                            ? "border-red-500"
                                            : ""
                                    }
                                    required
                                />
                                {itemErrors.protein && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {itemErrors.protein}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="fat">Lipides (g)</Label>
                                <Input
                                    id="fat"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={itemData.fat}
                                    onChange={(e) =>
                                        setItemData("fat", e.target.value)
                                    }
                                    className={
                                        itemErrors.fat ? "border-red-500" : ""
                                    }
                                    required
                                />
                                {itemErrors.fat && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {itemErrors.fat}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="portion_description">
                                Description de la portion
                            </Label>
                            <Input
                                id="portion_description"
                                value={itemData.portion_description}
                                onChange={(e) =>
                                    setItemData(
                                        "portion_description",
                                        e.target.value
                                    )
                                }
                                placeholder="ex: 1 tranche (30g)"
                                className={
                                    itemErrors.portion_description
                                        ? "border-red-500"
                                        : ""
                                }
                            />
                            {itemErrors.portion_description && (
                                <p className="mt-1 text-sm text-red-500">
                                    {itemErrors.portion_description}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAddItemForm(false)}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={processingItem}>
                                {processingItem ? "Ajout..." : "Ajouter"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
