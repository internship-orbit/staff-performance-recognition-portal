"use client"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Home() {
  const [pegawai, setPegawai] = useState<any[]>([])

  useEffect(() => {
    getPegawai()
  }, [])

  async function getPegawai() {
    const { data, error } = await supabase
      .from("pegawai")
      .select("*")

    if (error) console.log(error)
    else setPegawai(data)
  }

return (
  <div style={{ padding: 40 }}>
    <h3>{process.env.NEXT_PUBLIC_SUPABASE_URL}</h3>
    <h1>ORBIT - Data Pegawai</h1>

    {pegawai.map((p) => (
      <div key={p.id}>
        • {p.nama}
      </div>
    ))}
  </div>
)}
