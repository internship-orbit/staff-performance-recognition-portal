"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function RiwayatVerifikasi(){

  const [data,setData] = useState<any[]>([])

  useEffect(()=>{

    load()

  },[])

  async function load(){

    const { data } = await supabase
      .from("penilaian")
      .select(`
        total_nilai,
        status_verifikasi,
        pegawai:pegawai_id(nama)
      `)

    setData(data || [])

  }

  return(

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Riwayat Verifikasi
      </h1>

      <ul className="space-y-2">

        {data.map((d,i)=>(
          <li key={i} className="bg-gray-900 p-4 rounded">

            {d.pegawai.nama} - {d.total_nilai} ({d.status_verifikasi})

          </li>
        ))}

      </ul>

    </div>

  )

}