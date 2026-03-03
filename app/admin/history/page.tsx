"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function HistoryPage() {
  const [data, setData] = useState<any[]>([])
  const [tahunFilter, setTahunFilter] = useState("all")

  useEffect(() => {
    getHistory()
  }, [])

  async function getHistory() {
    const { data } = await supabase
      .from("nilai_final")
      .select(`
        id,
        total_nilai,
        periode,
        tahun,
        pegawai (
          nama,
          tim
        )
      `)
      .eq("status", "approved")
      .order("tahun", { ascending: false })

    setData(data || [])
  }

  const filteredData =
    tahunFilter === "all"
      ? data
      : data.filter((d) => d.tahun === Number(tahunFilter))

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-indigo-600">
          Arsip Pegawai Teladan
        </h1>

        {/* FILTER */}
        <div className="mb-6">
          <select
            value={tahunFilter}
            onChange={(e) => setTahunFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">Semua Tahun</option>
            {[...new Set(data.map((d) => d.tahun))].map((tahun) => (
              <option key={tahun} value={tahun}>
                {tahun}
              </option>
            ))}
          </select>
        </div>

        {filteredData.length === 0 && (
          <p className="text-gray-500">
            Belum ada arsip pegawai teladan
          </p>
        )}

        {filteredData.map((item) => (
          <div
            key={item.id}
            className="mb-6 p-4 bg-indigo-50 rounded-xl"
          >
            <h3 className="font-bold text-indigo-700 uppercase">
              {item.periode} - {item.tahun}
            </h3>

            <p className="text-lg font-semibold mt-2">
              {item.pegawai.nama}
            </p>

            <p className="text-sm text-gray-600">
              Tim: {item.pegawai.tim}
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