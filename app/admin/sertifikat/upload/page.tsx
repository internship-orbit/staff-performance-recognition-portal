"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function UploadSertifikatPage() {

// ================= STATE =================
const [namaPegawai, setNamaPegawai] = useState("")
const [periode, setPeriode] = useState("Triwulan 1")
const [tahun, setTahun] = useState(new Date().getFullYear())
const [file, setFile] = useState<File | null>(null)
const [loading, setLoading] = useState(false)

// ================= HANDLE UPLOAD =================
async function handleSubmit(e: React.FormEvent) {


e.preventDefault()

if (!namaPegawai || !file) {
  alert("Lengkapi data terlebih dahulu")
  return
}

setLoading(true)

try {

  // buat nama file unik
  const cleanName = file.name.replace(/\s+/g, "-")
const fileName = Date.now() + "-" + encodeURIComponent(file.name)

  // ================= UPLOAD FILE KE STORAGE =================
  const { error: uploadError } = await supabase.storage
    .from("sertifikat")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true
    })

  if (uploadError) {
    console.error(uploadError)
    alert(uploadError.message)
    setLoading(false)
    return
  }

  // ================= AMBIL URL FILE =================
  const { data } = supabase.storage
    .from("sertifikat")
    .getPublicUrl(fileName)

  const fileUrl = data.publicUrl

  // ================= SIMPAN DATA KE DATABASE =================
  const { error: insertError } = await supabase
    .from("sertifikat")
    .insert([
      {
        nama_pegawai: namaPegawai,
        periode: periode,
        tahun: tahun,
        file_url: fileUrl
      }
    ])

  if (insertError) {
    console.error(insertError)
    alert("Gagal menyimpan data")
    setLoading(false)
    return
  }

  alert("Sertifikat berhasil diupload")

  // reset form
  setNamaPegawai("")
  setFile(null)
  setLoading(false)

} catch (error) {

  console.error(error)
  alert("Terjadi kesalahan saat upload")
  setLoading(false)

}


}

return (


<div className="min-h-screen bg-[#0b1635] text-blue-100 px-8 py-10">

  {/* ================= HEADER ================= */}
  <div className="mb-8">

    <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">
      Upload Sertifikat
    </h1>

    <p className="text-blue-300/70 mt-1">
      Certificate Upload — Model Employee by Period & Year
    </p>

  </div>


  {/* ================= CARD ================= */}
  <div className="flex justify-center">

    <div
      className="
      w-full
      max-w-3xl
      bg-[#1a2f6d]/80
      backdrop-blur-xl
      border border-cyan-400/20
      rounded-2xl
      shadow-lg
      p-10
    "
    >

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ================= NAMA PEGAWAI ================= */}
        <div>

          <label className="block text-sm mb-2 text-cyan-200">
            Nama Pegawai Teladan
          </label>

          <input
            type="text"
            value={namaPegawai}
            onChange={(e) => setNamaPegawai(e.target.value)}
            placeholder="Masukkan nama pegawai teladan"
            className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3 text-blue-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

        </div>


        {/* ================= PERIODE ================= */}
        <div>

          <label className="block text-sm mb-2 text-cyan-200">
            Periode
          </label>

          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3 text-blue-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="Triwulan 1">Triwulan 1</option>
            <option value="Triwulan 2">Triwulan 2</option>
            <option value="Triwulan 3">Triwulan 3</option>
            <option value="Triwulan 4">Triwulan 4</option>
          </select>

        </div>


        {/* ================= TAHUN ================= */}
        <div>

          <label className="block text-sm mb-2 text-cyan-200">
            Tahun
          </label>

          <input
            type="number"
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3 text-blue-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
            onChange={(e) => {

              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0])
              }

            }}
            className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3 text-blue-100"
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

    </div>

  </div>

</div>


)
}
