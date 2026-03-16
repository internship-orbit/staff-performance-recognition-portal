"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminOverrideNilai(){

  const [pegawai,setPegawai] = useState<any[]>([])
  const [nilai,setNilai] = useState("")

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

      setPegawai(data.map((i:any)=>i.pegawai))

    }

  }

  async function save(p:any){

    const { data:{user} } = await supabase.auth.getUser()

    await supabase
      .from("penilaian")
      .upsert({
        pegawai_id:p.id,
        juri_id:user?.id,
        total_nilai:Number(nilai)
      },{
        onConflict:"pegawai_id,juri_id"
      })

    alert("Nilai berhasil disimpan")

  }

  return(

    <div>

      <table className="w-full bg-gray-900 rounded-xl">

        <thead className="bg-gray-800">

          <tr>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Tim</th>
            <th className="p-3 text-left">Nilai</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>

        </thead>

        <tbody>

          {pegawai.map(p=>(
            <tr key={p.id} className="border-b border-gray-800">

              <td className="p-3">{p.nama}</td>
              <td className="p-3">{p.tim}</td>

              <td className="p-3">

                <input
                  type="number"
                  onChange={(e)=>setNilai(e.target.value)}
                  className="bg-gray-800 p-2 rounded"
                />

              </td>

              <td className="p-3">

                <button
                  onClick={()=>save(p)}
                  className="bg-blue-600 px-3 py-1 rounded"
                >
                  Simpan
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  )

}