-- Haraka Platform - Database Migration & Sync
-- This script synchronizes the database with the application requirements

-- 1. Fix the Profiles table and its constraints
-- Ensure the role check constraint includes all new roles.
DO $$ 
BEGIN
    -- Drop the check constraint if it exists (try common names)
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    
    -- Create table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
            role TEXT DEFAULT 'student',
            name TEXT,
            age INTEGER,
            avatar_url TEXT,
            parent_id UUID REFERENCES auth.users(id),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    -- Ensure required columns exist (for cases where Prisma created the table differently)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'name') THEN
        ALTER TABLE public.profiles ADD COLUMN name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;

    -- Add the updated constraint
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('student', 'youth', 'parent', 'teacher', 'coach', 'principal', 'directorate', 'ministry', 'competition', 'admin'));

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during profiles table upgrade: %', SQLERRM;
END $$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 2. Create students_progress table
CREATE TABLE IF NOT EXISTS public.students_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    performance_score INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE public.students_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own progress" ON public.students_progress;
CREATE POLICY "Students can view their own progress" ON public.students_progress
    FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Students can update their own progress" ON public.students_progress;
CREATE POLICY "Students can update their own progress" ON public.students_progress
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 3. Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('motor', 'cognitive', 'psychological', 'rehabilitation')),
    sub_category TEXT,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    duration TEXT,
    instructions TEXT[],
    video_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view exercises" ON public.exercises;
CREATE POLICY "Everyone can view exercises" ON public.exercises
    FOR SELECT USING (true);

-- 4. Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises ON DELETE SET NULL,
    score INTEGER,
    duration INTEGER, -- in seconds
    calories INTEGER,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own sessions" ON public.sessions;
CREATE POLICY "Users can view their own sessions" ON public.sessions
    FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.sessions;
CREATE POLICY "Users can insert their own sessions" ON public.sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- --- Functions and Triggers ---

-- Automatically create progress record on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_role TEXT;
BEGIN
    new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

    -- Insert into profiles using the safest types
    INSERT INTO public.profiles (id, name, avatar_url, role)
    VALUES (
        NEW.id, 
        NEW.raw_user_meta_data->>'name', 
        NEW.raw_user_meta_data->>'avatar_url', 
        new_role
    ) ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        role = EXCLUDED.role;

    -- Sync to public.users (Gamification/Prisma Table)
    -- This ensures Prima can find the user even if they signed up via Supabase
    INSERT INTO public.users (id, email, password, role, "xp", "level", "playCoins", "updatedAt", "createdAt")
    VALUES (
        NEW.id,
        NEW.email,
        '', -- Password handled by Supabase Auth
        UPPER(new_role)::text, -- Match UserRole enum in Prisma (UPPERCASE)
        0, 1, 0, NOW(), NOW()
    ) ON CONFLICT (id) DO NOTHING;

    -- Special handling for students
    IF new_role = 'student' THEN
        INSERT INTO public.students_progress (user_id)
        VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
EXCEPTION 
    WHEN OTHERS THEN
        -- Critical: Never block auth.users insertion
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
