/**
 * Contact mail delivery.
 * Priority:
 * 1) SMTP (SMTP_HOST / SMTP_USER / SMTP_PASS)
 * 2) FormSubmit AJAX fallback (activate once via email to CONTACT_TO)
 */
import nodemailer from 'nodemailer'

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export function createMailTransport() {
  if (!smtpConfigured()) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function sendViaSmtp({ name, email, subject, message }) {
  const to = process.env.CONTACT_TO || 'chojh@jbnu.ac.kr'
  const from = process.env.MAIL_FROM || process.env.SMTP_USER
  const transport = createMailTransport()
  if (!transport) {
    const err = new Error('SMTP is not configured')
    err.code = 'SMTP_NOT_CONFIGURED'
    throw err
  }

  return transport.sendMail({
    from: `"Applied AI Lab Contact" <${from}>`,
    to,
    replyTo: email,
    subject: `[Applied AI Lab] ${subject}`,
    text: [
      'New contact form submission',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#10221f">
        <h2 style="margin:0 0 12px">New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr style="border:none;border-top:1px solid #d7e4e0;margin:16px 0" />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `,
  })
}

async function sendViaFormSubmit({ name, email, subject, message }) {
  const to = process.env.CONTACT_TO || 'chojh@jbnu.ac.kr'
  const origin = (process.env.FRONT_ORIGIN || 'http://localhost:11115').replace(/\/$/, '')
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: origin,
      Referer: `${origin}/`,
    },
    body: JSON.stringify({
      name,
      email,
      _replyto: email,
      _subject: `[Applied AI Lab] ${subject}`,
      message,
      _template: 'table',
      _captcha: 'false',
    }),
  })

  const data = await res.json().catch(() => ({}))
  const msg = String(data.message || data.error || '')

  // First submission triggers an activation email to CONTACT_TO.
  if (/activation/i.test(msg)) {
    return { provider: 'formsubmit', needsActivation: true, raw: data }
  }

  if (!res.ok || data.success === 'false' || data.error) {
    const err = new Error(msg || 'FormSubmit delivery failed')
    err.code = 'FORMSUBMIT_FAILED'
    throw err
  }

  return { provider: 'formsubmit', needsActivation: false, raw: data }
}

export async function sendContactMail(payload) {
  if (smtpConfigured()) {
    const info = await sendViaSmtp(payload)
    return { provider: 'smtp', needsActivation: false, raw: info }
  }
  return sendViaFormSubmit(payload)
}
