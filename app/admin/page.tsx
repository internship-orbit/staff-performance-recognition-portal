"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"
import StatsCard from "./components/statscard"
import QuickActions from "./components/quickactions"
import { Users, FileCheck, AlertCircle, Activity } from "lucide-react"

export default function AdminPage() {
  const [pegawai, setPegawai] = useState<any[]>([])
  const [ckpData, setCkpData] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    await getPegawai()
    await getCKP()
  }

  async function getPegawai() {
    const { data, error } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    if (!error) setPegawai(data || [])
  }

  async function getCKP() {
    const { data, error } = await supabase
      .from("ckp")
      .select(`
        id,
        nilai_kuantitas,
        nilai_kualitas,
        nilai_waktu,
        nilai_biaya,
        pegawai (
          nama
        )
      `)
      .order("created_at", { ascending: false })

    if (!error) setCkpData(data || [])
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-500">
          Sistem Pemilihan Pegawai Teladan
        </p>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <StatsCard 
          title="Total Pegawai"
          value={pegawai.length}
          subtitle="Data terdaftar"
          icon={<Users className="text-indigo-600" size={22} />}
          color="text-indigo-600"
        />

        <StatsCard 
          title="Total Data CKP"
          value={ckpData.length}
          subtitle="Sudah diinput"
          icon={<FileCheck className="text-green-600" size={22} />}
          color="text-green-600"
        />

        <StatsCard 
          title="Belum Dinilai"
          value={pegawai.length - ckpData.length}
          subtitle="Perlu input"
          icon={<AlertCircle className="text-orange-500" size={22} />}
          color="text-orange-500"
        />

        <StatsCard 
          title="Status Sistem"
          value="Aktif"
          subtitle="Semua layanan berjalan"
          icon={<Activity className="text-emerald-600" size={22} />}
          color="text-emerald-600"
        />

      </div>
        <QuickActions />
        
      {/* MAIN GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LIST PEGAWAI */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Daftar Pegawai</h2>

          {pegawai.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>{p.nama}</span>
              <button
                onClick={() => router.push(`/admin/ckp/${p.id}`)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Input CKP
              </button>
            </div>
          ))}
        </div>

        {/* DATA CKP */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Data CKP Yang Sudah Diinput
          </h2>

          {ckpData.length === 0 && (
            <p className="text-gray-500">Belum ada data CKP</p>
          )}

          {ckpData.map((c) => (
            <div key={c.id} className="border-b py-3">
              <p className="font-semibold">{c.pegawai?.nama}</p>
              <p className="text-sm text-gray-600">
                Kuantitas: {c.nilai_kuantitas} |{" "}
                Kualitas: {c.nilai_kualitas} |{" "}
                Waktu: {c.nilai_waktu} |{" "}
                Biaya: {c.nilai_biaya}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}