import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://klgvufpqasgaltdfhwmn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZ3Z1ZnBxYXNnYWx0ZGZod21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MjYwOTEsImV4cCI6MjA3ODIwMjA5MX0.-Ab70Hh00IM-WDu2dFcuhmBbq2C7Vi_Up2wz2x4FRjo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
