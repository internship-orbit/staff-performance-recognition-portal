"use client"

import { Bell, CalendarDays } from "lucide-react"
import { usePathname } from "next/navigation"

const pageTitleMap: Record<string, string> = {
  "/admin": "Dashboard Admin",
  "/admin/pegawai": "Data Pegawai",
  "/admin/input-nilai": "Input Nilai Admin",
  "/admin/ranking": "Ranking Pegawai",
  "/admin/approval": "Monitoring Approval",
  "/admin/penilaian-juri": "Penilaian Juri",
  "/admin/upload/excel": "Upload Excel",
  "/admin/sertifikat/upload": "Upload Sertifikat",
  "/admin/sertifikat/lihat": "Lihat Sertifikat",
  "/admin/history": "Riwayat Penghargaan",
  "/admin/laporan": "Laporan",
  "/admin/notifikasi": "Notifikasi",
}

function getPageTitle(pathname: string) {
  return pageTitleMap[pathname] || "Panel Admin ORBIT"
}

function formatToday() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date())
}

export default function Header() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-orbit bg-white/90 backdrop-blur lg:left-80">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between gap-4 px-4 pl-16 md:px-6 md:pl-20 lg:px-8 lg:pl-8">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orbit-sky">
            Outstanding Recognition &amp; Benchmarking Tool
          </p>
          <h1 className="truncate text-lg font-bold text-orbit-text md:text-xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-orbit bg-white px-4 py-2 text-sm text-orbit-text shadow-sm md:flex">
            <CalendarDays className="h-4 w-4 text-orbit-sky" />
            <span>{formatToday()}</span>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orbit bg-white text-orbit-text shadow-sm transition hover:bg-orbit-cloud-soft"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-orbit bg-white px-3 py-2 shadow-sm">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--orbit-cosmic) 0%, var(--orbit-plum) 100%)",
              }}
            >
              AD
            </div>

            <div className="hidden text-sm sm:block">
              <p className="font-bold text-orbit-text">Admin ORBIT</p>
              <p className="text-orbit-muted">BPS Provinsi Sulawesi Utara</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}