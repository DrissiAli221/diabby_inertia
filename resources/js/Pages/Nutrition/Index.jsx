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
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Trash2,
    AlertTriangle,
    Info,
    Flame,
    Wheat,
    Beef,
    Drumstick, // For Protein
    Apple, // For Snack or generic food
    GlassWater, // Example for hydration tip
    CheckCircle2, // For positive tip
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
        if (
            confirm(
                "Êtes-vous sûr de vouloir supprimer ce repas et tous ses aliments ?"
            )
        ) {
            router.delete(route("meals.destroy", mealId), {
                preserveScroll: true,
            });
        }
    };

    const navigateDate = (direction) => {
        const newDate = direction === "prev" ? date.previous : date.next;
        router.get(
            route("nutrition.index", { date: newDate }),
            {},
            { preserveState: true }
        );
    };

    const openAddItemForm = (meal) => {
        setSelectedMeal(meal);
        setItemData({
            // Reset item form when opening for a new meal
            name: "",
            calories: "",
            carbs: "",
            fat: "",
            protein: "",
            portion_description: "",
        });
        setShowAddItemForm(true);
    };

    const getMealStyling = (mealType) => {
        const styles = {
            breakfast: {
                icon: "🍳",
                bg: "bg-sky-50 dark:bg-sky-900/30",
                text: "text-sky-800 dark:text-sky-300",
                border: "border-sky-500",
                button: "text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300",
                categoryDot: "bg-sky-500",
            },
            lunch: {
                icon: "🍽️",
                bg: "bg-amber-50 dark:bg-amber-900/30",
                text: "text-amber-800 dark:text-amber-300",
                border: "border-amber-500",
                button: "text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300",
                categoryDot: "bg-amber-500",
            },
            dinner: {
                icon: "🌙",
                bg: "bg-indigo-50 dark:bg-indigo-900/30",
                text: "text-indigo-800 dark:text-indigo-300",
                border: "border-indigo-500",
                button: "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300",
                categoryDot: "bg-indigo-500",
            },
            snack: {
                icon: "🍎",
                bg: "bg-emerald-50 dark:bg-emerald-900/30",
                text: "text-emerald-800 dark:text-emerald-300",
                border: "border-emerald-500",
                button: "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300",
                categoryDot: "bg-emerald-500",
            },
            default: {
                icon: "🍴",
                bg: "bg-slate-50 dark:bg-slate-700/30",
                text: "text-slate-800 dark:text-slate-300",
                border: "border-slate-500",
                button: "text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300",
                categoryDot: "bg-slate-500",
            },
        };
        return styles[mealType] || styles.default;
    };

    const nutrientIcons = {
        calories: {
            icon: <Flame className="w-5 h-5 text-red-500" />,
            bg: "bg-red-100 dark:bg-red-500/20",
            text: "text-red-700 dark:text-red-300",
        },
        carbs: {
            icon: <Wheat className="w-5 h-5 text-amber-500" />,
            bg: "bg-amber-100 dark:bg-amber-500/20",
            text: "text-amber-700 dark:text-amber-300",
        },
        protein: {
            icon: <Drumstick className="w-5 h-5 text-sky-500" />,
            bg: "bg-sky-100 dark:bg-sky-500/20",
            text: "text-sky-700 dark:text-sky-300",
        },
        fat: {
            icon: <Apple className="w-5 h-5 text-lime-500" />,
            bg: "bg-lime-100 dark:bg-lime-500/20",
            text: "text-lime-700 dark:text-lime-300",
        }, // Using Apple as a placeholder for healthy fats, could be more specific
    };

    const getTipIcon = (iconName, color) => {
        const iconClass = `w-4 h-4 text-${color}-600 dark:text-${color}-400`;
        if (iconName === "warning")
            return <AlertTriangle className={iconClass} />;
        if (iconName === "check") return <CheckCircle2 className={iconClass} />;
        if (iconName === "info") return <Info className={iconClass} />;
        if (iconName === "hydration")
            return <GlassWater className={iconClass} />;
        return <Info className={iconClass} />; // Default
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <h2 className="text-2xl font-semibold leading-tight text-slate-800 dark:text-slate-100">
                        Suivi Nutritionnel
                    </h2>
                    <Dialog
                        open={showAddMealForm}
                        onOpenChange={(isOpen) => {
                            setShowAddMealForm(isOpen);
                            if (!isOpen) resetMeal();
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="text-white transition-all bg-indigo-600 shadow-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 hover:shadow-lg">
                                <Plus className="w-5 h-5 mr-2" />
                                Ajouter un repas
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800">
                            <DialogHeader>
                                <DialogTitle className="text-slate-900 dark:text-slate-100">
                                    Nouveau repas
                                </DialogTitle>
                                <DialogDescription className="text-slate-600 dark:text-slate-400">
                                    Enregistrez un nouveau repas pour suivre
                                    votre nutrition.
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={handleAddMeal}
                                className="py-4 space-y-6"
                            >
                                <div>
                                    <Label
                                        htmlFor="meal_type"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
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
                                        <SelectTrigger className="w-full mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500">
                                            <SelectValue placeholder="Sélectionnez un type" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-slate-700 dark:text-white">
                                            {mealTypes?.map((type) => (
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
                                    {mealErrors.meal_type && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {mealErrors.meal_type}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="eaten_at"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
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
                                        className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                            mealErrors.eaten_at
                                                ? "border-red-500"
                                                : "border-slate-300"
                                        }`}
                                        required
                                    />
                                    {mealErrors.eaten_at && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {mealErrors.eaten_at}
                                        </p>
                                    )}
                                </div>
                                <DialogFooter className="pt-2 space-y-2 sm:justify-end sm:space-y-0 sm:space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setShowAddMealForm(false)
                                        }
                                        className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processingMeal}
                                        className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                    >
                                        {processingMeal
                                            ? "Création..."
                                            : "Créer le repas"}
                                    </Button>
                                </DialogFooter>
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
                            <Card className="shadow-md dark:bg-slate-800">
                                <CardContent className="flex items-center justify-between p-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => navigateDate("prev")}
                                        className="rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </Button>
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                                            {date?.formatted}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {date?.relative}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => navigateDate("next")}
                                        className="rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Daily Summary */}
                            <Card className="transition-shadow shadow-md hover:shadow-lg dark:bg-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        Résumé de la journée
                                    </CardTitle>
                                    <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                        Total des macronutriments consommés.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        {Object.entries(dailyTotals).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className={`p-3 rounded-lg flex flex-col items-center text-center ${
                                                        nutrientIcons[key]
                                                            ?.bg ||
                                                        "bg-slate-100 dark:bg-slate-700"
                                                    }`}
                                                >
                                                    <div className="mb-1">
                                                        {
                                                            nutrientIcons[key]
                                                                ?.icon
                                                        }
                                                    </div>
                                                    <div
                                                        className={`text-xl font-bold ${
                                                            nutrientIcons[key]
                                                                ?.text ||
                                                            "text-slate-800 dark:text-slate-100"
                                                        }`}
                                                    >
                                                        {Math.round(value)}
                                                        {key !== "calories"
                                                            ? "g"
                                                            : ""}
                                                    </div>
                                                    <div className="text-xs capitalize text-slate-600 dark:text-slate-400">
                                                        {key === "calories"
                                                            ? "Calories"
                                                            : key}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Meals */}
                            {meals.map((meal) => {
                                const mealStyle = getMealStyling(
                                    meal.meal_type
                                );
                                return (
                                    <Card
                                        key={meal.id}
                                        className={`shadow-md hover:shadow-lg transition-shadow dark:bg-slate-800 border-l-4 ${mealStyle.border}`}
                                    >
                                        <CardHeader
                                            className={`${mealStyle.bg} rounded-t-md p-4`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">
                                                        {mealStyle.icon}
                                                    </span>
                                                    <div>
                                                        <CardTitle
                                                            className={`text-lg font-semibold ${mealStyle.text}`}
                                                        >
                                                            {
                                                                meal.meal_type_french
                                                            }
                                                        </CardTitle>
                                                        <p
                                                            className={`text-sm ${mealStyle.text} opacity-80`}
                                                        >
                                                            {meal.time}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span
                                                        className={`text-sm font-semibold ${mealStyle.text}`}
                                                    >
                                                        {Math.round(
                                                            meal.total_calories
                                                        )}{" "}
                                                        cal
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            deleteMeal(meal.id)
                                                        }
                                                        className={`${mealStyle.text} hover:bg-black/10 dark:hover:bg-white/10 p-1.5 h-auto w-auto rounded-full`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-4 pt-4 pb-3">
                                            <div className="space-y-3">
                                                {meal.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-start justify-between pb-2 border-b border-slate-100 dark:border-slate-700 last:border-b-0 last:pb-0"
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            {/* Assuming item.category_color is a Tailwind color name like 'blue', 'green' etc. */}
                                                            <div
                                                                className={`mt-1.5 w-2.5 h-2.5 ${
                                                                    item.category_color
                                                                        ? `bg-${item.category_color}-500`
                                                                        : mealStyle.categoryDot
                                                                } rounded-full flex-shrink-0`}
                                                            ></div>
                                                            <div>
                                                                <span className="font-medium text-slate-700 dark:text-slate-200">
                                                                    {item.name}
                                                                </span>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {
                                                                        item.portion_description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0 ml-2 text-right">
                                                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                                {Math.round(
                                                                    item.calories
                                                                )}{" "}
                                                                cal
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                {Math.round(
                                                                    item.carbs
                                                                )}
                                                                g G /{" "}
                                                                {Math.round(
                                                                    item.protein
                                                                )}
                                                                g P /{" "}
                                                                {Math.round(
                                                                    item.fat
                                                                )}
                                                                g L
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="link"
                                                className={`mt-3 p-0 h-auto font-medium ${mealStyle.button}`}
                                                onClick={() =>
                                                    openAddItemForm(meal)
                                                }
                                            >
                                                <Plus className="w-4 h-4 mr-1" />{" "}
                                                Ajouter un aliment
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            {meals.length === 0 && (
                                <Card className="shadow-md dark:bg-slate-800">
                                    <CardContent className="py-10 text-center">
                                        <Apple className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                                        <p className="mb-3 text-slate-600 dark:text-slate-400">
                                            Aucun repas enregistré pour cette
                                            journée.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="text-indigo-600 border-indigo-500 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-500 dark:hover:bg-indigo-900/50"
                                            onClick={() =>
                                                setShowAddMealForm(true)
                                            }
                                        >
                                            <Plus className="w-4 h-4 mr-2" />{" "}
                                            Ajouter votre premier repas
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Glucose Readings */}
                            <Card className="transition-shadow shadow-md hover:shadow-lg dark:bg-slate-800">
                                <CardHeader className="flex flex-row items-center justify-between pb-3">
                                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        Glycémie du jour
                                    </CardTitle>
                                    <Button
                                        variant="link"
                                        className="h-auto px-0 text-sm text-indigo-600 dark:text-indigo-400"
                                        asChild
                                    >
                                        <a href={route("glycemia.index")}>
                                            Voir l'historique
                                        </a>
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {glycemiaReadings?.length > 0 ? (
                                        glycemiaReadings.map((reading) => (
                                            <div
                                                key={reading.id}
                                                className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-700/50"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${
                                                            reading.status_class?.includes(
                                                                "red"
                                                            )
                                                                ? "bg-red-500"
                                                                : reading.status_class?.includes(
                                                                      "orange"
                                                                  )
                                                                ? "bg-amber-500"
                                                                : reading.status_class?.includes(
                                                                      "green"
                                                                  )
                                                                ? "bg-green-500"
                                                                : "bg-sky-500"
                                                        }`}
                                                    ></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                            {reading.context}
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                            {reading.time}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-sky-600 dark:text-sky-400">
                                                        {reading.value_mg_dl_with_unit ||
                                                            `${reading.value} mmol/L`}
                                                    </div>
                                                    <div
                                                        className={`text-xs font-medium ${reading.status_class}`}
                                                    >
                                                        {reading.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-2 text-sm text-slate-500 dark:text-slate-400">
                                            Aucune mesure de glycémie pour
                                            aujourd'hui.
                                        </p>
                                    )}
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

                            {/* Recipe Suggestions */}
                            {recipeSuggestions?.slice(0, 1).map(
                                (
                                    recipe // Show only one suggestion for brevity
                                ) => (
                                    <Card
                                        key={recipe.id}
                                        className="transition-shadow shadow-md hover:shadow-lg dark:bg-slate-800"
                                    >
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                                💡 Idée Repas Équilibré
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-start space-x-4">
                                                    <img
                                                        src={
                                                            recipe.image ||
                                                            `https://source.unsplash.com/random/100x100/?healthy,food,${
                                                                recipe.name.split(
                                                                    " "
                                                                )[0]
                                                            }`
                                                        }
                                                        alt={recipe.name}
                                                        className="flex-shrink-0 object-cover w-20 h-20 border rounded-lg sm:w-24 sm:h-24 border-slate-200 dark:border-slate-700"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-md text-slate-700 dark:text-slate-200">
                                                            {recipe.name}
                                                        </h4>
                                                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                                                            {recipe.description}
                                                        </p>
                                                        <div className="flex flex-wrap items-center mt-2 text-xs gap-x-3 gap-y-1 text-slate-600 dark:text-slate-400">
                                                            <span>
                                                                ⏱️{" "}
                                                                {
                                                                    recipe.preparation_time
                                                                }{" "}
                                                                min
                                                            </span>
                                                            <span>
                                                                🔥{" "}
                                                                {
                                                                    recipe.calories
                                                                }{" "}
                                                                cal
                                                            </span>
                                                            <span>
                                                                📊 IG{" "}
                                                                {recipe.glycemic_index ||
                                                                    "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full mt-2 text-indigo-600 border-indigo-500 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-600 dark:hover:bg-indigo-900/50"
                                                >
                                                    Voir la recette
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            )}

                            {/* Nutritional Tips */}
                            <Card className="transition-shadow shadow-md hover:shadow-lg dark:bg-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        Conseils Nutritionnels
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {nutritionalTips?.slice(0, 3).map(
                                            (
                                                tip // Show 3 tips
                                            ) => (
                                                <div
                                                    key={tip.id}
                                                    className="flex items-start p-3 space-x-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                                                >
                                                    <div
                                                        className={`flex items-center justify-center w-8 h-8 rounded-full bg-${tip.color}-100 dark:bg-${tip.color}-500/20 flex-shrink-0 mt-0.5`}
                                                    >
                                                        {getTipIcon(
                                                            tip.icon,
                                                            tip.color
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                            {tip.title}
                                                        </p>
                                                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                                            {tip.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Item Dialog */}
            <Dialog
                open={showAddItemForm}
                onOpenChange={(isOpen) => {
                    setShowAddItemForm(isOpen);
                    if (!isOpen) {
                        resetItem();
                        setSelectedMeal(null);
                    }
                }}
            >
                <DialogContent className="bg-white sm:max-w-lg dark:bg-slate-800">
                    {" "}
                    {/* Wider dialog for more fields */}
                    <DialogHeader>
                        <DialogTitle className="text-slate-900 dark:text-slate-100">
                            Ajouter un aliment à :{" "}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {selectedMeal?.meal_type_french} (
                                {selectedMeal?.time})
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 dark:text-slate-400">
                            Détaillez l'aliment et ses valeurs nutritionnelles.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleAddItem}
                        className="space-y-5 py-4 max-h-[70vh] overflow-y-auto pr-2"
                    >
                        <div>
                            <Label
                                htmlFor="name"
                                className="text-slate-700 dark:text-slate-300"
                            >
                                Nom de l'aliment
                            </Label>
                            <Input
                                id="name"
                                value={itemData.name}
                                onChange={(e) =>
                                    setItemData("name", e.target.value)
                                }
                                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                    itemErrors.name
                                        ? "border-red-500"
                                        : "border-slate-300"
                                }`}
                                placeholder="Ex: Poulet grillé"
                                required
                            />
                            {itemErrors.name && (
                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                    {itemErrors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <div>
                                <Label
                                    htmlFor="calories"
                                    className="text-slate-700 dark:text-slate-300"
                                >
                                    Calories (kcal)
                                </Label>
                                <Input
                                    id="calories"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={itemData.calories}
                                    onChange={(e) =>
                                        setItemData("calories", e.target.value)
                                    }
                                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                        itemErrors.calories
                                            ? "border-red-500"
                                            : "border-slate-300"
                                    }`}
                                    required
                                />
                                {itemErrors.calories && (
                                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                        {itemErrors.calories}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label
                                    htmlFor="carbs"
                                    className="text-slate-700 dark:text-slate-300"
                                >
                                    Glucides (g)
                                </Label>
                                <Input
                                    id="carbs"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={itemData.carbs}
                                    onChange={(e) =>
                                        setItemData("carbs", e.target.value)
                                    }
                                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                        itemErrors.carbs
                                            ? "border-red-500"
                                            : "border-slate-300"
                                    }`}
                                    required
                                />
                                {itemErrors.carbs && (
                                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                        {itemErrors.carbs}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label
                                    htmlFor="protein"
                                    className="text-slate-700 dark:text-slate-300"
                                >
                                    Protéines (g)
                                </Label>
                                <Input
                                    id="protein"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={itemData.protein}
                                    onChange={(e) =>
                                        setItemData("protein", e.target.value)
                                    }
                                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                        itemErrors.protein
                                            ? "border-red-500"
                                            : "border-slate-300"
                                    }`}
                                    required
                                />
                                {itemErrors.protein && (
                                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                        {itemErrors.protein}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label
                                    htmlFor="fat"
                                    className="text-slate-700 dark:text-slate-300"
                                >
                                    Lipides (g)
                                </Label>
                                <Input
                                    id="fat"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={itemData.fat}
                                    onChange={(e) =>
                                        setItemData("fat", e.target.value)
                                    }
                                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                        itemErrors.fat
                                            ? "border-red-500"
                                            : "border-slate-300"
                                    }`}
                                    required
                                />
                                {itemErrors.fat && (
                                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                        {itemErrors.fat}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label
                                htmlFor="portion_description"
                                className="text-slate-700 dark:text-slate-300"
                            >
                                Description de la portion (optionnel)
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
                                placeholder="Ex: 1 bol (250g), 1 tranche"
                                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                    itemErrors.portion_description
                                        ? "border-red-500"
                                        : "border-slate-300"
                                }`}
                            />
                            {itemErrors.portion_description && (
                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                    {itemErrors.portion_description}
                                </p>
                            )}
                        </div>
                        <DialogFooter className="pt-3 space-y-2 sm:justify-end sm:space-y-0 sm:space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAddItemForm(false)}
                                className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={processingItem}
                                className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            >
                                {processingItem
                                    ? "Ajout en cours..."
                                    : "Ajouter l'aliment"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
