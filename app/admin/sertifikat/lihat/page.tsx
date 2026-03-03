"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function LihatSertifikatPage() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    getSertifikat()
  }, [])

  async function getSertifikat() {
    const { data } = await supabase
      .from("sertifikat")
      .select(`
        id,
        periode,
        tahun,
        file_url,
        pegawai (
          nama,
          tim
        )
      `)
      .order("created_at", { ascending: false })

    setData(data || [])
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="bg-white rounded-2xl shadow-sm p-8 border max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-indigo-600">
          Lihat Sertifikat
        </h1>

        {data.length === 0 && (
          <p className="text-gray-500">Belum ada sertifikat</p>
        )}

        {data.map((item) => (
          <div
            key={item.id}
            className="mb-6 p-4 bg-indigo-50 rounded-xl"
          >
            <h3 className="font-bold text-indigo-700">
              {item.pegawai.nama}
            </h3>

            <p className="text-sm text-gray-600">
              {item.periode} - {item.tahun}
            </p>

            <a
              href={item.file_url}
              target="_blank"
              className="text-indigo-600 underline mt-2 inline-block"
            >
              Lihat Sertifikat
            </a>
          </div>
        ))}

      </div>

    </div>
  )
}