"use client"

import Link from "next/link"

export default function VerifikatorSidebar(){

  return(

    <aside className="w-64 bg-gray-900 border-r border-gray-800">

      <div className="p-6 text-lg font-bold">
        ORBIT
      </div>

      <nav className="flex flex-col gap-2 px-4">

        <Link href="/verifikator" className="p-2 hover:bg-gray-800 rounded">
          Dashboard
        </Link>

        <Link href="/verifikator/verifikasi" className="p-2 hover:bg-gray-800 rounded">
          Verifikasi Nilai
        </Link>

        <Link href="/verifikator/riwayat" className="p-2 hover:bg-gray-800 rounded">
          Riwayat
        </Link>

      </nav>

    </aside>

  )

}