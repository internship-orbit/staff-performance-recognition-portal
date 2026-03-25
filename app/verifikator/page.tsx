"use client"

import Header from "@/app/admin/components/header"

export default function DashboardVerifikator(){

  return(

    <div className="space-y-6">

      <Header
        title="Dashboard Verifikator"
        subtitle="Verifikasi Penilaian Pegawai"
      />

      <h1 className="text-2xl font-bold">
        Dashboard Verifikator
      </h1>

      <div className="bg-[#0f1c3f] p-6 rounded-xl">
        Silakan melakukan verifikasi terhadap hasil penilaian juri.
      </div>

    </div>

  )

}