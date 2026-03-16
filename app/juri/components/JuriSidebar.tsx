"use client"

import Link from "next/link"

export default function JuriSidebar() {

  return (

    <aside className="w-64 bg-gray-900 border-r border-gray-800">

      <div className="p-6 font-bold text-lg">
        ORBIT
      </div>

      <nav className="flex flex-col gap-2 px-4">

        <Link href="/juri" className="p-2 hover:bg-gray-800 rounded">
          Dashboard
        </Link>

        <Link href="/juri/penilaian" className="p-2 hover:bg-gray-800 rounded">
          Penilaian
        </Link>

        <Link href="/juri/riwayat" className="p-2 hover:bg-gray-800 rounded">
          Riwayat
        </Link>

        <Link href="/juri/profil" className="p-2 hover:bg-gray-800 rounded">
          Profil
        </Link>

      </nav>

    </aside>

  )

}