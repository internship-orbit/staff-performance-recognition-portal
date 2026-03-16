"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Profil(){

  const [email,setEmail] = useState("")

  useEffect(()=>{

    getUser()

  },[])

  async function getUser(){

    const { data:{user} } = await supabase.auth.getUser()

    setEmail(user?.email || "")

  }

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Profil Juri
      </h1>

      <div className="bg-gray-900 p-6 rounded-xl">

        Email : {email}

      </div>

    </div>

  )

}