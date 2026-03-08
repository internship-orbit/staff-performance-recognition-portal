"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import StatsCard from "./components/statscard"
import Header from "./components/header"
import QuickActions from "./components/quickactions"
import { Users, FileCheck, AlertCircle, Activity } from "lucide-react"

export default function AdminPage() {

  /* ================== STATE ================== */
  const [pegawai, setPegawai] = useState<any[]>([])
  const [ckpData, setCkpData] = useState<any[]>([])
  const [nominasi, setNominasi] = useState<any[]>([])
  const [juriDone, setJuriDone] = useState(0)
  const [juriTotal, setJuriTotal] = useState(0)
  const [nominasiFinal, setNominasiFinal] = useState<any[]>([])

  /* ================== LOAD DATA ================== */
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    await getPegawai()
    await getCKP()
    await getMonitoringJuri()
    await getNominasiPerTim()
  }

  async function getPegawai() {
    const { data } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    setPegawai(data || [])
  }

  async function getCKP() {
    const { data } = await supabase
      .from("ckp")
      .select(`
        id,
        nilai_kuantitas,
        nilai_kualitas,
        nilai_waktu,
        nilai_biaya,
        pegawai ( nama )
      `)
      .order("created_at", { ascending: false })

    setCkpData(data || [])
  }

  async function getMonitoringJuri() {
    const { data } = await supabase
      .from("penilaian")
      .select("status")

    if (data) {
      const done = data.filter((d) => d.status === "done").length
      setJuriDone(done)
      setJuriTotal(data.length)
    }
  }

  async function getNominasiPerTim() {
    const { data } = await supabase
      .from("nilai_final")
      .select(`
        total_nilai,
        pegawai ( id, nama, tim )
      `)
      .order("total_nilai", { ascending: false })

    if (!data) return

    const bestPerTim: any = {}

    data.forEach((item: any) => {
      const tim = item.pegawai.tim
      if (!bestPerTim[tim]) bestPerTim[tim] = item
    })

    setNominasi(Object.values(bestPerTim))
  }

  /* ================== HANDLE FINAL ================== */
  function handleSetFinal(item: any) {
    if (!nominasiFinal.find((n) => n.pegawai.id === item.pegawai.id)) {
      setNominasiFinal([...nominasiFinal, item])
    }
  }

  function handleRemoveFinal(id: string) {
    setNominasiFinal(
      nominasiFinal.filter((n) => n.pegawai.id !== id)
    )
  }

  /* ================== SUBMIT KE APPROVAL ================== */
  async function handleSubmitFinal() {
    if (nominasiFinal.length === 0) {
      alert("Belum ada nominasi final")
      return
    }

    const payload = nominasiFinal.map((item: any) => ({
      pegawai_id: item.pegawai.id,
      tim: item.pegawai.tim,
      total_nilai: item.total_nilai
    }))

    const { error } = await supabase
      .from("nominasi_final")
      .insert(payload)

    if (error) {
      alert("Gagal submit ke approval")
      console.error("Submit error:", error)
      return
    }

    alert("Berhasil dikirim ke Penilaian Juri")
    setNominasiFinal([])
  }

  /* ================== UI ================== */
  return (
    <div className="min-h-screen bg-[#0b1635] text-blue-100 space-y-8">

      <Header
        title="Admin Board"
        subtitle="Manage. Evaluate. Recognize."
      />

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pegawai"
          value={pegawai.length}
          subtitle="Data terdaftar"
          icon={<Users className="text-cyan-400" size={22} />}
          color="text-cyan-400"
        />
        <StatsCard
          title="Total Data CKP"
          value={ckpData.length}
          subtitle="Sudah diinput"
          icon={<FileCheck className="text-green-400" size={22} />}
          color="text-green-400"
        />
        <StatsCard
          title="Belum Dinilai"
          value={pegawai.length - ckpData.length}
          subtitle="Perlu input"
          icon={<AlertCircle className="text-orange-400" size={22} />}
          color="text-orange-400"
        />
        <StatsCard
          title="Monitoring Penilaian Juri"
          value={
            juriTotal > 0 && juriDone === juriTotal
              ? <span className="text-green-400 font-bold">DONE</span>
              : <span className="text-xl font-bold text-orange-400 tracking-wide"> IN PROGRESS </span>
          }
          subtitle="Status Evaluasi"
          icon={<Activity className="text-purple-400" size={22} />}
          color="text-purple-400"
        />
      </div>

      <QuickActions />

      {/* ===== NOMINASI SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ----- NOMINASI PER TIM ----- */}
        <div className="bg-[#1a2f6d]/80 backdrop-blur-xl border border-cyan-400/15 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-cyan-300">
            Nominasi Per Tim
          </h2>

          {nominasi.map((n: any) => (
            <div
              key={n.pegawai.id}
              className="mb-6 p-4 bg-[#1c356f] rounded-xl border border-cyan-300/10"
            >
              <h3 className="font-bold text-cyan-200 uppercase">
                {n.pegawai.tim}
              </h3>

              <p className="text-lg font-semibold mt-2 text-white">
                {n.pegawai.nama}
              </p>

              <p className="text-sm text-blue-200 mb-3">
                Total Nilai: {n.total_nilai}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSetFinal(n)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition"
                >
                  OKE
                </button>

                <button
                  onClick={() => handleRemoveFinal(n.pegawai.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition"
                >
                  TIDAK
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ----- NOMINASI FINAL ----- */}
        <div className="bg-[#1a2f6d]/80 backdrop-blur-xl border border-cyan-400/15 rounded-2xl shadow-lg p-6 flex flex-col justify-between">

          <div>
            <h2 className="text-xl font-bold mb-6 text-cyan-300">
              Nominasi Final
            </h2>

            {nominasiFinal.length === 0 && (
              <p className="text-blue-300/60 text-sm">
                Belum ada nominasi final
              </p>
            )}

            {nominasiFinal.map((n: any) => (
              <div
                key={n.pegawai.id}
                className="mb-4 p-4 bg-green-900/30 rounded-xl border border-green-400/30"
              >
                <p className="font-bold text-green-300 uppercase">
                  {n.pegawai.tim}
                </p>

                <p className="text-lg font-semibold text-white">
                  {n.pegawai.nama}
                </p>

                <p className="text-sm text-blue-200">
                  Total Nilai: {n.total_nilai}
                </p>
              </div>
            ))}
          </div>

          {nominasiFinal.length > 0 && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmitFinal}
                className="px-6 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition shadow-lg"
              >
                Submit ke Approval
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}