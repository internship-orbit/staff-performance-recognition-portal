"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ScoreModal({pegawai,onClose}:any){

  const [nilai,setNilai] = useState("")

  async function save(){

    const { data:{user} } = await supabase.auth.getUser()

    await supabase
      .from("penilaian")
      .upsert({
        pegawai_id:pegawai.id,
        juri_id:user?.id,
        total_nilai:Number(nilai)
      },{
        onConflict:"pegawai_id,juri_id"
      })

    onClose()

  }

  return(

    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div className="bg-gray-900 p-6 rounded-xl w-96">

        <h2 className="text-lg mb-3">
          Penilaian Pegawai
        </h2>

        <input
          type="number"
          className="w-full p-2 bg-gray-800 rounded"
          placeholder="Nilai"
          onChange={(e)=>setNilai(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={onClose}
            className="bg-gray-700 px-3 py-1 rounded"
          >
            Batal
          </button>

          <button
            onClick={save}
            className="bg-blue-600 px-3 py-1 rounded"
          >
            Simpan
          </button>

        </div>

      </div>

    </div>

  )

}