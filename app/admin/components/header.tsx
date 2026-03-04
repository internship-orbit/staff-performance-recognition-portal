"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

interface HeaderProps {
  title: string
  subtitle: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("id-ID", { hour12: false })
      )
      setDate(
        now.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="
      relative
      flex items-center justify-between
      px-10 py-6
      bg-[#182758]
      border border-[#252564]
      rounded-xl
      overflow-hidden
    ">

      {/* Neon Bottom Line */}
      <div className="
        absolute bottom-0 left-0 right-0 h-0.5
        bg-linear-to-r
        from-transparent
        via-cyan-400
        to-transparent
        shadow-[0_0_12px_rgba(0,198,255,0.5)]
      " />

      {/* Subtle Top Line */}
      <div className="
        absolute top-0 left-0 right-0 h-px
        bg-linear-to-r
        from-transparent
        via-white/10
        to-transparent
      " />

      {/* Background Glow */}
      <div className="
        absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_at_5%_50%,rgba(0,198,255,0.05),transparent_50%),radial-gradient(ellipse_at_95%_50%,rgba(162,89,255,0.05),transparent_50%)]
      " />

      {/* LEFT SIDE */}
      <div className="relative z-10 flex items-center gap-6">

        {/* ORBIT Wordmark */}
        <div className="relative">
          <h1 className="
            font-['Orbitron']
            text-3xl
            font-black
            tracking-[5px]
            bg-linear-to-r
            from-cyan-400
            to-purple-500
            bg-clip-text
            text-transparent
          ">
            ORBIT
          </h1>

          {/* Glow clone */}
          <div className="
            absolute inset-0
            blur-lg
            opacity-40
            bg-linear-to-r
            from-cyan-400
            to-purple-500
            bg-clip-text
            text-transparent
            pointer-events-none
          ">
            ORBIT
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-linear-to-b from-transparent via-cyan-400/40 to-transparent" />

        {/* Title + Subtitle */}
        <div>
          <h2 className="
            text-sm
            tracking-[3px]
            uppercase
            font-semibold
            text-blue-100
          ">
            {title}
          </h2>

          <p className="
            text-[10px]
            tracking-[3px]
            uppercase
            text-blue-400
            mt-1
          ">
            {subtitle}
          </p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="relative z-10 flex items-center gap-6">

        {/* Clock */}
        <div className="text-right">
          <div className="
            font-['Orbitron']
            text-sm
            tracking-[2px]
            text-cyan-400
            drop-shadow-[0_0_8px_rgba(0,198,255,0.6)]
          ">
            {time}
          </div>
          <div className="text-[10px] tracking-[2px] text-blue-400 mt-1 uppercase">
            {date}
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-10 bg-linear-to-b from-transparent via-white/10 to-transparent" />

        {/* Notification */}
        <button className="
          relative
          flex items-center gap-2
          bg-[#3037c5]
          border border-[#1a1a35]
          rounded-lg
          px-4 py-2
          text-blue-300
          hover:border-cyan-400/40
          hover:bg-cyan-400/5
          transition-all
        ">
          <Bell size={16} />
          <span className="text-xs tracking-wide font-semibold">
            Notifikasi
          </span>

          {/* Badge */}
          <span className="
            absolute -top-2 -right-2
            w-5 h-5
            rounded-full
            bg-linear-to-r
            from-red-500
            to-orange-500
            text-[10px]
            flex items-center justify-center
            text-white
            border border-[#0b0b18]
          ">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="
          w-9 h-9
          rounded-lg
          bg-linear-to-r
          from-blue-600
          to-cyan-400
          flex items-center justify-center
          font-['Orbitron']
          text-xs
          font-bold
          text-white
          shadow-[0_0_10px_rgba(0,198,255,0.3)]
          cursor-pointer
          hover:shadow-[0_0_20px_rgba(0,198,255,0.6)]
          transition
        ">
          AD
        </div>

      </div>

    </header>
  )
}