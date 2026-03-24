"use client"

import Sidebar from "@/app/admin/components/sidebar"

export default function JuriLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-[#050b1f] min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="flex-1 lg:ml-64 px-6 sm:px-10 py-10 bg-[#0b1635]">

        {/* CONTAINER CENTER (INI KUNCINYA) */}
        <div className="max-w-[1400px] mx-auto w-full">

          <div className="mt-6 space-y-6">
            {children}
          </div>

        </div>

      </div>

    </div>
  )
}