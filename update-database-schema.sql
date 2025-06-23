-- Ensure all tables and functions are properly set up
-- This script will update the database schema to fix any issues

-- Update students table to ensure all columns exist
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS signature_url TEXT,
ADD COLUMN IF NOT EXISTS registration_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Update any existing records that might have NULL values
UPDATE public.students 
SET 
  school = educational_institute 
WHERE school IS NULL AND educational_institute IS NOT NULL;

UPDATE public.students 
SET 
  photo_url = '/placeholder.svg?height=200&width=150'
WHERE photo_url IS NULL;

UPDATE public.students 
SET 
  signature_url = '/placeholder.svg?height=80&width=300'
WHERE signature_url IS NULL;

UPDATE public.students 
SET 
  payment_status = 'pending'
WHERE payment_status IS NULL;

UPDATE public.students 
SET 
  registration_date = CURRENT_DATE
WHERE registration_date IS NULL;

-- Ensure indexes exist for better performance
CREATE INDEX IF NOT EXISTS idx_students_registration_number ON public.students(registration_number);
CREATE INDEX IF NOT EXISTS idx_students_payment_status ON public.students(payment_status);
CREATE INDEX IF NOT EXISTS idx_students_school ON public.students(school);

-- Ensure settings table has the admit card setting
INSERT INTO public.settings (id, value) 
VALUES ('admit_card', '{"enabled": true}')
ON CONFLICT (id) DO UPDATE SET value = '{"enabled": true}';

-- Test query to verify everything is working
SELECT 
  id,
  registration_number,
  full_name,
  class,
  olympiad_type,
  school,
  payment_status,
  registration_date
FROM public.students 
LIMIT 5;
