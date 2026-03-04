"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    getUploadedFiles()
  }, [])

  async function getUploadedFiles() {
    const { data } = await supabase
      .from("excel_uploads")
      .select("*")
      .order("uploaded_at", { ascending: false })

    setFiles(data || [])
  }

  async function handleUpload() {
    if (!file) {
      alert("Pilih file Excel terlebih dahulu")
      return
    }

    setUploading(true)

    const fileName = `${Date.now()}-${file.name}`

    // Upload ke bucket doc-pegawai
    const { error: uploadError } = await supabase.storage
      .from("doc-pegawai")
      .upload(fileName, file)

    if (uploadError) {
      alert("Gagal upload file")
      setUploading(false)
      return
    }

    // Ambil public URL
    const { data: publicUrl } = supabase.storage
      .from("doc-pegawai")
      .getPublicUrl(fileName)

    // Simpan metadata ke database
    await supabase.from("excel_uploads").insert({
      file_name: file.name,
      file_url: publicUrl.publicUrl,
    })

    setUploading(false)
    setFile(null)
    getUploadedFiles()
    alert("File berhasil diupload!")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-10">

      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-indigo-600">
          Upload File Excel Mentah
        </h1>

        <div className="mb-6">
  <label className="block mb-2 font-medium text-gray-700">
    Pilih File Excel (.xlsx / .xls)
  </label>

  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition">
    
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <p className="mb-2 text-sm text-gray-700">
        <span className="font-semibold text-indigo-600">
          Klik untuk memilih file
        </span>
        {" "}atau drag & drop di sini
      </p>

      <p className="text-xs text-gray-500">
        Format yang diperbolehkan: .xlsx / .xls
      </p>

      {file && (
        <p className="mt-3 text-sm font-semibold text-green-600">
          📄 {file.name}
        </p>
      )}
    </div>

    <input
      type="file"
      accept=".xlsx,.xls"
      className="hidden"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
    />
  </label>
</div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        <button
          onClick={() => router.push("/admin")}
          className="ml-4 bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-lg"
        >
          Kembali
        </button>
      </div>

      {/* LIST FILE */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-indigo-600">
          File Yang Sudah Diupload
        </h2>

        {files.length === 0 && (
          <p className="text-gray-500">Belum ada file</p>
        )}

        {files.map((f) => (
          <div
            key={f.id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-semibold">{f.file_name}</p>
              <p className="text-sm text-gray-500">
                {new Date(f.uploaded_at).toLocaleString()}
              </p>
            </div>

            <a
              href={f.file_url}
              target="_blank"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg"
            >
              Lihat File
            </a>
          </div>
        ))}
      </div>

    </div>
  )
}