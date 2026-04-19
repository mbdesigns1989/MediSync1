"use client"

import { useActionState, useRef } from "react"
import { submitPatientForm } from "@/app/actions"
import { usePatientStore } from "@/store"
import { useToast } from "@/hooks/use-toast"
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

export function PatientForm() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()
  const addPatient = usePatientStore((state) => state.addPatient)

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success: boolean; message: string; errors?: Record<string, string> }, formData: FormData) => {
      const result = await submitPatientForm(prevState, formData)

      if (result.success && result.patient) {
        addPatient(result.patient)
        toast.success(`Patient ${result.patient.name} added successfully!`)
        // Clear form inputs
        if (formRef.current) {
          formRef.current.reset()
        }
        // Close the dialog after successful submission
        dialogCloseRef.current?.click()
      } else if (!result.success) {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's information and primary complaint. Click save when done.
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
