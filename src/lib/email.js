import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

/**
 * Send customer lead / inquiry alert to admin
 */
export async function sendInquiryAlert({ name, phone, email, location, message, date }) {
    if (!resend) {
        console.warn('Resend API key not configured. Skipping email delivery.');
        return { success: false, error: 'Resend not configured' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `Rajasthanwall Leads <${FROM_EMAIL}>`,
            to: [ADMIN_EMAIL],
            replyTo: email || undefined,
            subject: `🔔 New Customer Lead: ${name} (${location || 'General Inquiry'})`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background: #0f172a; padding: 24px; text-align: center; border-bottom: 4px solid #facc15;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">
                            Rajasthan<span style="color: #facc15;">Wall</span> Infratech
                        </h1>
                        <p style="color: #94a3b8; margin: 6px 0 0; font-size: 13px;">New Website Customer Inquiry</p>
                    </div>

                    <div style="padding: 24px;">
                        <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
                            <span style="font-size: 12px; font-weight: 700; color: #854d0e; text-transform: uppercase;">Direct Client Lead</span>
                            <h2 style="margin: 4px 0 0; color: #713f12; font-size: 18px;">${name}</h2>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 120px;">Phone:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">
                                    <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
                                </td>
                            </tr>
                            ${email ? `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Email:</td>
                                <td style="padding: 10px 0; color: #0f172a;">
                                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                                </td>
                            </tr>
                            ` : ''}
                            ${location ? `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Site Location:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${location}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Submitted At:</td>
                                <td style="padding: 10px 0; color: #64748b;">${date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                            </tr>
                        </table>

                        <div style="margin-top: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
                            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Customer Message:</span>
                            <p style="margin: 6px 0 0; color: #1e293b; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${message || 'No specific message provided.'}</p>
                        </div>

                        <div style="margin-top: 24px; text-align: center;">
                            <a href="https://wa.me/${(phone || '').replace(/[^0-9]/g, '')}" style="display: inline-block; background: #16a34a; color: #ffffff; padding: 10px 20px; font-size: 13px; font-weight: 700; border-radius: 6px; text-decoration: none; margin-right: 8px;">
                                WhatsApp Client
                            </a>
                            <a href="tel:${phone}" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 10px 20px; font-size: 13px; font-weight: 700; border-radius: 6px; text-decoration: none;">
                                Call Now
                            </a>
                        </div>
                    </div>

                    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px; text-align: center; font-size: 11px; color: #94a3b8;">
                        This inquiry was submitted on <a href="https://rajasthanwall.com" style="color: #64748b;">rajasthanwall.com</a> and saved to MongoDB.
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Resend API error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Failed to dispatch inquiry email:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Send Emergency Password Reset Link
 */
export async function sendPasswordResetEmail({ toEmail, resetUrl }) {
    if (!resend) return { success: false, error: 'Resend not configured' };

    try {
        const { data, error } = await resend.emails.send({
            from: `Rajasthanwall Security <${FROM_EMAIL}>`,
            to: [toEmail || ADMIN_EMAIL],
            subject: '🔒 Emergency Admin Password Reset Request',
            html: `
                <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px;">
                    <h2 style="color: #0f172a; margin-top: 0;">Emergency Password Reset</h2>
                    <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                        We received a request to reset the administrator password for <strong>${toEmail}</strong>.
                    </p>
                    <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                        Click the button below to set a new password. This link is cryptographically protected and will expire in <strong>15 minutes</strong>:
                    </p>
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${resetUrl}" style="background: #facc15; color: #0f172a; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                            Reset Password & Unlock Account
                        </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.4;">
                        If you did not request this, please ignore this email. Your password will remain unchanged.
                    </p>
                </div>
            `,
        });
        return { success: !error, data, error };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Send Emergency MFA Reset OTP Code
 */
export async function sendEmergencyOtpEmail({ toEmail, otp }) {
    if (!resend) return { success: false, error: 'Resend not configured' };

    try {
        const { data, error } = await resend.emails.send({
            from: `Rajasthanwall Security <${FROM_EMAIL}>`,
            to: [toEmail || ADMIN_EMAIL],
            subject: '🔐 Your Emergency MFA Reset Verification Code',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background: #0f172a; padding: 20px; text-align: center; border-bottom: 4px solid #facc15;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 18px;">
                            Rajasthan<span style="color: #facc15;">Wall</span> Security Desk
                        </h2>
                    </div>
                    <div style="padding: 24px;">
                        <h3 style="color: #0f172a; margin-top: 0;">Emergency MFA Recovery Code</h3>
                        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                            An emergency request was submitted to reset the Two-Factor Authenticator (TOTP) for <strong>${toEmail}</strong>.
                        </p>
                        <p style="color: #475569; font-size: 14px;">
                            Please enter this 6-digit one-time verification code on the recovery screen:
                        </p>
                        <div style="text-align: center; margin: 24px 0;">
                            <span style="display: inline-block; background: #fefce8; border: 2px dashed #ca8a04; color: #854d0e; font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 12px 28px; border-radius: 8px; font-family: monospace;">
                                ${otp}
                            </span>
                        </div>
                        <p style="color: #64748b; font-size: 12px; text-align: center;">
                            ⏱️ This code is valid for <strong>10 minutes</strong>. Do NOT share this code with anyone.
                        </p>
                    </div>
                    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8;">
                        If you did not initiate this recovery request, please change your password immediately.
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Failed to send MFA OTP via Resend:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Error dispatching MFA OTP email:', err);
        return { success: false, error: err.message };
    }
}

