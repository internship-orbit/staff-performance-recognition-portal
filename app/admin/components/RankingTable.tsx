"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Ranking = {
  id: number
  nama: string
  jabatan: string
  unit_kerja: string
  rata_nilai: number
}

export default function RankingTable() {

  const [data, setData] = useState<Ranking[]>([])

  useEffect(() => {
    fetchRanking()
  }, [])

  async function fetchRanking() {

    const { data, error } = await supabase
      .rpc("get_ranking_pegawai")

    if (!error && data) {
      setData(data)
    }

  }

  return (

    <div className="bg-gray-900 p-6 rounded-xl">

      <table className="w-full">

        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">Ranking</th>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Jabatan</th>
            <th className="p-3 text-left">Unit</th>
            <th className="p-3">Nilai</th>
          </tr>
        </thead>

        <tbody>

          {data.map((p, index) => (

            <tr
              key={p.id}
              className="border-b border-gray-800"
            >

              <td className="p-3 text-center font-bold">

                {index + 1}

              </td>

              <td className="p-3">
                {p.nama}
              </td>

              <td className="p-3">
                {p.jabatan}
              </td>

              <td className="p-3">
                {p.unit_kerja}
              </td>

              <td className="p-3 text-center font-semibold">

                {Number(p.rata_nilai).toFixed(2)}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}
