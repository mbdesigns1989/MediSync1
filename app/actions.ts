"use server";

import { z } from "zod";
import { SubmitPatientResult, Patient, patientSchema } from "@/types/patient";

/**
 * Server Action for patient form submission
 *
 * Validates form data with the shared Zod schema (the server trust boundary),
 * simulates a database save with a 1.5s delay, and returns a success/error result.
 */
export async function submitPatientForm(
  prevState: SubmitPatientResult,
  formData: FormData
): Promise<SubmitPatientResult> {
  try {
    // Validate with the shared schema. safeParse never throws — on failure we map
    // Zod's field errors onto the existing { errors } shape the form already renders.
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

    // Simulate database save with 1.5-second delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create patient object
    const patient: Patient = {
      id: `PAT-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      name,
      age,
      gender,
      primaryComplaint,
      createdAt: new Date(),
    };

    // Success response
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
