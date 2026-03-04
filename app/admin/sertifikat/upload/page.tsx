"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function UploadSertifikatPage() {
  const [pegawai, setPegawai] = useState<any[]>([])
  const [selectedPegawai, setSelectedPegawai] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [periode, setPeriode] = useState("Triwulan 1")
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPegawai()
  }, [])

  async function getPegawai() {
    const { data } = await supabase
      .from("pegawai")
      .select("id, nama")
      .order("nama")

    setPegawai(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!file || !selectedPegawai) {
      alert("Lengkapi data terlebih dahulu")
      return
    }

    setLoading(true)

    const fileName = `${selectedPegawai}-${Date.now()}-${file.name}`

    // Upload ke storage
    const { error: uploadError } = await supabase.storage
      .from("sertifikat")
      .upload(fileName, file)

    if (uploadError) {
      alert("Gagal upload file")
      setLoading(false)
      return
    }

    // Ambil public URL
    const { data: publicUrlData } = supabase.storage
      .from("sertifikat")
      .getPublicUrl(fileName)

    const fileUrl = publicUrlData.publicUrl

    // Insert ke tabel
    const { error: insertError } = await supabase
      .from("sertifikat")
      .insert([
        {
          pegawai_id: selectedPegawai,
          periode,
          tahun,
          file_url: fileUrl,
        },
      ])

    if (insertError) {
      alert("Gagal menyimpan data")
      setLoading(false)
      return
    }

    alert("Sertifikat berhasil disubmit")

    // Reset form
    setFile(null)
    setSelectedPegawai("")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-indigo-600">
          Upload Sertifikat
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <select
            value={selectedPegawai}
            onChange={(e) => setSelectedPegawai(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-gray-600"
          >
            <option value="">Pilih Pegawai</option>
            {pegawai.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>

          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-gray-600"
          >
            <option>Triwulan 1</option>
            <option>Triwulan 2</option>
            <option>Triwulan 3</option>
            <option>Triwulan 4</option>
          </select>

          <input
            type="number"
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2 text-gray-600"
          />

          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded-lg px-4 py-2 text-gray-600"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

      </div>

    </div>
  )
}