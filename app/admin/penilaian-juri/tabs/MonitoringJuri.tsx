"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function MonitoringJuri(){

  const [data,setData] = useState<any[]>([])

  useEffect(()=>{
    load()
  },[])

  async function load(){

    const { data } = await supabase
      .from("juri")
      .select(`
        id,
        nama,
        penilaian (
          id
        )
      `)

    if(data){

      const result = data.map((j:any)=>({

        id:j.id,
        nama:j.nama,
        jumlah:j.penilaian.length

      }))

      setData(result)

    }

  }

  return(

    <div className="bg-gray-900 rounded-xl">

      <table className="w-full">

        <thead className="bg-gray-800">

          <tr>

            <th className="p-3 text-left">Nama Juri</th>
            <th className="p-3 text-left">Jumlah Penilaian</th>
            <th className="p-3 text-left">Status</th>

          </tr>

        </thead>

        <tbody>

          {data.map((j)=>{

            const status = j.jumlah>0
              ? "Sudah Menilai"
              : "Belum Menilai"

            return(

              <tr key={j.id} className="border-b border-gray-800">

                <td className="p-3">{j.nama}</td>
                <td className="p-3">{j.jumlah}</td>
                <td className="p-3">{status}</td>

              </tr>

            )

          })}

        </tbody>

      </table>

    </div>

  )

}