"use client"
import Link from "next/link"

export default function Sidebar() {
  return (
    <div className="w-64 h-screen fixed bg-[#504E76] text-white p-6">
      <h1 className="text-3xl font-bold mb-10 tracking-widest">ORBIT</h1>

      <nav className="space-y-4">
        <Link href="/admin" className="block hover:text-[#FCD9D9]">
          📊 Dashboard
        </Link>

        <Link href="/admin/ckp" className="block hover:text-[#FCD9D9]">
          📝 Input Nilai CKP
        </Link>

        <Link href="/admin/upload" className="block hover:text-[#FCD9D9]">
          📁 Upload Excel
        </Link>

        <Link href="/admin/pegawai" className="block hover:text-[#FCD9D9]">
          👥 Kelola Pegawai
        </Link>

        <Link href="/admin/laporan" className="block hover:text-[#FCD9D9]">
          📈 Generate Laporan
        </Link>
      </nav>

      <button className="absolute bottom-10 left-6 text-red-300">
        Logout
      </button>
    </div>
  )
}