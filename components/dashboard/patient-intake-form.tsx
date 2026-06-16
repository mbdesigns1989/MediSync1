"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { createPatientIntake } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import {
  patientIntakeSchema,
  type PatientIntakeInput,
  type PatientIntakeFormValues,
} from "@/types/patient"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
} from "@/components/ui"

type Step = 0 | 1 | 2

const STEP_TITLES = ["Patient details", "Medications", "Emergency contacts"]
// Which fields belong to each step — used to validate step-by-step before advancing.
const STEP_FIELDS: Record<Step, (keyof PatientIntakeFormValues)[]> = {
  0: ["name", "age", "gender", "primaryComplaint"],
  1: ["medications"],
  2: ["emergencyContacts"],
}

export function PatientIntakeForm() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>(0)

  // 3 generics: <Input, Context, Output>. The form holds the input shape
  // (age possibly pre-coercion, medications optional) and the resolver produces
  // the validated output shape the submit handler receives.
  const form = useForm<PatientIntakeFormValues, unknown, PatientIntakeInput>({
    // The SAME schema used server-side — one schema, two trust levels.
    resolver: zodResolver(patientIntakeSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      age: 1,
      gender: undefined,
      primaryComplaint: "",
      medications: [],
      emergencyContacts: [{ name: "", relationship: "", phone: "" }],
    },
  })

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = form

  const medications = useFieldArray({ control, name: "medications" })
  const contacts = useFieldArray({ control, name: "emergencyContacts" })
  const gender = watch("gender")

  async function next() {
    const valid = await trigger(STEP_FIELDS[step])
    if (valid && step < 2) setStep((s) => (s + 1) as Step)
  }

  function back() {
    if (step > 0) setStep((s) => (s - 1) as Step)
  }

  async function onSubmit(values: PatientIntakeInput) {
    const result = await createPatientIntake(values)
    if (result.success) {
      toast.success(result.message)
      reset()
      setStep(0)
      setOpen(false)
    } else {
      toast.error(result.message)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      reset()
      setStep(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">New Intake</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Patient Intake</DialogTitle>
          <DialogDescription>
            Step {step + 1} of 3 — {STEP_TITLES[step]}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex gap-2">
          {STEP_TITLES.map((title, i) => (
            <div
              key={title}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-blue-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* STEP 0 — details */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="intake-name">Patient Name</Label>
                <Input id="intake-name" placeholder="John Doe" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="intake-age">Age</Label>
                <Input
                  id="intake-age"
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                />
                {errors.age && (
                  <p className="text-sm text-red-500">{errors.age.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="intake-gender">Gender</Label>
                <Select
                  value={gender}
                  onValueChange={(v) =>
                    setValue("gender", v as PatientIntakeInput["gender"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="intake-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="intake-complaint">Primary Complaint</Label>
                <Textarea
                  id="intake-complaint"
                  placeholder="Describe the patient's main health concern..."
                  {...register("primaryComplaint")}
                />
                {errors.primaryComplaint && (
                  <p className="text-sm text-red-500">
                    {errors.primaryComplaint.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 1 — medications (field array, optional) */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Add current medications (optional).
              </p>
              {medications.fields.map((field, i) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="e.g. Lisinopril 10mg daily"
                      {...register(`medications.${i}.name`)}
                    />
                    {errors.medications?.[i]?.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.medications[i]?.name?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => medications.remove(i)}
                    className="text-red-600 hover:bg-red-50"
                    aria-label="Remove medication"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => medications.append({ name: "" })}
              >
                <Plus className="mr-1 h-4 w-4" /> Add medication
              </Button>
            </div>
          )}

          {/* STEP 2 — emergency contacts (field array, at least one required) */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                At least one emergency contact is required.
              </p>
              {errors.emergencyContacts?.root && (
                <p className="text-sm text-red-500">
                  {errors.emergencyContacts.root.message}
                </p>
              )}
              {contacts.fields.map((field, i) => (
                <div
                  key={field.id}
                  className="space-y-2 rounded-md border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Contact {i + 1}
                    </span>
                    {contacts.fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => contacts.remove(i)}
                        className="text-red-600 hover:bg-red-50"
                        aria-label="Remove contact"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input placeholder="Name" {...register(`emergencyContacts.${i}.name`)} />
                  {errors.emergencyContacts?.[i]?.name && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyContacts[i]?.name?.message}
                    </p>
                  )}
                  <Input
                    placeholder="Relationship (e.g. Spouse)"
                    {...register(`emergencyContacts.${i}.relationship`)}
                  />
                  {errors.emergencyContacts?.[i]?.relationship && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyContacts[i]?.relationship?.message}
                    </p>
                  )}
                  <Input
                    placeholder="Phone"
                    {...register(`emergencyContacts.${i}.phone`)}
                  />
                  {errors.emergencyContacts?.[i]?.phone && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyContacts[i]?.phone?.message}
                    </p>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  contacts.append({ name: "", relationship: "", phone: "" })
                }
              >
                <Plus className="mr-1 h-4 w-4" /> Add contact
              </Button>
            </div>
          )}

          <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < 2 ? (
              <Button type="button" onClick={next}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Admitting..." : "Admit Patient"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
