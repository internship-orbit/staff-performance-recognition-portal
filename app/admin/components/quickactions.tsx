import {
  ArrowRight,
  ClipboardPenLine,
  FileSpreadsheet,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Kelola Data Pegawai",
    description: "Perbarui kandidat, unit kerja, dan informasi dasar pegawai.",
    href: "/admin/pegawai",
    icon: Users,
  },
  {
    title: "Input Nilai Admin",
    description: "Masukkan nilai final admin dan jumlah data pendukung sesuai periode.",
    href: "/admin/input-nilai",
    icon: ClipboardPenLine,
  },
  {
    title: "Lihat Ranking",
    description: "Tinjau ranking hasil input admin sebelum masuk nominasi final.",
    href: "/admin/ranking",
    icon: Trophy,
  },
  {
    title: "Monitoring Juri",
    description: "Pantau progres penilaian juri tanpa mengubah flow database yang ada.",
    href: "/admin/penilaian-juri",
    icon: ShieldCheck,
  },
  {
    title: "Upload Excel",
    description: "Unggah file pendukung penilaian dan dokumentasi proses seleksi.",
    href: "/admin/upload/excel",
    icon: FileSpreadsheet,
  },
]

export default function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon

        return (
          <Link
            key={action.href}
            href={action.href}
            className="orbit-panel-soft group p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--orbit-cosmic) 0%, var(--orbit-plum) 100%)",
                }}
              >
                <Icon className="h-5 w-5" />
              </div>

              <ArrowRight className="h-4 w-4 text-orbit-muted transition group-hover:translate-x-1" />
            </div>

            <h3 className="mt-5 text-base font-bold text-orbit-text">{action.title}</h3>
            <p className="mt-2 text-sm leading-7 text-orbit-muted">
              {action.description}
            </p>
          </Link>
        )
      })}
    </div>
  )
}