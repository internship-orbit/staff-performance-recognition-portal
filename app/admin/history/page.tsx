"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

/* ================= TYPE ================= */

type Pegawai = {
  id: string
  nama: string
  tim: string
}

type HistoryItem = {
  id: string
  total_nilai: number
  tahun: number
  periode: string
  created_at: string
  pegawai: Pegawai
}

export default function HistoryPage() {

  const [data, setData] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    getHistory()
  }, [])

  async function getHistory() {

    setLoading(true)

    const { data: result, error } = await supabase
      .from("nilai_final")
      .select(`
        id,
        total_nilai,
        tahun,
        periode,
        created_at,
        pegawai:pegawai_id (
          id,
          nama,
          tim
        )
      `)
      .eq("status", "approved")
      .order("tahun", { ascending: false })

    if (error) {
      console.error("Error history:", error)
      setLoading(false)
      return
    }

    setData((result as HistoryItem[]) ?? [])
    setLoading(false)
  }

  /* ================= GROUP BY TAHUN ================= */

  const grouped = data.reduce((acc: any, item) => {

    const tahun = item.tahun

    if (!acc[tahun]) acc[tahun] = []

    acc[tahun].push(item)

    return acc

  }, {})

  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-8 py-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">
            Arsip Pegawai Teladan
          </h1>

          <p className="text-blue-300/70 mt-1">
            Hall of Excellence. Celebrating Achievement.
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-blue-300">
            Loading history...
          </div>
        )}

        {/* EMPTY */}

        {!loading && data.length === 0 && (

          <div className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-xl p-10 text-center text-blue-300">
            Belum ada pegawai teladan yang disetujui
          </div>

        )}

        {/* HISTORY */}

        <div className="space-y-10">

          {Object.entries(grouped).map(([tahun, list]: any) => (

            <div key={tahun}>

              <h2 className="text-2xl font-bold text-cyan-300 mb-6">
                Tahun {tahun}
              </h2>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {list.map((item: HistoryItem) => {

                  const pegawai = item.pegawai

                  return (

                    <div
                      key={item.id}
                      className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-xl p-6 shadow-lg flex flex-col justify-between"
                    >

                      <div className="text-xs text-cyan-300 uppercase mb-2">
                        Pegawai Teladan
                      </div>

                      <h3 className="text-xl font-semibold text-white">
                        {pegawai?.nama}
                      </h3>

                      <p className="text-sm text-blue-300 mt-1">
                        Tim {pegawai?.tim}
                      </p>

                      <div className="mt-4 text-sm text-blue-200">

                        <p>
                          Periode : {item.periode}
                        </p>

                        <p>
                          Nilai : {item.total_nilai}
                        </p>

                      </div>

                      <div className="mt-6 text-xs text-blue-400">
                        Ditetapkan :{" "}
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </div>

                    </div>

                  )

                })}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}