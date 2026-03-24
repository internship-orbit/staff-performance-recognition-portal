"use client"

import Sidebar from "@/app/admin/components/sidebar"

export default function VerifikatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-[#050b1f] min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT AREA */}
      <div className="flex-1 lg:ml-64 px-6 sm:px-10 py-10 bg-[#0b1635]">

        <div className="max-w-[1400px] mx-auto">

          <div className="space-y-6">
            {children}
          </div>

        </div>

      </div>

    </div>
  )
}