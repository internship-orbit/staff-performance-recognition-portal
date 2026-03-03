"use client"

import Link from "next/link"
import { useState } from "react"
import {
  LayoutDashboard,
  FileText,
  Upload,
  Users,
  Award,
  CheckCircle,
  History,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

export default function Sidebar() {
  const [openCertificate, setOpenCertificate] = useState(false)

  return (
    <div className="w-64 min-h-screen bg-linear-to-b from-[#0f1c3f] to-[#132a5c] text-blue-100 p-6 fixed left-0 top-0 border-r border-cyan-400/10 shadow-[0_0_40px_rgba(0,198,255,0.08)]">

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(0,198,255,0.6)]"></div>
        <h2 className="text-xl font-bold tracking-widest text-cyan-300">
          ORBIT
        </h2>
      </div>

      <nav className="space-y-3 text-sm">

        {/* Dashboard */}
        <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {/* Input Nilai Final */}
        <Link href="/admin/input-nilai" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all">
          <FileText size={18} />
          Input Nilai Final
        </Link>

        {/* Upload Excel */}
        <Link href="/admin/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all">
          <Upload size={18} />
          Upload Excel
        </Link>

        {/* Kelola Pegawai */}
        <Link href="/admin/pegawai" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all">
          <Users size={18} />
          Kelola Pegawai
        </Link>

        {/* Generate Laporan */}
        <Link href="/admin/laporan" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all">
          <FileText size={18} />
          Generate Laporan
        </Link>

        {/* Penilaian Juri */}
        <Link href="/admin/penilaian-juri" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all">
          <Award size={18} />
          Penilaian Juri
        </Link>

        {/* Sertifikat Dropdown */}
        <div>
          <button
            onClick={() => setOpenCertificate(!openCertificate)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <Award size={18} />
              Sertifikat
            </div>
            {openCertificate ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {openCertificate && (
            <div className="ml-7 mt-2 space-y-2 text-blue-300">
              <Link href="/admin/sertifikat/upload" className="block hover:text-cyan-300 transition">
                Upload Sertifikat
              </Link>
              <Link href="/admin/sertifikat/lihat" className="block hover:text-cyan-300 transition">
                Lihat Sertifikat
              </Link>
            </div>
          )}
        </div>

        {/* Approval */}
        <Link href="/admin/approval" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all">
          <CheckCircle size={18} />
          Approval
        </Link>

        {/* Arsip / History */}
        <Link href="/admin/history" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition-all">
          <History size={18} />
          Arsip / History
        </Link>

      </nav>
    </div>
  )
}
