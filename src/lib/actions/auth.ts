"use server"

import { hash } from "bcryptjs"
import { AuthError } from "next-auth"

import { signIn } from "@/lib/auth"
import { db } from "@/lib/db"
import { loginSchema, registerSchema } from "@/lib/validations/auth"

export interface AuthActionResult {
  success: boolean
  error?: string
}

export async function registerUser(
  values: unknown
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(values)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  }

  const { name, email, password } = parsed.data

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists",
      }
    }

    const hashedPassword = await hash(password, 12)

    await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    })

    return { success: true }
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

export async function loginUser(
  values: unknown
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(values)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  }

  const { email, password } = parsed.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" }
        default:
          return { success: false, error: "Something went wrong. Please try again." }
      }
    }

    throw error
  }
}
