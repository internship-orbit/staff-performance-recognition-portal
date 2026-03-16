"use client"

import JuriSidebar from "./components/JuriSidebar"
import JuriHeader from "./components/JuriHeader"

export default function JuriLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      <JuriSidebar />

      <div className="flex-1 flex flex-col">

        <JuriHeader />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  )
}