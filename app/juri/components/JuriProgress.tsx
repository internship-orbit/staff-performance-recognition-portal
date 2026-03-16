"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function JuriProgress(){

  const [progress,setProgress] = useState(0)

  useEffect(()=>{

    loadProgress()

  },[])

  async function loadProgress(){

    const { data:{user} } = await supabase.auth.getUser()

    const { count:total } = await supabase
      .from("nominasi_final")
      .select("*",{count:"exact",head:true})

    const { count:done } = await supabase
      .from("penilaian")
      .select("*",{count:"exact",head:true})
      .eq("juri_id",user?.id)

    if(total && done !== null){

      setProgress(Math.round((done/total)*100))

    }

  }

  return(

    <div className="bg-gray-900 p-6 rounded-xl">

      <p className="text-gray-400 mb-2">
        Progress Penilaian
      </p>

      <div className="w-full bg-gray-800 h-3 rounded">

        <div
          style={{width:`${progress}%`}}
          className="bg-blue-500 h-3 rounded"
        />

      </div>

      <p className="mt-2 text-sm">
        {progress}% selesai
      </p>

    </div>

  )

}