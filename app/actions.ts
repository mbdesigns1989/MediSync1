"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  SubmitPatientResult,
  Patient,
  patientSchema,
  patientIntakeSchema,
  type PatientIntakeInput,
} from "@/types/patient";
import { prisma } from "@/lib/prisma";

/**
 * Server Action for the quick add-patient form.
 *
 * Validates with the shared Zod schema (the server trust boundary), persists to
 * the database, revalidates the dashboard, and returns the created patient.
 */
export async function submitPatientForm(
  prevState: SubmitPatientResult,
  formData: FormData
): Promise<SubmitPatientResult> {
  try {
    // safeParse never throws — on failure we map Zod's field errors onto the
    // { errors } shape the form already renders per-field.
    const parsed = patientSchema.safeParse({
      name: formData.get("name"),
      age: formData.get("age"),
      gender: formData.get("gender"),
      primaryComplaint: formData.get("primaryComplaint"),
    });

    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      const errors: Record<string, string> = {};
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          errors[field] = messages[0];
        }
      }
      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      };
    }

    const { name, age, gender, primaryComplaint } = parsed.data;

    const row = await prisma.patient.create({
      data: { name, age, gender, primaryComplaint },
    });

    const patient: Patient = {
      id: row.id,
      name: row.name,
      age: row.age,
      gender: row.gender as Patient["gender"],
      primaryComplaint: row.primaryComplaint,
      createdAt: row.createdAt,
    };

    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Patient ${name} added successfully!`,
      patient,
    };
  } catch (error) {
    console.error("Form submission error:", error);
    return {
      success: false,
      message: "An error occurred while submitting the form. Please try again.",
    };
  }
}

/** Delete a patient (and their appointments via cascade). */
export async function deletePatient(patientId: string): Promise<void> {
  await prisma.patient.delete({ where: { id: patientId } });
  revalidatePath("/dashboard");
}

export interface IntakeResult {
  success: boolean;
  message: string;
  patientId?: string;
}

/**
 * Rich multi-step intake submission (medications[], emergency contacts[]).
 *
 * Re-validates with the SAME `patientIntakeSchema` the client used in React Hook
 * Form — the server trust boundary. The client never to be trusted: even though
 * RHF already validated, we re-check here before persisting.
 */
export async function createPatientIntake(
  input: PatientIntakeInput
): Promise<IntakeResult> {
  const parsed = patientIntakeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Validation failed on the server" };
  }

  try {
    const { name, age, gender, primaryComplaint, medications, emergencyContacts } =
      parsed.data;

    const row = await prisma.patient.create({
      data: {
        name,
        age,
        gender,
        primaryComplaint,
        // Field arrays stored as JSON strings (SQLite has no array type).
        medications: JSON.stringify(medications.map((m) => m.name)),
        emergencyContacts: JSON.stringify(emergencyContacts),
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message: `Patient ${name} admitted successfully!`,
      patientId: row.id,
    };
  } catch (error) {
    console.error("createPatientIntake error:", error);
    return { success: false, message: "Failed to save patient intake" };
  }
}
