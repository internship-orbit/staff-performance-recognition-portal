import { supabase } from "@/lib/supabaseClient"

export async function getUserRole() {

  const { data: authData } = await supabase.auth.getUser()

  if (!authData.user) return null

  const email = authData.user.email

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("email", email)
    .single()

  if (error) {
    console.error("Error ambil role:", error)
    return null
  }

  return data.role
}