"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"

export default function PenilaianJuriPage() {
  const [penilaian, setPenilaian] = useState<any[]>([])

  useEffect(() => {
    fetchPenilaian()
  }, [])

  async function fetchPenilaian() {
    const { data, error } = await supabase
      .from("penilaian")
      .select(`
        id,
        status,
        total_nilai,
        pegawai (
          nama
        )
      `)

    if (!error) setPenilaian(data || [])
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Penilaian Juri
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        {penilaian.length === 0 && (
          <p className="text-gray-500">Belum ada data penilaian</p>
        )}

        <div className="space-y-4">
          {penilaian.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-semibold">
                  {item.pegawai?.nama}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {item.status}
                </p>
              </div>

              <p className="font-bold text-indigo-600">
                {item.total_nilai ?? 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}