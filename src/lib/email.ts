import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || "Certifi by Cyfenced <noreply@tradingcardgroup.nl>"

export async function sendVerificationEmail({
  to,
  name,
  orgName,
  verifyUrl,
}: {
  to: string
  name: string
  orgName: string
  verifyUrl: string
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Verify your Certifi account`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2>Welcome to Certifi by Cyfenced, ${name}!</h2>
          <p>An account has been created for you in <strong>${orgName}</strong>.</p>
          <p>Click the button below to set your password and activate your account:</p>
          <a href="${verifyUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 16px 0;">
            Verify &amp; Set Password
          </a>
          <p style="color: #64748b; font-size: 14px;">This link will expire in 7 days.</p>
          <p style="color: #64748b; font-size: 14px;">If you didn't expect this email, you can safely ignore it.</p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send verification email:", error)
    return { error: "Failed to send verification email" }
  }
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string
  name: string
  resetUrl: string
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your Certifi password",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset the password for your Certifi by Cyfenced account.</p>
          <p>Click the button below to choose a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #64748b; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email — your password will not be changed.</p>
          <p style="color: #64748b; font-size: 14px;">Can't see the button? Copy and paste this link: ${resetUrl}</p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    return { error: "Failed to send password reset email" }
  }
}
