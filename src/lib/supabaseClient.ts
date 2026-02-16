import { createClient } from '@supabase/supabase-js';

// قراءة مفاتيح Supabase من ملف البيئة .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// إنشاء عميل Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
