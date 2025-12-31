# Email Template: Konfirmasi Akun

Copy HTML di bawah ini ke **Supabase Dashboard > Authentication > Email Templates > Confirm signup**

---

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Konfirmasi Email - PeyGo</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align: center;">
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px;">✉️</span>
              </div>
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b;">
                Selamat Datang di PeyGo!
              </h1>
              <p style="margin: 0; font-size: 15px; color: #71717a; line-height: 1.5;">
                Terima kasih telah mendaftar. Klik tombol di bawah untuk mengaktifkan akun Anda.
              </p>
            </td>
          </tr>
          
          <!-- Button -->
          <tr>
            <td style="padding: 0 40px 32px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 4px 14px rgba(16,185,129,0.3);">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Aktifkan Akun Saya
                    </a>
                  </td>
                </tr>
              </table>
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
                Jika Anda tidak mendaftar di PeyGo, abaikan email ini.
              </p>
              <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                Link ini akan kadaluarsa dalam 24 jam.
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
- `{{ .ConfirmationURL }}` — Link konfirmasi otomatis dari Supabase
