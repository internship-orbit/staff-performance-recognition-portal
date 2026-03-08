"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import StatsCard from "./components/statscard"
import Header from "./components/header"
import QuickActions from "./components/quickactions"
import { Users, FileCheck, AlertCircle, Activity } from "lucide-react"

export default function AdminPage() {

  /* ================= STATE ================= */

  const [pegawai, setPegawai] = useState<any[]>([])
  const [ckpData, setCkpData] = useState<any[]>([])
  const [nominasi, setNominasi] = useState<any>({})
  const [nominasiFinal, setNominasiFinal] = useState<any[]>([])
  const [juriDone, setJuriDone] = useState(0)
  const [juriTotal, setJuriTotal] = useState(0)

  /* ================= HELPER BULAN ================= */

  function getNamaBulan(dateString: string) {

    const bulan = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ]

    const date = new Date(dateString)

    return bulan[date.getMonth()]
  }

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {

    await getPegawai()
    await getCKP()
    await getMonitoringJuri()
    await getNominasiPerTim()

  }

  /* ================= GET PEGAWAI ================= */

  async function getPegawai() {

    const { data } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    setPegawai(data || [])

  }

  /* ================= GET CKP ================= */

  async function getCKP() {

    const { data } = await supabase
      .from("ckp")
      .select(`
        id,
        pegawai ( nama )
      `)

    setCkpData(data || [])

  }

  /* ================= MONITORING JURI ================= */

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

  /* ================= NOMINASI PER TIM ================= */

  async function getNominasiPerTim() {

    const { data, error } = await supabase
      .from("nilai_final")
      .select(`
        total_nilai,
        periode_bulan,
        pegawai (
          id,
          nama,
          tim
        )
      `)
      .order("total_nilai", { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    const grouped: any = {}

    data?.forEach((item: any) => {

      const tim = item.pegawai.tim
      const bulan = getNamaBulan(item.periode_bulan)

      if (!grouped[tim]) grouped[tim] = {}

      if (!grouped[tim][bulan]) {

        grouped[tim][bulan] = item

      }

    })

    setNominasi(grouped)

  }

  /* ================= SET NOMINASI FINAL ================= */

  function handleSetFinal(item: any) {

    const tim = item.pegawai.tim

    const already = nominasiFinal.find(
      (n) => n.pegawai.tim === tim
    )

    if (already) {

      alert("Tim ini sudah memiliki nominasi final")

      return

    }

    setNominasiFinal([...nominasiFinal, item])

  }

  function handleRemoveFinal(id: string) {

    setNominasiFinal(
      nominasiFinal.filter((n) => n.pegawai.id !== id)
    )

  }

  /* ================= SUBMIT KE JURI ================= */

  async function handleSubmitFinal() {

    if (nominasiFinal.length === 0) {

      alert("Belum ada nominasi final")

      return

    }

    const payload = nominasiFinal.map((item: any) => ({

      pegawai_id: item.pegawai.id,
      total_nilai: item.total_nilai,
      status: "pending"

    }))

    const { error } = await supabase
      .from("penilaian")
      .insert(payload)

    if (error) {

      console.error(error)

      alert("Gagal kirim ke juri")

      return

    }

    alert("Berhasil dikirim ke juri")

    setNominasiFinal([])

  }

  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 space-y-8">

      <Header
        title="Admin Board"
        subtitle="Manage. Evaluate. Recognize."
      />

      {/* ================= STATS ================= */}

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
          title="Monitoring Penilaian TPK"
          value={
            juriTotal > 0 && juriDone === juriTotal
              ? <span className="text-green-400 font-bold">DONE</span>
              : <span className="text-xl font-bold text-orange-400 tracking-wide">IN PROGRESS</span>
          }
          subtitle="Status Evaluasi"
          icon={<Activity className="text-purple-400" size={22} />}
          color="text-purple-400"
        />

      </div>

      <QuickActions />

      {/* ================= NOMINASI ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= DAFTAR NOMINASI ================= */}

        <div className="bg-[#1a2f6d]/80 backdrop-blur-xl border border-cyan-400/15 rounded-2xl shadow-lg p-6">

          <h2 className="text-xl font-bold mb-6 text-cyan-300">

            Daftar Nominasi Tim

          </h2>

          {Object.entries(nominasi).map(([tim, bulanData]: any) => (

            <div
              key={tim}
              className="mb-6 p-4 bg-[#1c356f] rounded-xl border border-cyan-300/10"
            >

              <h3 className="font-bold text-cyan-200 uppercase mb-4">

                {tim}

              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {Object.entries(bulanData).map(([bulan, data]: any) => (

                  <div
                    key={bulan}
                    className="p-4 bg-[#233e80] rounded-xl"
                  >

                    <p className="text-cyan-300 text-sm mb-1">

                      {bulan}

                    </p>

                    <p className="text-white font-semibold">

                      {data.pegawai.nama}

                    </p>

                    <p className="text-blue-200 text-sm mb-3">

                      Nilai: {data.total_nilai}

                    </p>

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleSetFinal(data)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                      >
                        OKE
                      </button>

                      <button
                        onClick={() => handleRemoveFinal(data.pegawai.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                      >
                        TIDAK
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

        {/* ================= NOMINASI FINAL ================= */}

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

                Kirim ke Juri

              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  )

}