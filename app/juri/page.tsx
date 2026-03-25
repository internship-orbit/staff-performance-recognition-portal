"use client"

import Header from "@/app/admin/components/header"
import JuriProgress from "./components/JuriProgress"

export default function DashboardJuri(){

  return(

    <div className="space-y-6">

      <Header
        title="Dashboard Juri"
        subtitle="Monitoring Penilaian Pegawai"
      />

      <h1 className="text-2xl font-bold">
        Dashboard Juri
      </h1>

      <div className="bg-[#0f1c3f] p-6 rounded-xl">
        Silakan lakukan penilaian terhadap kandidat pegawai teladan.
      </div>

    </div>

  )

}