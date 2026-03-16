"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ManajemenJuri(){

  const [juri,setJuri] = useState<any[]>([])
  const [nama,setNama] = useState("")

  useEffect(()=>{
    load()
  },[])

  async function load(){

    const { data } = await supabase
      .from("juri")
      .select("*")

    setJuri(data || [])

  }

  async function tambah(){

    if(!nama){
      alert("Nama juri tidak boleh kosong")
      return
    }

    await supabase
      .from("juri")
      .insert({
        nama:nama
      })

    setNama("")
    load()

  }

  async function gantiNama(id:string){

    const namaBaru = prompt("Masukkan nama baru")

    if(!namaBaru) return

    await supabase
      .from("juri")
      .update({nama:namaBaru})
      .eq("id",id)

    load()

  }

  return(

    <div className="space-y-6">

      <div className="bg-gray-900 p-6 rounded-xl">

        <h2 className="text-lg font-semibold mb-3">
          Tambah Juri
        </h2>

        <div className="flex gap-3">

          <input
            value={nama}
            onChange={(e)=>setNama(e.target.value)}
            placeholder="Nama Juri"
            className="bg-gray-800 p-2 rounded w-64"
          />

          <button
            onClick={tambah}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Tambah
          </button>

        </div>

      </div>

      <div className="bg-gray-900 rounded-xl">

        <table className="w-full">

          <thead className="bg-gray-800">

            <tr>
              <th className="p-3 text-left">Nama Juri</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>

          </thead>

          <tbody>

            {juri.map(j=>(
              <tr key={j.id} className="border-b border-gray-800">

                <td className="p-3">{j.nama}</td>

                <td className="p-3">

                  <button
                    onClick={()=>gantiNama(j.id)}
                    className="bg-yellow-600 px-3 py-1 rounded"
                  >
                    Ganti Nama
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}