-- Migration: Create settings table for dynamic platform configuration
-- This table stores key-value settings that can be modified by admin

CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'string', -- string, number, boolean
  category TEXT NOT NULL, -- general, financial, notification, security, smtp
  label TEXT,
  description TEXT,
  is_secret BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- Create index for faster lookups
CREATE INDEX idx_settings_key ON public.settings(key);
CREATE INDEX idx_settings_category ON public.settings(category);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage all settings
CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy: Public can read non-secret general settings (for landing page etc)
CREATE POLICY "Public can read public settings" ON public.settings
  FOR SELECT USING (
    is_secret = FALSE
  );

-- Seed default values
INSERT INTO public.settings (key, value, type, category, label, description, is_secret) VALUES
  -- General
  ('platform_name', 'PeyGo', 'string', 'general', 'Nama Platform', 'Nama brand platform', false),
  ('platform_tagline', 'Platform Invoice & Billing untuk UMKM Indonesia', 'string', 'general', 'Tagline', 'Tagline platform', false),
  ('support_email', 'support@peygo.id', 'string', 'general', 'Email Support', 'Email untuk customer support', false),
  ('whatsapp_center', '+6281234567890', 'string', 'general', 'WhatsApp Center', 'Nomor WhatsApp support', false),
  
  -- Financial
  ('platform_fee', '2.5', 'number', 'financial', 'Biaya Platform', 'Persentase fee platform (%)', false),
  ('mdr_fee', '1.5', 'number', 'financial', 'Biaya MDR', 'Merchant Discount Rate (%)', false),
  ('ppn_rate', '11', 'number', 'financial', 'PPN Standar', 'Tarif PPN (%)', false),
  
  -- Notification
  ('email_transaction', 'true', 'boolean', 'notification', 'Email Transaksi', 'Kirim email ke admin saat ada transaksi', false),
  ('alert_registration', 'true', 'boolean', 'notification', 'Alert Pendaftaran', 'Notifikasi pendaftaran user baru', false),
  ('wa_reminder', 'false', 'boolean', 'notification', 'Reminder WhatsApp', 'Kirim reminder via WhatsApp H-1', false),
  
  -- Security
  ('require_2fa', 'false', 'boolean', 'security', 'Wajib 2FA Admin', 'Wajibkan 2FA untuk admin', false),
  ('auto_logout_mins', '30', 'number', 'security', 'Auto Logout', 'Menit sebelum auto logout', false),
  
  -- SMTP (non-secret parts)
  ('smtp_host', 'smtp.gmail.com', 'string', 'smtp', 'SMTP Host', 'Host server email', false),
  ('smtp_port', '587', 'number', 'smtp', 'SMTP Port', 'Port server email', false),
  ('smtp_user', 'noreply@peygo.id', 'string', 'smtp', 'SMTP User', 'Email pengirim', false);

-- Note: SMTP password stays in environment variables for security
