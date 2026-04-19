"use server";

import { SubmitPatientResult, Patient } from "@/types/patient";

/**
 * Server Action for patient form submission
 * 
 * Validates form data and simulates database save with 1.5s delay
 * Returns success/error result object
 */
export async function submitPatientForm(
  prevState: SubmitPatientResult,
  formData: FormData
): Promise<SubmitPatientResult> {
  try {
    // Extract form fields
    const name = formData.get("name")?.toString().trim() || "";
    const age = parseInt(formData.get("age")?.toString() || "0", 10);
    const gender = formData.get("gender")?.toString() || "";
    const primaryComplaint = formData
      .get("primaryComplaint")
      ?.toString()
      .trim() || "";

    // Validation
    const errors: Record<string, string> = {};

    if (!name || name.length < 2) {
      errors.name = "Patient name must be at least 2 characters";
    }

    if (isNaN(age) || age < 1 || age > 150) {
      errors.age = "Age must be between 1 and 150";
    }

    if (!gender || !["male", "female", "other", "prefer-not-to-say"].includes(gender)) {
      errors.gender = "Please select a valid gender option";
    }

    if (!primaryComplaint || primaryComplaint.length < 5) {
      errors.primaryComplaint = "Primary complaint must be at least 5 characters";
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      };
    }

    // Simulate database save with 1.5-second delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create patient object
    const patient: Patient = {
      id: `PAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      age,
      gender: gender as 'male' | 'female' | 'other' | 'prefer-not-to-say',
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
