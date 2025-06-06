"use client"; // Assuming this might be needed for some environments/tooling, though not standard for Inertia/React

import { useState } from "react";
import { Head, useForm } from "@inertiajs/react"; // `router` is not used in this file directly
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"; // Added CardDescription, CardFooter
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    FolderSyncIcon as Sync,
    Target,
    BookOpen,
    AlertTriangle,
    Info,
    Edit3,
    Trash2,
    Activity as ActivityIcon, // Renamed to avoid conflict with React.Activity
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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

export default function Index({
    auth,
    glycemiaRecords,
    currentReading,
    dailyAverage,
    todayCount,
}) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [alertSettings, setAlertSettings] = useState({
        hypoglycemia: true,
        hyperglycemia: true,
        reminder: true,
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        value: "",
        measured_at: new Date().toISOString().slice(0, 16),
        note: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("glycemia.index"), {
            // Assuming this is correct, or should be `glycemia.store`
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            },
        });
    };

    const getStatusColorClasses = (status) => {
        // Renamed for clarity and to return classes
        switch (status) {
            case "Élevé":
                return "bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600";
            case "Bas":
                return "bg-amber-100 dark:bg-amber-700/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600";
            case "Normal":
                return "bg-emerald-100 dark:bg-emerald-700/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600";
            default:
                return "bg-slate-100 dark:bg-slate-700/30 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600";
        }
    };

    const chartData = glycemiaRecords
        .slice(0, 10) // Original: Show more points if available
        .reverse()
        .map((record) => ({
            time: record.time,
            value: record.raw_value,
            date: record.date,
            // Original: targetMin: 4.0,
            // Original: targetMax: 7.8,
        }));

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-100 shadow-sm rounded-xl dark:bg-indigo-800/30">
                            <ActivityIcon className="text-indigo-600 w-7 h-7 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold leading-tight text-slate-800 dark:text-slate-100">
                                Suivi de Glycémie
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Visualisez et gérez vos mesures de glycémie.
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
                            <Button className="text-white transition-all bg-indigo-600 shadow-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 hover:shadow-lg">
                                <Plus className="w-5 h-5 mr-2" />
                                Ajouter une mesure
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800">
                            <DialogHeader>
                                <DialogTitle className="text-slate-900 dark:text-slate-100">
                                    Nouvelle mesure de glycémie
                                </DialogTitle>
                                <DialogDescription className="text-slate-600 dark:text-slate-400">
                                    Entrez les détails de votre dernière mesure.
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={handleSubmit}
                                className="py-4 space-y-6"
                            >
                                <div>
                                    <Label
                                        htmlFor="value"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
                                        Valeur (mmol/L)
                                    </Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="30"
                                        value={data.value}
                                        onChange={(e) =>
                                            setData("value", e.target.value)
                                        }
                                        className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                            errors.value
                                                ? "border-red-500"
                                                : "border-slate-300 dark:border-slate-600"
                                        }`}
                                        required
                                    />
                                    {errors.value && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.value}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="measured_at"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
                                        Date et heure
                                    </Label>
                                    <Input
                                        id="measured_at"
                                        type="datetime-local"
                                        value={data.measured_at}
                                        onChange={(e) =>
                                            setData(
                                                "measured_at",
                                                e.target.value
                                            )
                                        }
                                        className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                            errors.measured_at
                                                ? "border-red-500"
                                                : "border-slate-300 dark:border-slate-600"
                                        }`}
                                        required
                                    />
                                    {errors.measured_at && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.measured_at}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="note"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
                                        Notes (optionnel)
                                    </Label>
                                    <Textarea
                                        id="note"
                                        value={data.note}
                                        onChange={(e) =>
                                            setData("note", e.target.value)
                                        }
                                        placeholder="Ex: Avant repas, après sport..."
                                        className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                            errors.note
                                                ? "border-red-500"
                                                : "border-slate-300 dark:border-slate-600"
                                        }`}
                                    />
                                    {errors.note && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                                            {errors.note}
                                        </p>
                                    )}
                                </div>
                                <DialogFooter className="pt-2 space-y-2 sm:justify-end sm:space-y-0 sm:space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            reset();
                                        }}
                                        className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
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
            <Head title="Suivi de glycémie" />

            <div className="py-6">
                <div className="mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
                    {/* Current Status Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="transition-shadow duration-300 shadow-lg hover:shadow-xl dark:bg-slate-800">
                            <CardHeader className="pb-3 border-b dark:border-slate-700">
                                <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
                                    Dernière mesure
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                                    {currentReading
                                        ? `Aujourd'hui à ${currentReading.time}`
                                        : "Aucune mesure récente"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {currentReading?.raw_value ?? "-.-"}
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        mmol/L
                                    </span>
                                </div>
                                <div className="flex items-center mt-2 space-x-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            currentReading
                                                ? getStatusColorClasses(
                                                      currentReading.status
                                                  ).split(" ")[0] // Ensure bg class is taken
                                                : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                    ></div>
                                    <span className="text-sm text-slate-600 dark:text-slate-300">
                                        {currentReading?.status ??
                                            "Indisponible"}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400">
                                    {currentReading?.context ??
                                        "Aucun contexte fourni"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="transition-shadow duration-300 shadow-lg hover:shadow-xl dark:bg-slate-800">
                            <CardHeader className="pb-3 border-b dark:border-slate-700">
                                <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
                                    Moyenne du Jour
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                                    {todayCount} mesure
                                    {todayCount !== 1 ? "s" : ""} enregistrée
                                    {todayCount !== 1 ? "s" : ""}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {dailyAverage || "-.-"}
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        mmol/L
                                    </span>
                                </div>
                                <div className="flex items-center mt-2 space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm text-slate-600 dark:text-slate-300">
                                        Moyenne quotidienne
                                    </span>
                                </div>
                                <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400">
                                    Basée sur {todayCount} mesure
                                    {todayCount !== 1 ? "s" : ""} aujourd'hui.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="transition-shadow duration-300 border shadow-lg hover:shadow-xl bg-amber-50 dark:bg-amber-800/30 border-amber-300 dark:border-amber-700">
                            <CardHeader className="pb-3 border-b border-amber-300 dark:border-amber-600">
                                <div className="flex items-center space-x-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    <CardTitle className="text-base font-semibold text-amber-700 dark:text-amber-300">
                                        À Surveiller
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    Objectifs cibles post-prandiaux :{" "}
                                    <strong className="dark:text-amber-200">
                                        5.0 - 8.0 mmol/L
                                    </strong>
                                    .
                                </p>
                                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                                    Pensez à équilibrer vos prochains repas avec
                                    des fibres et protéines.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart */}
                    <Card className="transition-shadow duration-300 shadow-lg hover:shadow-xl dark:bg-slate-800">
                        <CardHeader className="border-b dark:border-slate-700">
                            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    Évolution de la Glycémie
                                </CardTitle>
                                <div className="flex p-0.5 space-x-1 bg-slate-100 dark:bg-slate-700 rounded-md">
                                    {["Jour", "Semaine", "Mois"].map(
                                        (period, index) => (
                                            <Button
                                                key={period}
                                                variant="ghost"
                                                size="sm"
                                                className="px-3 py-1 text-xs data-[active=true]:bg-white dark:data-[active=true]:bg-slate-600 data-[active=true]:shadow data-[active=true]:text-indigo-600 dark:data-[active=true]:text-indigo-400 hover:bg-white dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300"
                                                data-active={index === 0} // Example: Make 'Jour' active
                                            >
                                                {period}
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-72 sm:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 5,
                                            right: 20,
                                            left: -20,
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
                                            tick={{ fontSize: 12 }}
                                            className="fill-slate-500 dark:fill-slate-400"
                                        />
                                        <YAxis
                                            domain={[0, "dataMax + 2"]}
                                            tick={{ fontSize: 12 }}
                                            className="fill-slate-500 dark:fill-slate-400"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    "var(--card-background, white)", // Use CSS var for theming
                                                borderColor:
                                                    "var(--border-color, #e2e8f0)",
                                                borderRadius: "0.5rem", // Match card border radius
                                                boxShadow:
                                                    "var(--card-shadow, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))",
                                                color: "var(--text-primary, #1e293b)",
                                            }}
                                            labelStyle={{
                                                fontWeight: "600",
                                                color: "var(--text-strong, #0f172a)",
                                            }} // Stronger label
                                            formatter={(value, name, props) => [
                                                `${value} mmol/L`,
                                                `Glycémie (${props.payload.date})`,
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
                                            stroke="var(--color-indigo-500, #4f46e5)" // Indigo, themeable
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
                            <CardFooter className="flex items-center justify-end pt-6 mt-0 border-t-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                >
                                    Exporter les Données
                                </Button>
                            </CardFooter>
                        </CardContent>
                    </Card>

                    {/* Recent Measurements */}
                    <Card className="transition-shadow duration-300 shadow-lg hover:shadow-xl dark:bg-slate-800">
                        <CardHeader className="border-b dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    Mesures Récentes
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
                                    <thead className="border-b dark:border-slate-700">
                                        <tr>
                                            {[
                                                "Date",
                                                "Heure",
                                                "Glycémie",
                                                "Contexte",
                                                "Statut",
                                                "Actions",
                                            ].map((header) => (
                                                <th
                                                    key={header}
                                                    className={`px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500 dark:text-slate-400 ${
                                                        header === "Actions"
                                                            ? "text-right"
                                                            : ""
                                                    }`}
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {glycemiaRecords &&
                                        glycemiaRecords.length > 0 ? (
                                            glycemiaRecords
                                                .slice(0, 5)
                                                .map((record) => (
                                                    <tr
                                                        key={record.id}
                                                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                                    >
                                                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                            {record.date}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                                                            {record.time}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                                            {record.value}
                                                        </td>
                                                        <td className="max-w-xs px-4 py-3 text-sm truncate text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                            {record.context ||
                                                                "-"}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <Badge
                                                                variant="outline"
                                                                className={`${getStatusColorClasses(
                                                                    record.status
                                                                )} text-xs font-medium px-2 py-0.5`}
                                                            >
                                                                {record.status}
                                                            </Badge>
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
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-4 py-10 text-sm text-center text-slate-500 dark:text-slate-400"
                                                >
                                                    Aucune mesure enregistrée.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        {glycemiaRecords && glycemiaRecords.length > 5 && (
                            <CardFooter className="justify-center pt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                >
                                    {" "}
                                    Charger plus
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            {
                                title: "Synchroniser",
                                desc1: "Connectez votre appareil de mesure",
                                desc2: "pour synchroniser vos données.",
                                icon: Sync,
                                color: "indigo",
                            },
                            {
                                title: "Objectifs",
                                desc1: "Définissez vos plages cibles",
                                desc2: "et recevez des alertes.",
                                icon: Target,
                                color: "emerald",
                            }, // Changed green to emerald
                            {
                                title: "Ressources",
                                desc1: "Conseils et informations utiles",
                                desc2: "pour gérer votre diabète.",
                                icon: BookOpen,
                                color: "sky",
                            },
                        ].map((item) => (
                            <Card
                                key={item.title}
                                className="transition-all duration-300 ease-in-out transform shadow-lg cursor-pointer group hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div
                                            className={`flex items-center justify-center w-12 h-12 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-500/20 group-hover:bg-${item.color}-200 dark:group-hover:bg-${item.color}-500/30 transition-colors`}
                                        >
                                            <item.icon
                                                className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                                {item.desc1}
                                            </p>
                                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                                {item.desc2}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Alerts Section */}
                    <Card className="shadow-lg dark:bg-slate-800">
                        <CardHeader className="border-b dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    Alertes de Glycémie
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <Info className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            {[
                                {
                                    type: "hypoglycemia",
                                    title: "Alerte Hypoglycémie",
                                    desc: "Notification si glycémie < 3.9 mmol/L.",
                                    color: "red",
                                    colorDot: "bg-red-500 dark:bg-red-400",
                                    border: "border-red-300 dark:border-red-600",
                                    bg: "bg-red-50 dark:bg-red-900/30",
                                    text: "text-red-800 dark:text-red-200",
                                    subtext: "text-red-700 dark:text-red-300",
                                },
                                {
                                    type: "hyperglycemia",
                                    title: "Alerte Hyperglycémie",
                                    desc: "Notification si glycémie > 10.0 mmol/L.",
                                    color: "amber",
                                    colorDot: "bg-amber-500 dark:bg-amber-400",
                                    border: "border-amber-300 dark:border-amber-600",
                                    bg: "bg-amber-50 dark:bg-amber-900/30",
                                    text: "text-amber-800 dark:text-amber-200",
                                    subtext:
                                        "text-amber-700 dark:text-amber-300",
                                },
                                {
                                    type: "reminder",
                                    title: "Rappel de Mesure",
                                    desc: "Rappels à 08h00, 12h00, 18h00, et 22h00.",
                                    color: "sky",
                                    colorDot: "bg-sky-500 dark:bg-sky-400",
                                    border: "border-sky-300 dark:border-sky-600",
                                    bg: "bg-sky-50 dark:bg-sky-900/30",
                                    text: "text-sky-800 dark:text-sky-200",
                                    subtext: "text-sky-700 dark:text-sky-300",
                                }, // Changed blue to sky
                            ].map((alert) => (
                                <div
                                    key={alert.type}
                                    className={`flex items-center justify-between p-4 border rounded-lg ${alert.border} ${alert.bg}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-2.5 h-2.5 rounded-full ${alert.colorDot}`}
                                        ></div>
                                        <div>
                                            <h4
                                                className={`font-semibold ${alert.text}`}
                                            >
                                                {alert.title}
                                            </h4>
                                            <p
                                                className={`text-sm ${alert.subtext}`}
                                            >
                                                {alert.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={alertSettings[alert.type]}
                                        onCheckedChange={(checked) =>
                                            setAlertSettings((prev) => ({
                                                ...prev,
                                                [alert.type]: checked,
                                            }))
                                        }
                                        className={`data-[state=checked]:bg-${alert.color}-500 dark:data-[state=checked]:bg-${alert.color}-400 data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-600`} // Shadcn custom switch colors
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
