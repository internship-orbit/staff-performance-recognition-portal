"use client"

import { PlusCircle, Upload, Users, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QuickActions() {
  const router = useRouter()

  return (
    <div className="
      bg-[#1f3270]/90
      border border-cyan-300/15
      rounded-2xl
      p-6
      shadow-lg
    ">
      <h3 className="text-lg font-semibold text-blue-100 mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* INPUT NILAI FINAL */}
        <button
          onClick={() => router.push("/admin/input-nilai")}
          className="
            flex items-center gap-3
            h-14 px-5
            rounded-xl
            border border-cyan-400/40
            text-cyan-200
            bg-cyan-400/5
            hover:bg-cyan-400/10
            hover:border-cyan-300
            transition-all duration-300
          "
        >
          <PlusCircle size={20} />
          Input Nilai Final
        </button>

        {/* UPLOAD EXCEL */}
        <button
          onClick={() => router.push("/admin/upload")}
          className="
            flex items-center gap-3
            h-14 px-5
            rounded-xl
            border border-red-400/40
            text-red-300
            bg-red-400/5
            hover:bg-red-400/10
            hover:border-red-300
            transition-all duration-300
          "
        >
          <Upload size={20} />
          Upload Excel
        </button>

        {/* KELOLA PEGAWAI */}
        <button
          onClick={() => router.push("/admin/pegawai")}
          className="
            flex items-center gap-3
            h-14 px-5
            rounded-xl
            border border-blue-300/40
            text-blue-200
            bg-blue-400/5
            hover:bg-blue-400/10
            hover:border-blue-300
            transition-all duration-300
          "
        >
          <Users size={20} />
          Kelola Pegawai
        </button>

        {/* GENERATE LAPORAN */}
        <button
          onClick={() => router.push("/admin/laporan")}
          className="
            flex items-center gap-3
            h-14 px-5
            rounded-xl
            border border-emerald-400/40
            text-emerald-300
            bg-emerald-400/5
            hover:bg-emerald-400/10
            hover:border-emerald-300
            transition-all duration-300
          "
        >
          <FileText size={20} />
          Generate Laporan
        </button>

      </div>
    </div>
  )
}