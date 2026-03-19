"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function MonitoringApprovalAdmin() {
  const [totalNominasi, setTotalNominasi] = useState(0)
  const [totalJuri, setTotalJuri] = useState(0)
  const [totalPenilaian, setTotalPenilaian] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)

    const { count: nominasiCount } = await supabase
      .from("nominasi_final")
      .select("*", { count: "exact", head: true })

    const { count: juriCount } = await supabase
      .from("juri")
      .select("*", { count: "exact", head: true })

    const { count: penilaianCount } = await supabase
      .from("penilaian")
      .select("*", { count: "exact", head: true })

    setTotalNominasi(nominasiCount || 0)
    setTotalJuri(juriCount || 0)
    setTotalPenilaian(penilaianCount || 0)

    setLoading(false)
  }

  const totalSeharusnya = totalNominasi * totalJuri

  const statusSelesai =
    totalSeharusnya > 0 && totalPenilaian >= totalSeharusnya

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading monitoring status...
      </div>
    )
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">
        Monitoring Approval Verifikator
      </h1>

      <div className="bg-blue-900 p-6 rounded-xl shadow-md w-fit">
        <p className="mb-2">
          Total Pegawai Nominasi:{" "}
          <span className="font-bold">{totalNominasi}</span>
        </p>
        {statusSelesai ? (
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg font-semibold">
            Status: Verifikator selesai menilai, silakan upload sertifikat
          </div>
        ) : (
          <div className="bg-yellow-500 text-black px-4 py-3 rounded-lg font-semibold">
            Status: Dalam proses penilaian
          </div>
        )}
      </div>
    </div>
  )
}