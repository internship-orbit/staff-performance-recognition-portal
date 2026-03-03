"use client"

import { Bell } from "lucide-react"

interface HeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: string
}

export default function Header({ title, subtitle, breadcrumb }: HeaderProps) {
  return (
    <div className="mb-10">
      
      <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-violet-600 rounded-2xl p-8 shadow-lg flex justify-between items-center">

        {/* LEFT SIDE */}
        <div className="text-white">
          <h1 className="text-3xl font-bold tracking-wide">
            {title}
          </h1>

          {breadcrumb && (
            <p className="text-xs opacity-80 mt-1">
              {breadcrumb}
            </p>
          )}

          {subtitle && (
            <p className="text-sm opacity-90 mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* RIGHT SIDE */}
        <button className="relative bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2 rounded-xl flex items-center gap-2 transition">
          <Bell size={18} />
          Notifikasi

          {/* Badge contoh */}
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            3
          </span>
        </button>

      </div>

    </div>
  )
}
