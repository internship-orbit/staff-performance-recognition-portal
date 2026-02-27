"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Prevent hydration error
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("Email atau password salah")
      setLoading(false)
      return
    }

    const user = data.user

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("email", user?.email)
      .single()

    if (!profile) {
      alert("Role tidak ditemukan")
      setLoading(false)
      return
    }

    if (profile.role === "admin") window.location.href = "/admin"
    if (profile.role === "juri") window.location.href = "/juri"
    if (profile.role === "verifikator") window.location.href = "/verifikator"
  }

  <div className="text-red-500 text-3xl">
  TEST
</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl w-96"
      >
        <h1 className="text-3xl font-bold text-center mb-2">ORBIT</h1>
        <p className="text-center text-gray-500 mb-8">
          Outstanding Recognition Tool
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  )
}