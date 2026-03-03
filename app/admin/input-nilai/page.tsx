"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const BOBOT_KIPAPP = 2

export default function InputNilaiPage() {
  const router = useRouter()

  const [pegawai, setPegawai] = useState<any[]>([])
  const [dataNilai, setDataNilai] = useState<any[]>([])

  const [selectedPegawai, setSelectedPegawai] = useState("")
  const [nilaiFinal, setNilaiFinal] = useState("")
  const [jumlahKipapp, setJumlahKipapp] = useState("")
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPegawai()
    getDataNilai()
  }, [])

  useEffect(() => {
    const nFinal = Number(nilaiFinal) || 0
    const kipapp = Number(jumlahKipapp) || 0
    setTotal(nFinal + kipapp * BOBOT_KIPAPP)
  }, [nilaiFinal, jumlahKipapp])

  async function getPegawai() {
    const { data } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    setPegawai(data || [])
  }

  async function getDataNilai() {
    const { data } = await supabase
      .from("nilai_final")
      .select(`
        id,
        nilai,
        jumlah_kipapp,
        total_nilai,
        pegawai (
          id,
          nama,
          tim
        )
      `)
      .order("total_nilai", { ascending: false })

    setDataNilai(data || [])
  }

  async function simpanNilai() {
    if (!selectedPegawai || !nilaiFinal || !jumlahKipapp) {
      alert("Semua field harus diisi")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("nilai_final")
      .upsert(
        {
          pegawai_id: selectedPegawai,
          nilai: Number(nilaiFinal),
          jumlah_kipapp: Number(jumlahKipapp),
          total_nilai: total,
        },
        { onConflict: "pegawai_id" }
      )

    setLoading(false)

    if (!error) {
      alert("Data berhasil disimpan / diperbarui!")
      setSelectedPegawai("")
      setNilaiFinal("")
      setJumlahKipapp("")
      getDataNilai()
    } else {
      alert("Terjadi kesalahan")
    }
  }

  function editData(item: any) {
    setSelectedPegawai(item.pegawai.id)
    setNilaiFinal(item.nilai)
    setJumlahKipapp(item.jumlah_kipapp)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-10">

      {/* FORM INPUT */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-indigo-600">
          Input Nilai Final
        </h1>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Nama Pegawai
          </label>
          <select
            value={selectedPegawai}
            onChange={(e) => setSelectedPegawai(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">-- Pilih Pegawai --</option>
            {pegawai.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama} - {p.tim}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Nilai Final
          </label>
          <input
            type="number"
            value={nilaiFinal}
            onChange={(e) => setNilaiFinal(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Jumlah Kegiatan KIPAPP
          </label>
          <input
            type="number"
            value={jumlahKipapp}
            onChange={(e) => setJumlahKipapp(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
          <p className="font-semibold text-indigo-600">
            Total Nilai Otomatis:
          </p>
          <p className="text-2xl font-bold">
            {total}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={simpanNilai}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Menyimpan..." : "Simpan / Update"}
          </button>

          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* LIST DATA SUDAH DIINPUT */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-indigo-600">
          Data Yang Sudah Diinput
        </h2>

        {dataNilai.length === 0 && (
          <p className="text-gray-500">
            Belum ada data nilai
          </p>
        )}

        {dataNilai.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-semibold">
                {item.pegawai.nama}
              </p>
              <p className="text-sm text-gray-600">
                Nilai: {item.nilai} | KIPAPP: {item.jumlah_kipapp} | Total: {item.total_nilai}
              </p>
            </div>

            <button
              onClick={() => editData(item)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}