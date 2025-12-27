-- Add new columns to suppliers table
ALTER TABLE suppliers 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT;

-- Create index for email (for notifications lookup)
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
