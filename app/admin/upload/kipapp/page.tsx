"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

type Pegawai = {
  id: string
  nama: string
  tim: string
}

export default function UploadKipAppPage() {

  const router = useRouter()

  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([])
  const [selectedPegawai, setSelectedPegawai] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    loadNominasi()
    loadFiles()
  }, [])

  async function loadNominasi() {

    const { data } = await supabase
      .from("nominasi_juri")
      .select(`
        pegawai:pegawai_id(
          id,
          nama,
          tim
        )
      `)

    if (data) {
      const list = data.map((d: any) => d.pegawai)
      setPegawaiList(list)
    }
  }

  async function loadFiles() {

    const { data } = await supabase
      .from("kipapp")
      .select(`
        id,
        file_url,
        uploaded_at,
        pegawai:pegawai_id(
          nama,
          tim
        )
      `)
      .order("uploaded_at", { ascending: false })

    setFiles(data || [])
  }

  async function handleUpload() {

    if (!selectedPegawai) {
      alert("Pilih pegawai nominasi")
      return
    }

    if (!file) {
      alert("Pilih file PDF")
      return
    }

    setUploading(true)

    const fileName = `${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("kipapp")
      .upload(fileName, file)

    if (uploadError) {
      alert(uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("kipapp")
      .getPublicUrl(fileName)

    await supabase
      .from("kipapp")
      .insert({
        pegawai_id: selectedPegawai,
        file_url: urlData.publicUrl
      })

    alert("KipApp berhasil diupload")

    setFile(null)
    setSelectedPegawai("")
    setUploading(false)

    loadFiles()
  }

  async function handleDelete(f: any) {

    const confirmDelete = confirm("Yakin ingin menghapus dokumen ini?")
    if (!confirmDelete) return

    try {

      const filePath = f.file_url.split("/").pop()

      await supabase.storage
        .from("kipapp")
        .remove([filePath])

      await supabase
        .from("kipapp")
        .delete()
        .eq("id", f.id)

      alert("Dokumen berhasil dihapus")

      loadFiles()

    } catch {
      alert("Gagal menghapus dokumen")
    }
  }

  return (

    <div className="max-w-6xl mx-auto space-y-10">

      {/* UPLOAD CARD */}
      <div className="bg-[#1a2f6d]/80 backdrop-blur-xl border border-cyan-400/15 rounded-2xl shadow-lg p-8">

        <div className="mb-6">

          <label className="block mb-3 text-sm font-medium text-blue-200">
            Pilih Pegawai Kandidat
          </label>

          <select
            value={selectedPegawai}
            onChange={(e) => setSelectedPegawai(e.target.value)}
            className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-3 text-white"
          >
            <option value="">-- pilih pegawai --</option>

            {pegawaiList.map(p => (
              <option key={p.id} value={p.id}>
                {p.nama} - {p.tim}
              </option>
            ))}

          </select>

        </div>

        <div className="mb-6">

          <label className="block mb-3 text-sm font-medium text-blue-200">
            Upload File PDF KipApp
          </label>

          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-cyan-400/30 rounded-xl cursor-pointer bg-[#0f1c3f] hover:bg-[#142454] transition">

            <div className="flex flex-col items-center text-center px-4">

              <p className="text-sm text-blue-200">
                <span className="font-semibold text-cyan-300">
                  Klik untuk memilih file
                </span>{" "}
                atau drag & drop di sini
              </p>

              <p className="text-xs text-blue-400/60 mt-1">
                Format yang diperbolehkan: .pdf
              </p>

              {file && (
                <p className="mt-3 text-sm font-semibold text-green-400">
                  📄 {file.name}
                </p>
              )}

            </div>

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

          </label>

        </div>

        <div className="flex justify-between items-center">

          <button
            onClick={() => router.push("/admin")}
            className="px-6 py-2 rounded-lg border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 transition"
          >
            Kembali
          </button>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-6 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition-all shadow-lg"
          >
            {uploading ? "Uploading..." : "Upload KipApp"}
          </button>

        </div>

      </div>

      {/* FILE LIST */}
      <div className="bg-[#1a2f6d]/80 backdrop-blur-xl border border-cyan-400/15 rounded-2xl shadow-lg p-8">

        <h2 className="text-xl font-bold mb-6 text-cyan-300">
          File Yang Sudah Diupload
        </h2>

        {files.length === 0 && (
          <p className="text-blue-300/60">
            Belum ada dokumen
          </p>
        )}

        <div className="space-y-4">

          {files.map((f) => (

            <div
              key={f.id}
              className="flex items-start justify-between gap-4 p-4 bg-[#0f1c3f] rounded-lg border border-cyan-400/10"
            >

              <div className="flex-1 min-w-0">

                <p className="font-semibold text-white break-words">
                  {f.pegawai?.nama}
                </p>

                <p className="text-xs text-blue-300/70 mt-1">
                  {f.pegawai?.tim}
                </p>

                <p className="text-xs text-blue-400/50 mt-1">
                  {new Date(f.uploaded_at).toLocaleString()}
                </p>

              </div>

              <div className="flex items-center gap-2 shrink-0">

                <a
                  href={f.file_url}
                  target="_blank"
                  className="px-4 py-1.5 text-sm rounded-lg bg-linear-to-r from-purple-500 to-cyan-500 text-white hover:scale-105 transition"
                >
                  Lihat PDF
                </a>

                <button
                  onClick={() => handleDelete(f)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition"
                >
                  ✕
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}