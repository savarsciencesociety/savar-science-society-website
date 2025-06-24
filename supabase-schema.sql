-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class TEXT NOT NULL,
    olympiad_type TEXT NOT NULL,
    full_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    father_mobile TEXT NOT NULL,
    mother_mobile TEXT,
    address TEXT NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    educational_institute TEXT NOT NULL,
    dream_university TEXT NOT NULL,
    previous_scholarship TEXT NOT NULL,
    scholarship_details TEXT,
    school TEXT NOT NULL,
    photo_url TEXT,
    signature_url TEXT,
    registration_number TEXT UNIQUE NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    registration_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin
INSERT INTO public.admins (username, password, name) 
VALUES ('Science@1', 'Jackson.com@312', 'Admin')
ON CONFLICT (username) DO NOTHING;

-- Insert default settings
INSERT INTO public.settings (id, value) 
VALUES ('admit_card', '{"enabled": false}')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_registration_number ON public.students(registration_number);
CREATE INDEX IF NOT EXISTS idx_students_school_class_subject_gender ON public.students(school, class, olympiad_type, gender);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students(created_at);
CREATE INDEX IF NOT EXISTS idx_students_payment_status ON public.students(payment_status);

-- Create storage buckets for student photos and signatures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-signatures', 'student-signatures', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to students" ON public.students;
DROP POLICY IF EXISTS "Allow public insert access to students" ON public.students;
DROP POLICY IF EXISTS "Allow service role full access to students" ON public.students;
DROP POLICY IF EXISTS "Allow service role full access to admins" ON public.admins;
DROP POLICY IF EXISTS "Allow service role full access to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public read access to settings" ON public.settings;

-- Allow public read access to students (for registration lookup)
CREATE POLICY "Allow public read access to students" ON public.students
    FOR SELECT USING (true);

-- Allow public insert access to students (for registration)
CREATE POLICY "Allow public insert access to students" ON public.students
    FOR INSERT WITH CHECK (true);

-- Allow service role full access to all tables
CREATE POLICY "Allow service role full access to students" ON public.students
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to admins" ON public.admins
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to settings" ON public.settings
    FOR ALL USING (auth.role() = 'service_role');

-- Allow public read access to settings (for admit card status)
CREATE POLICY "Allow public read access to settings" ON public.settings
    FOR SELECT USING (true);

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow public upload to student-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from student-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access to student-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to student-signatures" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from student-signatures" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access to student-signatures" ON storage.objects;

-- Storage policies for student photos and signatures
CREATE POLICY "Allow public upload to student-photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'student-photos');

CREATE POLICY "Allow public read from student-photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'student-photos');

CREATE POLICY "Allow service role full access to student-photos" ON storage.objects
    FOR ALL USING (bucket_id = 'student-photos' AND auth.role() = 'service_role');

CREATE POLICY "Allow public upload to student-signatures" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'student-signatures');

CREATE POLICY "Allow public read from student-signatures" ON storage.objects
    FOR SELECT USING (bucket_id = 'student-signatures');

CREATE POLICY "Allow service role full access to student-signatures" ON storage.objects
    FOR ALL USING (bucket_id = 'student-signatures' AND auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
