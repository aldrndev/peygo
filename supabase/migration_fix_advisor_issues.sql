-- Migration: Fix Security Advisor Issues
-- 1. Enable RLS on webhook_logs (Critical)
-- 2. Fix mutable search_path in functions (Warning)

-- PART 1: Webhook Logs RLS
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create policy: Only Admin/Service Role can read/write logs
-- Assuming this table is for system use, typical users shouldn't see it.
CREATE POLICY "Service Role can full access webhook_logs"
ON public.webhook_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: Allow admins to view logs? 
-- If needed, add policy for admins. For now, strict (Service Role only) is safest.


-- PART 2: Fix Function Search Paths
-- Set search_path to public to prevent hijacking
CREATE OR REPLACE FUNCTION public.protect_timestamp_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.created_at = OLD.created_at;
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$;
