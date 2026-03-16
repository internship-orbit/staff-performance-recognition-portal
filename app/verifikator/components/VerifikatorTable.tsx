"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function VerifikasiTable(){

  const [data,setData] = useState<any[]>([])

  useEffect(()=>{

    load()

  },[])

  async function load(){

    const { data } = await supabase
      .from("penilaian")
      .select(`
        id,
        total_nilai,
        pegawai:pegawai_id(
          nama,
          tim
        ),
        juri:juri_id(
          nama
        )
      `)

    setData(data || [])

  }

  async function approve(id:string){

    await supabase
      .from("penilaian")
      .update({
        status_verifikasi:"approved"
      })
      .eq("id",id)

    load()

  }

  async function reject(id:string){

    await supabase
      .from("penilaian")
      .update({
        status_verifikasi:"revisi"
      })
      .eq("id",id)

    load()

  }

  return(

    <table className="w-full bg-gray-900 rounded-xl">

      <thead className="bg-gray-800">

        <tr>
          <th className="p-3 text-left">Pegawai</th>
          <th className="p-3 text-left">Tim</th>
          <th className="p-3 text-left">Juri</th>
          <th className="p-3 text-left">Nilai</th>
          <th className="p-3 text-left">Aksi</th>
        </tr>

      </thead>

      <tbody>

        {data.map(item=>(
          <tr key={item.id} className="border-b border-gray-800">

            <td className="p-3">{item.pegawai.nama}</td>
            <td className="p-3">{item.pegawai.tim}</td>
            <td className="p-3">{item.juri?.nama}</td>
            <td className="p-3">{item.total_nilai}</td>

            <td className="p-3 flex gap-2">

              <button
                onClick={()=>approve(item.id)}
                className="bg-green-600 px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={()=>reject(item.id)}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Revisi
              </button>

            </td>

          </tr>
        ))}

      </tbody>

    </table>

  )

}