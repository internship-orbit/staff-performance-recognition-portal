import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ORBIT - Outstanding Recognition & Benchmarking Tool",
  description:
    "Sistem pemilihan pegawai teladan berbasis Outstanding Recognition & Benchmarking Tool untuk mendukung proses penilaian yang tertib, transparan, dan profesional.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}