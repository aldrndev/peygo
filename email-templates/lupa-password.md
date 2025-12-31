# Email Template: Lupa Password

Copy HTML di bawah ini ke **Supabase Dashboard > Authentication > Email Templates > Reset password**

---

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - PeyGo</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align: center;">
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px;">🔐</span>
              </div>
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b;">
                Reset Password
              </h1>
              <p style="margin: 0; font-size: 15px; color: #71717a; line-height: 1.5;">
                Kami menerima permintaan reset password untuk akun Anda. Klik tombol di bawah untuk membuat password baru.
              </p>
            </td>
          </tr>
          
          <!-- Button -->
          <tr>
            <td style="padding: 0 40px 32px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 12px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 4px 14px rgba(245,158,11,0.3);">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Reset Password Saya
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Security Notice -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 500;">
                  ⚠️ Jika Anda tidak meminta reset password, segera abaikan email ini dan pastikan akun Anda aman.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 0;">
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 40px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">
                Link ini akan kadaluarsa dalam 1 jam.
              </p>
              <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                Untuk keamanan, jangan bagikan link ini kepada siapapun.
              </p>
            </td>
          </tr>
          
        </table>
        
        <!-- Copyright -->
        <p style="margin: 24px 0 0; font-size: 12px; color: #a1a1aa;">
          © 2025 PeyGo. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Variabel Supabase yang digunakan:
- `{{ .ConfirmationURL }}` — Link reset password otomatis dari Supabase
