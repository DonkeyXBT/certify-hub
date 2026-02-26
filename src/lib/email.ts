import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || "Certifi by Cyfenced <noreply@tradingcardgroup.nl>"

// Remediation 1 & 2: Never interpolate raw user input into HTML templates.
// All user-controlled strings are passed through escapeHtml() before rendering,
// keeping user data as safe context variables rather than template code.
// Remediation 4: This function acts as the sanitization boundary equivalent to
// a sandboxed template environment — no user value can break out of its text node.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Remediation 3 & 5: Validate that URL parameters are safe https/http URLs to
// prevent javascript: URI injection (principle of least privilege on link targets).
function safeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("Unsafe URL protocol")
    }
    return url
  } catch {
    return "#"
  }
}

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
  // Remediation 2: User data is passed as sanitized context variables, not raw template strings.
  const safeName = escapeHtml(name)
  const safeOrgName = escapeHtml(orgName)
  const safeVerifyUrl = safeUrl(verifyUrl)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Verify your Certifi account`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2>Welcome to Certifi by Cyfenced, ${safeName}!</h2>
          <p>An account has been created for you in <strong>${safeOrgName}</strong>.</p>
          <p>Click the button below to set your password and activate your account:</p>
          <a href="${safeVerifyUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 16px 0;">
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
  // Remediation 2: User data is passed as sanitized context variables, not raw template strings.
  const safeName = escapeHtml(name)
  const safeResetUrl = safeUrl(resetUrl)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your Certifi password",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>Hi ${safeName},</p>
          <p>We received a request to reset the password for your Certifi by Cyfenced account.</p>
          <p>Click the button below to choose a new password:</p>
          <a href="${safeResetUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #64748b; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email — your password will not be changed.</p>
          <p style="color: #64748b; font-size: 14px;">Can't see the button? Copy and paste this link: ${safeResetUrl}</p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    return { error: "Failed to send password reset email" }
  }
}
