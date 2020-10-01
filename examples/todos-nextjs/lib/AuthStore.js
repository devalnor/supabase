import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

export const signUp = async (email, password) => {
  try {
    const res = await supabase.auth.signup(email, password)
    console.log(res.body.user)
    return res.body.user
  } catch (error) {
    console.log('error', error)
    return false
  }
}

export const getUser = async () => {
  try {
    return await supabase.auth.user()
  } catch (error) {
    return false
  }
}

export default { supabase, signUp, getUser }
