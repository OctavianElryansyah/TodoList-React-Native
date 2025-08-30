import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wmutyuyeidajevpdmixi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdXR5dXllaWRhamV2cGRtaXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODA3ODcsImV4cCI6MjA3MTk1Njc4N30.oRqR3OMGsOJOvfBahztEHVyuX7qyZ6zkkKJ9dvXiwzw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
