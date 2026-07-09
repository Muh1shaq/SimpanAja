import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://alwibqglnkmyibubenhc.supabase.co/rest/v1/'
const supabaseAnonKey = 'sb_publishable_dS8QgtybFhaekcxTTdyR0w_cL3teK3q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)