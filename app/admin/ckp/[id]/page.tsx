"use client"
import { useParams } from "next/navigation"
import { useState } from "react"
import { supabase } from "../../../../lib/supabaseClient"

export default function FormCKP() {
  const { id } = useParams()

  const [kuantitas, setKuantitas] = useState("")
  const [kualitas, setKualitas] = useState("")
  const [waktu, setWaktu] = useState("")
  const [biaya, setBiaya] = useState("")

  async function simpanCKP() {
    const { error } = await supabase.from("ckp").insert({
      pegawai_id: id,
      nilai_kuantitas: kuantitas,
      nilai_kualitas: kualitas,
      nilai_waktu: waktu,
      nilai_biaya: biaya,
    })

    if (error) alert("Gagal simpan")
    else alert("CKP berhasil disimpan 🎉")
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Input CKP Pegawai</h1>

      <input placeholder="Nilai Kuantitas" onChange={e=>setKuantitas(e.target.value)} />
      <br/><br/>

      <input placeholder="Nilai Kualitas" onChange={e=>setKualitas(e.target.value)} />
      <br/><br/>

      <input placeholder="Nilai Waktu" onChange={e=>setWaktu(e.target.value)} />
      <br/><br/>

      <input placeholder="Nilai Biaya" onChange={e=>setBiaya(e.target.value)} />
      <br/><br/>

      <button onClick={simpanCKP}>Simpan CKP</button>
    </div>
  )
}