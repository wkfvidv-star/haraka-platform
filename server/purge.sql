-- Drop constraints first
ALTER TABLE IF EXISTS public.achievements DROP CONSTRAINT IF EXISTS achievements_user_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.group_members DROP CONSTRAINT IF EXISTS group_members_group_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.group_members DROP CONSTRAINT IF EXISTS group_members_user_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.groups DROP CONSTRAINT IF EXISTS groups_created_by_fkey CASCADE;
ALTER TABLE IF EXISTS public.sessions DROP CONSTRAINT IF EXISTS sessions_exercise_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.students_progress DROP CONSTRAINT IF EXISTS students_progress_user_id_fkey CASCADE;

-- Drop tables
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.group_members CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.students_progress CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.parents CASCADE;
DROP TABLE IF EXISTS public.coaches CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.grades CASCADE;
DROP TABLE IF EXISTS public.access_logs CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.daily_activities CASCADE;
DROP TABLE IF EXISTS public.exercise_submissions CASCADE;
DROP TABLE IF EXISTS public.physical_metrics CASCADE;
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.competitions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
