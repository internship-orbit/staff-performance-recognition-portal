"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BellRing,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import QuickActions from "./components/quickactions"
import RankingTable from "./components/RankingTable"
import StatsCard from "./components/statscard"
import {
  EmptyState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "./components/ui"

type RankingRow = {
  id: string
  nama: string
  nip?: string
  unit: string
  nilai: number
}

type HistoryRow = {
  id: string
  nama: string
  tim: string
  total_nilai: number
  triwulan: number
  tahun: number
  periode_label?: string
}

type NotificationRow = {
  id: string
  judul: string
  pesan: string
  tipe?: string
  deadline?: string
  role_target?: string
}

type OpenPeriod = {
  bulan: number
  tahun: number
  status: string
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)

  const [pegawaiCount, setPegawaiCount] = useState(0)
  const [nilaiAdminCount, setNilaiAdminCount] = useState(0)
  const [nominasiCount, setNominasiCount] = useState(0)
  const [penilaianJuriCount, setPenilaianJuriCount] = useState(0)
  const [verifikasiPendingCount, setVerifikasiPendingCount] = useState(0)
  const [historyCount, setHistoryCount] = useState(0)

  const [openPeriod, setOpenPeriod] = useState<OpenPeriod | null>(null)
  const [rankingRows, setRankingRows] = useState<RankingRow[]>([])
  const [historyRows, setHistoryRows] = useState<HistoryRow[]>([])
  const [notifications, setNotifications] = useState<NotificationRow[]>([])

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)

      try {
        const [
          pegawaiRes,
          nilaiAdminRes,
          nominasiRes,
          penilaianRes,
          verifikasiRes,
          historyRes,
          periodeRes,
          rankingRes,
          recentHistoryRes,
          notifRes,
        ] = await Promise.all([
          supabase.from("pegawai").select("*", { count: "exact", head: true }),
          supabase.from("penilaian_admin").select("*", { count: "exact", head: true }),
          supabase.from("nominasi_final").select("*", { count: "exact", head: true }),
          supabase.from("penilaian").select("*", { count: "exact", head: true }),
          supabase
            .from("verifikasi")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("history_penghargaan")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("periode")
            .select("bulan, tahun, status")
            .eq("status", "open")
            .order("tahun", { ascending: false })
            .order("bulan", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase.rpc("get_ranking_live"),
          supabase
            .from("history_penghargaan")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("notifikasi")
            .select("id, judul, pesan, tipe, deadline, role_target")
            .order("created_at", { ascending: false })
            .limit(4),
        ])

        setPegawaiCount(pegawaiRes.count || 0)
        setNilaiAdminCount(nilaiAdminRes.count || 0)
        setNominasiCount(nominasiRes.count || 0)
        setPenilaianJuriCount(penilaianRes.count || 0)
        setVerifikasiPendingCount(verifikasiRes.count || 0)
        setHistoryCount(historyRes.count || 0)

        setOpenPeriod((periodeRes.data as OpenPeriod | null) || null)

        const normalizedRanking: RankingRow[] = (
          (rankingRes.data as
            | Array<{
                pegawai_id: string
                nama: string
                tim: string
                nilai: number
              }>
            | null) || []
        ).map((item) => ({
          id: item.pegawai_id,
          nama: item.nama,
          unit: item.tim || "-",
          nilai: Number(item.nilai || 0),
        }))

        setRankingRows(normalizedRanking)
        setHistoryRows(((recentHistoryRes.data as HistoryRow[] | null) || []))
        setNotifications(((notifRes.data as NotificationRow[] | null) || []))
      } catch (error) {
        console.error("Gagal memuat dashboard admin:", error)
        setRankingRows([])
        setHistoryRows([])
        setNotifications([])
        setOpenPeriod(null)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const flowStatus = useMemo(
    () => [
      {
        title: "Input Nilai Admin",
        description:
          "Admin mengisi nilai final admin dan jumlah data pendukung pada periode berjalan.",
        value: nilaiAdminCount,
        tone: nilaiAdminCount > 0 ? "success" : "warning",
        label: nilaiAdminCount > 0 ? "Sudah berjalan" : "Belum ada input",
      },
      {
        title: "Nominasi Final",
        description:
          "Pegawai dengan hasil terbaik masuk ke nominasi_final untuk lanjut ke tahap juri.",
        value: nominasiCount,
        tone: nominasiCount > 0 ? "success" : "warning",
        label: nominasiCount > 0 ? "Siap dinilai juri" : "Belum terbentuk",
      },
      {
        title: "Penilaian Juri",
        description:
          "Juri memberikan penilaian pada kandidat yang sudah masuk nominasi final.",
        value: penilaianJuriCount,
        tone: penilaianJuriCount > 0 ? "info" : "warning",
        label: penilaianJuriCount > 0 ? "Sedang berjalan" : "Menunggu input juri",
      },
      {
        title: "Verifikasi Akhir",
        description:
          "Verifikator menetapkan status kandidat, lalu hasil akhir masuk ke riwayat penghargaan.",
        value: verifikasiPendingCount,
        tone: verifikasiPendingCount > 0 ? "warning" : "success",
        label: verifikasiPendingCount > 0 ? "Ada yang menunggu" : "Sudah tertangani",
      },
    ],
    [nilaiAdminCount, nominasiCount, penilaianJuriCount, verifikasiPendingCount]
  )

  function formatPeriodLabel(period: OpenPeriod | null) {
    if (!period) return "Belum ada periode aktif"
    return `Bulan ${period.bulan} / ${period.tahun}`
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Admin ORBIT"
        description="Panel pengelolaan utama untuk memantau kesiapan data, progres seleksi, penilaian juri, verifikasi, dan dokumentasi penghargaan tanpa mengubah flow database yang sudah dibangun."
      />

      {loading ? (
        <LoadingState label="Memuat dashboard admin..." />
      ) : (
        <>
          <div className="orbit-stat-grid">
            <StatsCard
              title="Total Pegawai"
              value={pegawaiCount}
              subtitle="Jumlah pegawai yang tercatat pada basis kandidat."
              icon={Users}
            />
            <StatsCard
              title="Input Nilai Admin"
              value={nilaiAdminCount}
              subtitle="Data dari tabel penilaian_admin pada periode berjalan."
              icon={ClipboardCheck}
            />
            <StatsCard
              title="Nominasi Final"
              value={nominasiCount}
              subtitle="Kandidat yang sudah masuk ke tahap penilaian juri."
              icon={Trophy}
            />
            <StatsCard
              title="Penilaian Juri"
              value={penilaianJuriCount}
              subtitle="Total penilaian yang sudah masuk dari panel juri."
              icon={ShieldCheck}
            />
            <StatsCard
              title="Verifikasi Pending"
              value={verifikasiPendingCount}
              subtitle="Data pada tabel verifikasi dengan status pending."
              icon={CheckCircle2}
            />
            <StatsCard
              title="Riwayat Penghargaan"
              value={historyCount}
              subtitle="Dokumen hasil yang sudah masuk ke history_penghargaan."
              icon={Medal}
            />
          </div>

          <SectionCard
            title="Aksi Cepat"
            description="Akses langsung ke halaman operasional yang paling sering dipakai admin."
          >
            <QuickActions />
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <SectionCard
                title="Top Ranking Pegawai"
                description="Ringkasan ranking live berdasarkan function database get_ranking_live()."
              >
                <RankingTable rows={rankingRows} />
              </SectionCard>
            </div>

            <div className="xl:col-span-1">
              <SectionCard
                title="Periode Aktif & Status Proses"
                description="Ringkasan tahapan yang tetap mengikuti alur kerja lama project."
              >
                <div className="space-y-4">
                  <div
                    className="rounded-3xl p-5 text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--orbit-cosmic) 0%, var(--orbit-plum) 100%)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
                          Periode Aktif
                        </p>
                        <p className="mt-2 text-2xl font-bold">{formatPeriodLabel(openPeriod)}</p>
                        <p className="mt-2 text-sm leading-7 text-white/78">
                          Status: {openPeriod?.status || "Belum tersedia"}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                        <CalendarRange className="h-5 w-5 text-orbit-gold" />
                      </div>
                    </div>
                  </div>

                  {flowStatus.map((item) => (
                    <div key={item.title} className="rounded-3xl border border-orbit bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-orbit-text">{item.title}</p>
                          <p className="mt-2 text-sm leading-7 text-orbit-muted">
                            {item.description}
                          </p>
                        </div>

                        <StatusBadge
                          tone={item.tone as "success" | "warning" | "danger" | "info"}
                        >
                          {item.label}
                        </StatusBadge>
                      </div>

                      <div className="mt-3 text-sm font-semibold text-orbit-cosmic">
                        Total data: {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard
              title="Riwayat Penetapan Terakhir"
              description="Data terbaru dari tabel history_penghargaan."
            >
              {historyRows.length === 0 ? (
                <EmptyState
                  title="Belum ada riwayat penghargaan"
                  description="Riwayat akan tampil setelah proses verifikasi dan penetapan selesai dilakukan."
                />
              ) : (
                <div className="space-y-3">
                  {historyRows.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-orbit bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-orbit-text">{item.nama}</p>
                          <p className="mt-1 text-sm text-orbit-muted">
                            {item.tim} • {item.periode_label || `Triwulan ${item.triwulan}`}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-orbit-cosmic">
                            {Number(item.total_nilai || 0).toFixed(2)}
                          </p>
                          <p className="text-sm text-orbit-muted">{item.tahun}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Notifikasi & Insight Admin"
              description="Tetap terintegrasi dengan tabel notifikasi."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-orbit bg-orbit-gold-soft p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
                      <Sparkles className="h-5 w-5 text-orbit-gold" />
                    </div>

                    <div>
                      <p className="text-base font-bold text-orbit-text">Insight ORBIT</p>
                      <p className="mt-2 text-sm leading-7 text-orbit-muted">
                        Flow tetap sama:
                        input nilai admin → nominasi final → penilaian juri →
                        verifikasi → riwayat penghargaan / sertifikat.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <EmptyState
                      title="Belum ada notifikasi"
                      description="Data dari tabel notifikasi akan muncul di sini untuk membantu admin memantau deadline dan pengumuman."
                    />
                  ) : (
                    notifications.map((item) => (
                      <div key={item.id} className="rounded-3xl border border-orbit bg-white p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-orbit-cloud-soft">
                            <BellRing className="h-4 w-4 text-orbit-sky" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-bold text-orbit-text">{item.judul}</p>
                              <StatusBadge tone="info">{item.tipe || "info"}</StatusBadge>
                            </div>

                            <p className="mt-2 text-sm leading-7 text-orbit-muted">
                              {item.pesan}
                            </p>

                            <div className="mt-3 text-xs font-medium text-orbit-sky">
                              {item.deadline
                                ? `Deadline: ${item.deadline}`
                                : `Target: ${item.role_target || "semua role"}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  )
}