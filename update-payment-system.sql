-- Add payment verification fields to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS payment_number TEXT,
ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_verified_by TEXT;

-- Update payment status to include verification states
-- payment_status can be: 'pending', 'submitted', 'verified', 'rejected'

-- Create index for payment verification
CREATE INDEX IF NOT EXISTS idx_students_payment_verification ON public.students(payment_verified, payment_status);

-- Update existing records
UPDATE public.students 
SET payment_verified = TRUE, payment_status = 'verified'
WHERE payment_status = 'paid';

UPDATE public.students 
SET payment_status = 'pending'
WHERE payment_status != 'verified';
