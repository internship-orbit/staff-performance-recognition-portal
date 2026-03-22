"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type PegawaiTeladan = {
  id: string
  pegawai_id: string
  nama: string
  tim: string
  triwulan: number
  tahun: number
  periode_label: string
}

export default function UploadSertifikatPage(){

  const [pegawai,setPegawai] = useState<PegawaiTeladan | null>(null)
  const [file,setFile] = useState<File | null>(null)
  const [loading,setLoading] = useState(false)
  const [loadingPegawai,setLoadingPegawai] = useState(true)

  /* ================= LOAD PEGAWAI TELADAN TERAKHIR ================= */

  useEffect(()=>{
    loadPegawaiTeladan()
  },[])

  async function loadPegawaiTeladan(){

    setLoadingPegawai(true)

    const { data, error } = await supabase
      .from("history_penghargaan")
      .select("*")
      .order("created_at",{ ascending:false })
      .limit(1)
      .single()

    if(error){
      console.error(error)
      setLoadingPegawai(false)
      return
    }

    setPegawai(data)
    setLoadingPegawai(false)
  }

  /* ================= HANDLE UPLOAD ================= */

  async function handleSubmit(e:React.FormEvent){

    e.preventDefault()

    if(!pegawai){
      alert("Pegawai teladan belum tersedia")
      return
    }

    if(!file){
      alert("Silakan pilih file sertifikat")
      return
    }

    setLoading(true)

    try{

    const cleanName =
      file.name
        .toLowerCase()
        .replace(/\s+/g,"-")
        .replace(/[^a-z0-9.-]/g,"")

    const fileName =
      Date.now() + "-" + cleanName

      /* ================= UPLOAD STORAGE ================= */

      const { error:uploadError } = await supabase.storage
        .from("sertifikat")
        .upload(fileName,file,{
          cacheControl:"3600",
          upsert:true
        })

      if(uploadError){
        console.error(uploadError)
        alert(uploadError.message)
        setLoading(false)
        return
      }

      /* ================= AMBIL URL ================= */

      const { data:urlData } = supabase.storage
        .from("sertifikat")
        .getPublicUrl(fileName)

      const fileUrl = urlData.publicUrl

      /* ================= INSERT DATABASE ================= */

      const { error:insertError } = await supabase
        .from("sertifikat")
        .insert([
          {
            pegawai_id: pegawai.pegawai_id,
            periode: pegawai.periode_label,
            tahun: pegawai.tahun,
            file_url: fileUrl
          }
        ])

      if(insertError){
        console.error(insertError)
        alert(insertError.message)
        setLoading(false)
        return
      }

      alert("Sertifikat berhasil diupload")

      setFile(null)
      setLoading(false)

    }catch(err){

      console.error(err)
      alert("Terjadi kesalahan saat upload")
      setLoading(false)

    }

  }

  /* ================= UI ================= */

  return(

  <div className="min-h-screen bg-[#0b1635] text-blue-100 px-8 py-10">

    <div className="mb-8">
      <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">
        Upload Sertifikat
      </h1>

      <p className="text-blue-300/70 mt-1">
        Final step penghargaan pegawai teladan
      </p>
    </div>

    <div className="flex justify-center">

      <div className="w-full max-w-3xl bg-[#1a2f6d]/80 border border-cyan-400/20 rounded-2xl shadow-lg p-10">

        {/* ================= LOADING PEGAWAI ================= */}

        {loadingPegawai && (
          <p className="text-blue-300">
            Memuat pegawai teladan...
          </p>
        )}

        {!loadingPegawai && !pegawai && (
          <div className="text-red-400">
            Belum ada pegawai teladan ditetapkan
          </div>
        )}

        {!loadingPegawai && pegawai && (

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ================= NAMA ================= */}

          <div>
            <label className="block text-sm mb-2 text-cyan-200">
              Pegawai Teladan
            </label>

            <input
              value={pegawai.nama}
              disabled
              className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3"
            />
          </div>

          {/* ================= TIM ================= */}

          <div>
            <label className="block text-sm mb-2 text-cyan-200">
              Tim
            </label>

            <input
              value={pegawai.tim}
              disabled
              className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3"
            />
          </div>

          {/* ================= PERIODE ================= */}

          <div>
            <label className="block text-sm mb-2 text-cyan-200">
              Periode
            </label>

            <input
              value={pegawai.periode_label}
              disabled
              className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3"
            />
          </div>

          {/* ================= TAHUN ================= */}

          <div>
            <label className="block text-sm mb-2 text-cyan-200">
              Tahun
            </label>

            <input
              value={pegawai.tahun}
              disabled
              className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3"
            />
          </div>

          {/* ================= FILE ================= */}

          <div>
            <label className="block text-sm mb-2 text-cyan-200">
              Upload Sertifikat
            </label>

            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e)=>{
                if(e.target.files && e.target.files.length>0){
                  setFile(e.target.files[0])
                }
              }}
              className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3"
            />
          </div>

          {/* ================= BUTTON ================= */}

          <div className="flex justify-end pt-4">

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition-all shadow-lg"
            >
              {loading ? "Uploading..." : "Upload Sertifikat"}
            </button>

          </div>

        </form>

        )}

      </div>

    </div>

  </div>

  )
}