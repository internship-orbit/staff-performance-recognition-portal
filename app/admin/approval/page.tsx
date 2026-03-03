"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ApprovalPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    const { data } = await supabase
      .from("nilai_final")
      .select(`
        id,
        total_nilai,
        status,
        pegawai (
          nama,
          tim
        )
      `)
      .order("total_nilai", { ascending: false })

    setData(data || [])
  }

  async function updateStatus(id: string, newStatus: string) {
    setLoading(true)

    await supabase
      .from("nilai_final")
      .update({ status: newStatus })
      .eq("id", id)

    await getData()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-indigo-600">
          Approval Nominasi
        </h1>

        {data.length === 0 && (
          <p className="text-gray-500">
            Belum ada data untuk approval
          </p>
        )}

        {data.map((item) => (
          <div
            key={item.id}
            className="mb-6 p-4 bg-indigo-50 rounded-xl"
          >
            <h3 className="font-bold text-indigo-700 uppercase">
              {item.pegawai.tim}
            </h3>

            <p className="text-lg font-semibold mt-2">
              {item.pegawai.nama}
            </p>

            <p className="text-sm text-gray-600 mb-4">
              Total Nilai: {item.total_nilai}
            </p>

            <p className="mb-3">
              Status:
              {" "}
              <span className={
                item.status === "approved"
                  ? "text-green-600 font-bold"
                  : item.status === "rejected"
                  ? "text-red-600 font-bold"
                  : "text-orange-500 font-bold"
              }>
                {item.status.toUpperCase()}
              </span>
            </p>

            <div className="flex gap-3">

              <button
                disabled={loading}
                onClick={() => updateStatus(item.id, "approved")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg"
              >
                Approve
              </button>

              <button
                disabled={loading}
                onClick={() => updateStatus(item.id, "rejected")}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg"
              >
                Reject
              </button>

            </div>
          </div>
        ))}

      </div>

    </div>
  )
}