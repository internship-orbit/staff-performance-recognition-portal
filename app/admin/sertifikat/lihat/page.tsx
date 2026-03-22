"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Sertifikat = {
  id: string
  file_url: string
  periode: string
  tahun: number
}

export default function LihatSertifikatPage(){

  const [data,setData] = useState<Sertifikat[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    loadData()
  },[])

  async function loadData(){

    setLoading(true)

    const { data,error } = await supabase
      .from("sertifikat")
      .select("*")
      .order("tahun",{ ascending:false })

    if(error){
      console.error(error)
      setLoading(false)
      return
    }

    setData(data || [])
    setLoading(false)
  }

  /* ================= DELETE ================= */

  async function handleDelete(item:Sertifikat){

    const confirmDelete = confirm(
      "Yakin ingin menghapus sertifikat ini?"
    )

    if(!confirmDelete) return

    try{

      /* ===== ambil nama file dari URL ===== */

      const filePath =
        item.file_url.split("/sertifikat/")[1]

      /* ===== hapus file storage ===== */

      const { error:storageError } = await supabase
        .storage
        .from("sertifikat")
        .remove([filePath])

      if(storageError){
        console.error(storageError)
        alert("Gagal hapus file storage")
        return
      }

      /* ===== hapus database ===== */

      const { error:dbError } = await supabase
        .from("sertifikat")
        .delete()
        .eq("id",item.id)

      if(dbError){
        console.error(dbError)
        alert("Gagal hapus data database")
        return
      }

      alert("Sertifikat berhasil dihapus")

      loadData()

    }catch(err){
      console.error(err)
      alert("Terjadi kesalahan")
    }

  }

  /* ================= UI ================= */

  return(

  <div className="min-h-screen bg-[#0b1635] text-blue-100 px-8 py-10">

    <div className="mb-8">
      <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">
        Lihat Sertifikat
      </h1>

      <p className="text-blue-300/70 mt-1">
        All Uploaded Model Employee Certificates
      </p>
    </div>

    <div className="bg-[#1a2f6d]/80 border border-cyan-400/20 rounded-2xl p-8">

      <h2 className="text-xl font-semibold text-cyan-200 mb-6">
        Data Sertifikat
      </h2>

      {loading && (
        <p className="text-blue-300">
          Loading data...
        </p>
      )}

      {!loading && data.length === 0 && (
        <p className="text-blue-300">
          Belum ada sertifikat
        </p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {data.map(item=>(

        <div
          key={item.id}
          className="relative bg-[#0f1c3f] border border-cyan-400/10 rounded-xl p-6 shadow-lg"
        >

          {/* DELETE BUTTON */}

          <button
            onClick={()=>handleDelete(item)}
            className="absolute top-3 right-3 text-red-400 hover:text-red-300 text-lg"
          >
            ✕
          </button>

          <div className="text-xs text-cyan-300 uppercase mb-2">
            Pegawai Teladan
          </div>

          <p className="text-sm text-blue-300 mb-4">
            {item.periode} • {item.tahun}
          </p>

          <a
            href={item.file_url}
            target="_blank"
            className="block text-center px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:scale-105 transition"
          >
            Lihat Sertifikat
          </a>

        </div>

      ))}

      </div>

    </div>

  </div>

  )
}