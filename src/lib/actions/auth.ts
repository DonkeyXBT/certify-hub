"use server"

import { hash } from "bcryptjs"
import { AuthError } from "next-auth"
import { randomUUID } from "crypto"

import { signIn } from "@/lib/auth"
import { db } from "@/lib/db"
import { loginSchema, registerSchema } from "@/lib/validations/auth"
import { sendPasswordResetEmail } from "@/lib/email"

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
    // Check if user exists but hasn't verified their email
    const user = await db.user.findUnique({
      where: { email },
      select: { emailVerified: true, hashedPassword: true },
    })

    if (user && !user.emailVerified) {
      return {
        success: false,
        error: "Please verify your email first. Check your inbox for the verification link.",
      }
    }

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

// Always returns success to avoid leaking whether an email exists
export async function requestPasswordReset(email: string): Promise<AuthActionResult> {
  try {
    const normalised = email.trim().toLowerCase()
    const user = await db.user.findUnique({
      where: { email: normalised },
      select: { id: true, name: true, email: true, emailVerified: true },
    })

    // Silently succeed if user doesn't exist or hasn't verified yet
    if (user?.emailVerified) {
      // Delete any existing reset tokens for this email first
      await db.verificationToken.deleteMany({ where: { identifier: normalised } })

      const token = randomUUID()
      await db.verificationToken.create({
        data: {
          identifier: normalised,
          token,
          expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      })

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gcrtool.cyfenced.nl"
      await sendPasswordResetEmail({
        to: normalised,
        name: user.name ?? normalised,
        resetUrl: `${appUrl}/reset-password/${token}`,
      })
    }

    return { success: true }
  } catch {
    return { success: true } // never leak errors
  }
}

export async function resetPassword(
  token: string,
  password: string
): Promise<AuthActionResult> {
  if (!password || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return { success: false, error: "This reset link is invalid or has already been used." }
    }

    if (verificationToken.expires < new Date()) {
      return { success: false, error: "This reset link has expired. Please request a new one." }
    }

    const hashedPassword = await hash(password, 12)

    await db.user.update({
      where: { email: verificationToken.identifier },
      data: { hashedPassword },
    })

    // Delete the used token
    await db.verificationToken.delete({ where: { token } })

    return { success: true }
  } catch {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
