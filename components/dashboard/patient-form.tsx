"use client"

import { useActionState, useRef } from "react"
import { useFormStatus } from "react-dom"
import { submitPatientForm } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import type { Patient } from "@/types/patient"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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

/**
 * Submit button extracted into its own component so it can read `useFormStatus()`
 * — the React 19 idiom for pulling the parent form's pending state without
 * prop-drilling. Must be rendered inside the <form> it reports on.
 */
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Patient"}
    </Button>
  )
}

interface PatientFormProps {
  /**
   * Optimistic-add callback from the dashboard page's `useOptimistic`. Called
   * inside the form action (a transition) so the new patient's row shows in the
   * table instantly, before the 1.5s server save settles.
   */
  addOptimisticPatient?: (patient: Patient) => void
}

export function PatientForm({ addOptimisticPatient }: PatientFormProps) {
  const dialogCloseRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success: boolean; message: string; errors?: Record<string, string> }, formData: FormData) => {
      // Optimistically show the patient immediately (still inside the action's
      // transition, so React holds the optimistic row until the action settles).
      const optimisticId = `optimistic-${Date.now()}`
      const name = formData.get("name")?.toString().trim() || ""
      const ageValue = Number(formData.get("age"))
      if (addOptimisticPatient && name) {
        addOptimisticPatient({
          id: optimisticId,
          name,
          age: Number.isFinite(ageValue) ? ageValue : 0,
          gender: (formData.get("gender")?.toString() ||
            "prefer-not-to-say") as Patient["gender"],
          primaryComplaint:
            formData.get("primaryComplaint")?.toString().trim() || "",
          createdAt: new Date(),
        })
      }

      const result = await submitPatientForm(prevState, formData)

      if (result.success && result.patient) {
        // No client store write needed — the server action persisted the patient
        // and revalidated /dashboard, so the server-rendered list refreshes.
        toast.success(`Patient ${result.patient.name} added successfully!`)
        // Clear form inputs
        if (formRef.current) {
          formRef.current.reset()
        }
        // Close the dialog after successful submission
        dialogCloseRef.current?.click()
      } else if (!result.success) {
        // Validation/save failed — the optimistic row rolls back automatically
        // when the action settles (React reverts useOptimistic to the base list).
        toast.error(result.message || "Failed to add patient")
      }

      return result
    },
    {
      success: false,
      message: "",
    }
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Patient</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient&apos;s information and primary complaint. Click save when done.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Patient Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              disabled={isPending}
              required
            />
            {state.errors?.name && (
              <p className="text-sm text-red-500">{state.errors.name}</p>
            )}
          </div>

          {/* Age Field */}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="30"
              disabled={isPending}
              required
            />
            {state.errors?.age && (
              <p className="text-sm text-red-500">{state.errors.age}</p>
            )}
          </div>

          {/* Gender Field */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select name="gender" disabled={isPending}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.gender && (
              <p className="text-sm text-red-500">{state.errors.gender}</p>
            )}
          </div>

          {/* Primary Complaint Field */}
          <div className="space-y-2">
            <Label htmlFor="primaryComplaint">Primary Complaint</Label>
            <Textarea
              id="primaryComplaint"
              name="primaryComplaint"
              placeholder="Describe the patient's main health concern..."
              disabled={isPending}
              required
            />
            {state.errors?.primaryComplaint && (
              <p className="text-sm text-red-500">{state.errors.primaryComplaint}</p>
            )}
          </div>

          {/* Dialog Footer */}
          <DialogFooter>
            <DialogClose ref={dialogCloseRef} asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
