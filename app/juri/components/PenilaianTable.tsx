"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import ScoreModal from "./ScoreModal"

export default function PenilaianTable(){

  const [data,setData] = useState<any[]>([])
  const [selected,setSelected] = useState<any>(null)

  useEffect(()=>{

    load()

  },[])

  async function load(){

    const { data } = await supabase
      .from("nominasi_final")
      .select(`
        pegawai:pegawai_id(
          id,
          nama,
          tim
        )
      `)

    if(data){

      setData(data.map((i:any)=>i.pegawai))

    }

  }

  return(

    <div>

      <table className="w-full bg-gray-900 rounded-xl">

        <thead className="bg-gray-800">

          <tr>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Tim</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>

        </thead>

        <tbody>

          {data.map((p)=>(
            <tr key={p.id} className="border-b border-gray-800">

              <td className="p-3">{p.nama}</td>
              <td className="p-3">{p.tim}</td>

              <td className="p-3">

                <button
                  onClick={()=>setSelected(p)}
                  className="bg-blue-600 px-3 py-1 rounded"
                >
                  Nilai
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {selected && (
        <ScoreModal pegawai={selected} onClose={()=>setSelected(null)} />
      )}

    </div>

  )

}