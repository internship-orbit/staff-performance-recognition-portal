"use client"

import VerifikatorSidebar from "./components/VerifikatorSidebar"
import VerifikatorHeader from "./components/VerifikatorHeader"

export default function VerifikatorLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <div className="flex min-h-screen bg-gray-950 text-white">

      <VerifikatorSidebar/>

      <div className="flex-1 flex flex-col">

        <VerifikatorHeader/>

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>

  )

}