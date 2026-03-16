"use client"

import JuriProgress from "./components/JuriProgress"

export default function DashboardJuri(){

  return(

    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Dashboard Juri
      </h1>

      <JuriProgress />

    </div>

  )

}