import { Suspense } from "react"
import type { Metadata } from "next"
import { getPatientDetails } from "@/lib/patient-fetcher"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Stethoscope, Calendar, Clock } from "lucide-react"
import PatientProfileLoading from "./loading"

interface PatientProfilePageProps {
  params: Promise<{ id: string }>
}

// Dynamic per-patient page title, e.g. "Sarah Johnson — MediSync AI"
// (the "— MediSync AI" suffix comes from the title template in app/layout.tsx).
// Shares the cached fetch with the page, so the 2.5s delay is paid only once.
export async function generateMetadata({
  params,
}: PatientProfilePageProps): Promise<Metadata> {
  const { id } = await params
  const patient = await getPatientDetails(id)
  return {
    title: patient.name,
    description: `Patient profile for ${patient.name} — vitals, clinical notes, and medications.`,
  }
}

async function PatientContent({ id }: { id: string }) {
  const patient = await getPatientDetails(id)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">{patient.name}</h1>
        <p className="text-sm text-slate-600">
          Patient ID: {patient.id} • Age: {patient.age} •{" "}
          <span className="capitalize">{patient.gender}</span> • Last visit:{" "}
          {patient.lastVisit.toLocaleDateString()}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Blood Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patient.vitals.bloodPressure}
            </div>
            <p className="text-xs text-slate-500 mt-1">mmHg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {patient.vitals.heartRate}
            </div>
            <p className="text-xs text-slate-500 mt-1">bpm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {patient.vitals.temperature}°F
            </div>
            <p className="text-xs text-slate-500 mt-1">Fahrenheit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              O₂ Saturation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {patient.vitals.oxygenSaturation}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Blood Oxygen</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Vitals and Clinical Notes */}
        <div className="md:col-span-2 space-y-6">
          {/* Detailed Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Vital Signs
              </CardTitle>
              <CardDescription>
                Latest measurements from today&apos;s visit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-sm text-slate-600">Respiratory Rate</p>
                  <p className="text-lg font-semibold">
                    {patient.vitals.respiratoryRate} breaths/min
                  </p>
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <p className="text-sm text-slate-600">O₂ Saturation</p>
                  <p className="text-lg font-semibold">
                    {patient.vitals.oxygenSaturation}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-500" />
                Clinical Notes
              </CardTitle>
              <CardDescription>
                Medical observations and primary complaint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  Chief Complaint
                </h4>
                <p className="text-sm text-slate-700">
                  {patient.primaryComplaint}
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto rounded-lg bg-slate-50 p-4 border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  Notes
                </h4>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {patient.clinicalNotes}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                Add Prescription
              </Button>
              <Button className="w-full" variant="outline" size="sm">
                Schedule Follow-up
              </Button>
              <Button className="w-full" variant="ghost" size="sm">
                View Medical History
              </Button>
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {patient.medications.map((med, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-sm text-slate-700">{med}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs text-slate-600">Last Visit</p>
                  <p className="text-sm font-medium">
                    {patient.lastVisit.toLocaleDateString()}
                  </p>
                </div>
              </div>
              {patient.nextAppointment && (
                <div className="flex items-start gap-3 border-t border-slate-200 pt-3">
                  <Calendar className="h-4 w-4 text-blue-500 mt-1" />
                  <div>
                    <p className="text-xs text-slate-600">Next Appointment</p>
                    <p className="text-sm font-medium">
                      {patient.nextAppointment.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default async function PatientProfilePage({
  params,
}: PatientProfilePageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<PatientProfileLoading />}>
      <PatientContent id={id} />
    </Suspense>
  )
}
