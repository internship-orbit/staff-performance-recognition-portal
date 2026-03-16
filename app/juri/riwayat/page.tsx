"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Riwayat(){

  const [data,setData] = useState<any[]>([])

  useEffect(()=>{

    load()

  },[])

  async function load(){

    const { data:{user} } = await supabase.auth.getUser()

    const { data } = await supabase
      .from("penilaian")
      .select(`
        total_nilai,
        pegawai:pegawai_id(nama,tim)
      `)
      .eq("juri_id",user?.id)

    setData(data || [])

  }

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Riwayat Penilaian
      </h1>

      <ul className="space-y-2">

        {data.map((i,index)=>(
          <li key={index} className="bg-gray-900 p-4 rounded">

            {i.pegawai.nama} - {i.total_nilai}

          </li>
        ))}

      </ul>

    </div>

  )

}