"use client"

import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function VerifikatorHeader(){

  const router = useRouter()

  async function logout(){

    await supabase.auth.signOut()

    router.push("/login")

  }

  return(

    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">

      <h1 className="font-semibold">
        Dashboard Verifikator
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 px-3 py-1 rounded"
      >
        Logout
      </button>

    </header>

  )

}