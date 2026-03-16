"use client"

import { useState } from "react"
import MonitoringJuri from "./tabs/MonitoringJuri"
import AdminOverrideNilai from "./tabs/AdminOverrideNilai"
import ManajemenJuri from "./tabs/ManajemenJuri"

export default function PenilaianJuriPage(){

  const [tab,setTab] = useState("monitor")

  return(

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Penilaian Juri
      </h1>

      <div className="flex gap-3">

        <button
          onClick={()=>setTab("monitor")}
          className={`px-4 py-2 rounded ${
            tab==="monitor" ? "bg-blue-600" : "bg-gray-800"
          }`}
        >
          Monitoring Juri
        </button>

        <button
          onClick={()=>setTab("override")}
          className={`px-4 py-2 rounded ${
            tab==="override" ? "bg-blue-600" : "bg-gray-800"
          }`}
        >
          Bantu Penilaian
        </button>

        <button
          onClick={()=>setTab("juri")}
          className={`px-4 py-2 rounded ${
            tab==="juri" ? "bg-blue-600" : "bg-gray-800"
          }`}
        >
          Manajemen Juri
        </button>

      </div>

      {tab==="monitor" && <MonitoringJuri/>}

      {tab==="override" && <AdminOverrideNilai/>}

      {tab==="juri" && <ManajemenJuri/>}

    </div>

  )

}