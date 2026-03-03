"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"

type Pegawai = {
  id: string
  nip?: string
  nama: string
  tim: string
  status: string
}

const TIM_OPTIONS = [
  "Semua",
  "Umum",
  "Sosial",
  "Produksi",
  "Nerwilis",
  "IPDS",
  "Distribusi",
]

export default function KelolaPegawaiPage() {
  const [pegawai, setPegawai] = useState<Pegawai[]>([])
  const [namaBaru, setNamaBaru] = useState("")
  const [timBaru, setTimBaru] = useState("Umum")

  const [search, setSearch] = useState("")
  const [filterTim, setFilterTim] = useState("Semua")

  useEffect(() => {
    getPegawai()
  }, [])

  async function getPegawai() {
    const { data } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    setPegawai(data || [])
  }

  async function tambahPegawai() {
    if (!namaBaru.trim()) {
      alert("Nama tidak boleh kosong")
      return
    }

  await supabase.from("pegawai").insert([
    {
      nama: namaBaru,
      tim: timBaru,
      status: "aktif",
    },
  ])

    setNamaBaru("")
    getPegawai()
  }

  async function hapusPegawai(id: string) {
    const confirmDelete = confirm("Yakin ingin menghapus pegawai ini?")
    if (!confirmDelete) return

    await supabase.from("pegawai").delete().eq("id", id)
    getPegawai()
  }

  async function updateTim(id: string, timBaru: string) {
    await supabase
  .from("pegawai")
  .update({ tim: timBaru })
  .eq("id", id)
    getPegawai()
  }

  const filteredPegawai = pegawai.filter((p) => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase())
    const matchTim = filterTim === "Semua" || p.tim === filterTim
    return matchSearch && matchTim
  })

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-md">
        <h1 className="text-2xl font-bold">Kelola Pegawai</h1>
        <p className="text-sm opacity-90">
          Manage your team members efficiently.
        </p>
      </div>

      {/* FORM TAMBAH */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border space-y-4">
        <h2 className="font-semibold text-indigo-600">Tambah Pegawai Baru</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nama Pegawai"
            value={namaBaru}
            onChange={(e) => setNamaBaru(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <select
            value={timBaru}
            onChange={(e) => setTimBaru(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            {TIM_OPTIONS.filter((t) => t !== "Semua").map((tim) => (
              <option key={tim}>{tim}</option>
            ))}
          </select>

          <button
            onClick={tambahPegawai}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition"
          >
            Tambah
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border space-y-4">
        <h2 className="font-semibold">Cari & Filter</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />

          <select
            value={filterTim}
            onChange={(e) => setFilterTim(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          >
            {TIM_OPTIONS.map((tim) => (
              <option key={tim}>{tim}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DAFTAR PEGAWAI */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border">
        <h2 className="font-semibold mb-4">Daftar Pegawai</h2>

        {filteredPegawai.length === 0 && (
          <p className="text-gray-500">Tidak ada data ditemukan</p>
        )}

        <AnimatePresence>
          {filteredPegawai.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-medium">{p.nama}</p>
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                  {p.tim}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <select
                  value={p.tim}
                  onChange={(e) => updateTim(p.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {TIM_OPTIONS.filter((t) => t !== "Semua").map((tim) => (
                    <option key={tim}>{tim}</option>
                  ))}
                </select>

                <button
                  onClick={() => hapusPegawai(p.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}