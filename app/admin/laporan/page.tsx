"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function LaporanPage() {
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [triwulan, setTriwulan] = useState("1")
  const [hasil, setHasil] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  function getRangeBulan() {
    switch (triwulan) {
      case "1":
        return ["01", "03"]
      case "2":
        return ["04", "06"]
      case "3":
        return ["07", "09"]
      case "4":
        return ["10", "12"]
      default:
        return ["01", "03"]
    }
  }

  async function generateLaporan() {
    setLoading(true)

    const [startMonth, endMonth] = getRangeBulan()

    const startDate = `${tahun}-${startMonth}-01`
    const endDate = `${tahun}-${endMonth}-31`

    const { data } = await supabase
      .from("nilai_final")
      .select(`
        total_nilai,
        periode_bulan,
        pegawai (
          id,
          nama,
          tim
        )
      `)
      .gte("periode_bulan", startDate)
      .lte("periode_bulan", endDate)
      .order("total_nilai", { ascending: false })

    if (!data) {
      setLoading(false)
      return
    }

    // Ambil terbaik per tim
    const bestPerTim: any = {}

    data.forEach((item: any) => {
      const tim = item.pegawai.tim
      if (!bestPerTim[tim]) {
        bestPerTim[tim] = item
      }
    })

    setHasil(Object.values(bestPerTim))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">

      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-indigo-600">
          Generate Laporan Triwulanan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          <div>
            <label className="block mb-2 font-medium">Tahun</label>
            <input
              type="number"
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Triwulan</label>
            <select
              value={triwulan}
              onChange={(e) => setTriwulan(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="1">Triwulan 1 (Jan–Mar)</option>
              <option value="2">Triwulan 2 (Apr–Jun)</option>
              <option value="3">Triwulan 3 (Jul–Sep)</option>
              <option value="4">Triwulan 4 (Okt–Des)</option>
            </select>
          </div>

        </div>

        <button
          onClick={generateLaporan}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Memproses..." : "Generate"}
        </button>
      </div>

      {/* HASIL LAPORAN */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-4xl mx-auto">

        <h2 className="text-xl font-bold mb-6 text-indigo-600">
          Hasil Rekapan Terbaik Per Tim
        </h2>

        {hasil.length === 0 && (
          <p className="text-gray-500">
            Belum ada laporan
          </p>
        )}

        {hasil.map((item: any) => (
          <div
            key={item.pegawai.id}
            className="mb-6 p-4 bg-indigo-50 rounded-xl"
          >
            <h3 className="font-bold text-indigo-700 uppercase">
              {item.pegawai.tim}
            </h3>

            <p className="text-lg font-semibold mt-2">
              {item.pegawai.nama}
            </p>

            <p className="text-sm text-gray-600">
              Total Nilai: {item.total_nilai}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}