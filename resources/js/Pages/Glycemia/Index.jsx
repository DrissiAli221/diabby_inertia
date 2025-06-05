
import { useState } from "react"
import { Head, useForm } from "@inertiajs/react"
import { route } from "ziggy-js"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, FolderSyncIcon as Sync, Target, BookOpen, AlertTriangle, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function Index({ auth, glycemiaRecords, currentReading, dailyAverage, todayCount }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [alertSettings, setAlertSettings] = useState({
    hypoglycemia: true,
    hyperglycemia: true,
    reminder: true,
  })

  const { data, setData, post, processing, errors, reset } = useForm({
    value: "",
    measured_at: new Date().toISOString().slice(0, 16),
    note: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route("glycemia.index"), {
      onSuccess: () => {
        reset()
        setShowAddForm(false)
      },
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Élevé":
        return "bg-red-100 text-red-800 border-red-200"
      case "Bas":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Normal":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const chartData = glycemiaRecords
    .slice(0, 7)
    .reverse()
    .map((record) => ({
      time: record.time,
      value: record.raw_value,
      date: record.date,
    }))

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800">Suivi de glycémie</h2>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une mesure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle mesure de glycémie</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="value">Valeur (mmol/L)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={data.value}
                    onChange={(e) => setData("value", e.target.value)}
                    className={errors.value ? "border-red-500" : ""}
                    required
                  />
                  {errors.value && <p className="mt-1 text-sm text-red-500">{errors.value}</p>}
                </div>
                <div>
                  <Label htmlFor="measured_at">Date et heure</Label>
                  <Input
                    id="measured_at"
                    type="datetime-local"
                    value={data.measured_at}
                    onChange={(e) => setData("measured_at", e.target.value)}
                    className={errors.measured_at ? "border-red-500" : ""}
                    required
                  />
                  {errors.measured_at && <p className="mt-1 text-sm text-red-500">{errors.measured_at}</p>}
                </div>
                <div>
                  <Label htmlFor="note">Notes (optionnel)</Label>
                  <Textarea
                    id="note"
                    value={data.note}
                    onChange={(e) => setData("note", e.target.value)}
                    placeholder="Ajoutez des notes sur cette mesure..."
                    className={errors.note ? "border-red-500" : ""}
                  />
                  {errors.note && <p className="mt-1 text-sm text-red-500">{errors.note}</p>}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <Head title="Suivi de glycémie" />

      <div className="py-6">
        <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
          {/* Current Status Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Dernière mesure</CardTitle>
                <p className="text-xs text-gray-500">
                  {currentReading ? `Aujourd'hui à ${currentReading.time}` : "Aucune mesure"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Niveau actuel</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {currentReading ? currentReading.raw_value : "0.0"}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">mmol/L</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {currentReading ? currentReading.context : "Aucun contexte"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Moyenne du jour</CardTitle>
                <p className="text-xs text-gray-500">
                  {todayCount} mesure{todayCount !== 1 ? "s" : ""} aujourd'hui
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Moyenne du jour</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-green-600">{dailyAverage || "0.0"}</span>
                  <span className="ml-1 text-sm text-gray-500">mmol/L</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{todayCount} mesures aujourd'hui</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">À surveiller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Objectifs fixés</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-orange-600">Objectifs fixés après déjeuner. Pensez à</p>
                  <p className="text-sm text-orange-600">équilibrer vos prochains repas avec plus de</p>
                  <p className="text-sm text-orange-600">protéines.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Évolution de la glycémie</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Jour
                  </Button>
                  <Button variant="outline" size="sm">
                    Semaine
                  </Button>
                  <Button variant="outline" size="sm">
                    Mois
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 15]} />
                    <Tooltip
                      formatter={(value) => [`${value} mmol/L`, "Glycémie"]}
                      labelFormatter={(label) => `Heure: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Glycémie</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-600">Zone cible</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Exporter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Measurements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mesures récentes</CardTitle>
                <Button variant="link" className="text-blue-600">
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-sm font-medium text-left text-gray-600">Date</th>
                      <th className="py-2 text-sm font-medium text-left text-gray-600">Heure</th>
                      <th className="py-2 text-sm font-medium text-left text-gray-600">Glycémie</th>
                      <th className="py-2 text-sm font-medium text-left text-gray-600">Contexte</th>
                      <th className="py-2 text-sm font-medium text-left text-gray-600">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {glycemiaRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm text-gray-900">{record.date}</td>
                        <td className="py-3 text-sm text-blue-600">{record.time}</td>
                        <td className="py-3 text-sm text-gray-900">{record.value}</td>
                        <td className="py-3 text-sm text-gray-600">{record.context}</td>
                        <td className="py-3">
                          <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Action Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="transition-shadow cursor-pointer hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Sync className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Synchroniser</h3>
                    <p className="text-sm text-gray-600">Connectez votre appareil de mesure pour</p>
                    <p className="text-sm text-gray-600">synchroniser automatiquement vos données</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow cursor-pointer hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Objectifs</h3>
                    <p className="text-sm text-gray-600">Définissez vos plages cibles et recevez des</p>
                    <p className="text-sm text-gray-600">alertes personnalisées</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow cursor-pointer hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Ressources</h3>
                    <p className="text-sm text-gray-600">Accédez à des conseils et informations pour</p>
                    <p className="text-sm text-gray-600">mieux gérer votre diabète</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Alertes de glycémie</CardTitle>
                <Button variant="ghost" size="sm">
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-red-900">Alerte hypoglycémie</h4>
                    <p className="text-sm text-red-700">
                      Une notification sera envoyée si votre glycémie est inférieure à 3.9 mmol/L
                    </p>
                  </div>
                </div>
                <Switch
                  checked={alertSettings.hypoglycemia}
                  onCheckedChange={(checked) => setAlertSettings((prev) => ({ ...prev, hypoglycemia: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-orange-900">Alerte hyperglycémie</h4>
                    <p className="text-sm text-orange-700">
                      Une notification sera envoyée si votre glycémie est supérieure à 10.0 mmol/L
                    </p>
                  </div>
                </div>
                <Switch
                  checked={alertSettings.hyperglycemia}
                  onCheckedChange={(checked) => setAlertSettings((prev) => ({ ...prev, hyperglycemia: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">Rappel de mesure</h4>
                    <p className="text-sm text-blue-700">Un rappel sera envoyé à 08h00, 12h00, 18h00 et 22h00</p>
                  </div>
                </div>
                <Switch
                  checked={alertSettings.reminder}
                  onCheckedChange={(checked) => setAlertSettings((prev) => ({ ...prev, reminder: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}