"use client"

import {
  Award,
  BarChart3,
  Bell,
  CheckCheck,
  ClipboardPenLine,
  FileSpreadsheet,
  Gauge,
  History,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type ComponentType } from "react"

type NavItem = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "Utama",
    items: [
      { label: "Dashboard", href: "/admin", icon: Gauge },
      { label: "Data Pegawai", href: "/admin/pegawai", icon: Users },
      { label: "Input Nilai", href: "/admin/input-nilai", icon: ClipboardPenLine },
      { label: "Ranking", href: "/admin/ranking", icon: BarChart3 },
    ],
  },
  {
    title: "Seleksi",
    items: [
      { label: "Monitoring Approval", href: "/admin/approval", icon: CheckCheck },
      { label: "Penilaian Juri", href: "/admin/penilaian-juri", icon: ShieldCheck },
      { label: "Riwayat", href: "/admin/history", icon: History },
    ],
  },
  {
    title: "Dokumen",
    items: [
      { label: "Upload Excel", href: "/admin/upload/excel", icon: FileSpreadsheet },
      { label: "Sertifikat", href: "/admin/sertifikat/upload", icon: Award },
      { label: "Notifikasi", href: "/admin/notifikasi", icon: Bell },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin"
  return pathname.startsWith(href)
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col orbit-sidebar-bg px-4 py-4 text-white">
      <div className="orbit-brand-card p-4">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/orbit-logo.png"
            alt="ORBIT Logo"
            width={56}
            height={56}
            priority
            className="h-14 w-14 object-contain"
          />

          <div className="min-w-0">
            <p className="text-2xl font-bold tracking-tight text-white">ORBIT</p>
            <p className="mt-1 text-xs leading-6 text-white/75">
              Outstanding Recognition &amp; Benchmarking Tool
            </p>
          </div>
        </div>

        <div className="orbit-institution-card mt-4 px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
            Institusi
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            BPS Provinsi Sulawesi Utara
          </p>
          <p className="mt-1 text-sm leading-6 text-white/75">
            Panel administrasi pemilihan pegawai teladan.
          </p>
        </div>
      </div>

      <nav className="mt-5 flex-1 space-y-5 overflow-y-auto pr-1">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.22em] text-white/45">
              {section.title}
            </p>

            <div className="space-y-2">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      active
                        ? "bg-white text-orbit-cosmic shadow-md"
                        : "text-white/85 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-2xl transition",
                        active
                          ? "bg-orbit-cloud-soft text-orbit-cosmic"
                          : "bg-white/10 text-white/80 group-hover:bg-white/15",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="orbit-note-card mt-4 px-3.5 py-3">
        <p className="text-sm font-bold text-orbit-gold">Catatan Profesional</p>
        <p className="mt-1.5 text-xs leading-6 text-white/80">
          Gunakan ORBIT untuk menjaga proses input nilai, nominasi, penilaian juri,
          verifikasi, dan dokumentasi penghargaan tetap konsisten dan terdokumentasi.
        </p>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-2xl border border-orbit bg-white text-orbit-cosmic shadow-md lg:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      <div
        className={[
          "fixed inset-0 z-50 bg-black/40 transition lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        ].join(" ")}
      >
        <div
          className={[
            "absolute inset-y-0 left-0 w-80 transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <SidebarContent pathname={pathname} />
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orbit-cosmic shadow-md"
          aria-label="Tutup menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </>
  )
}