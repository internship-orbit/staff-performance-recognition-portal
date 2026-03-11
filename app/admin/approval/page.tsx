"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

/* ================= TYPE ================= */

type Pegawai = {
  id: string
  nama: string
  tim: string
}

type Nominasi = {
  id: string
  pegawai_id: string
  total_nilai: number
  pegawai?: Pegawai
}

export default function ApprovalPage() {

  const [data,setData] = useState<Nominasi[]>([])
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    getData()
  },[])

  /* ================= LOAD DATA ================= */

  async function getData(){

    /* ambil nominasi */

    const { data:nominasiData, error } = await supabase
      .from("nominasi_final")
      .select("*")
      .order("total_nilai",{ascending:false})

    if(error){
      console.error("Error load approval:",error)
      return
    }

    if(!nominasiData){
      setData([])
      return
    }

    /* ambil semua pegawai */

    const { data:pegawaiData } = await supabase
      .from("pegawai")
      .select("id,nama,tim")

    /* mapping pegawai */

    const result = nominasiData.map((item:any)=>{

      const pegawai = pegawaiData?.find(
        (p:any)=>p.id === item.pegawai_id
      )

      return{
        ...item,
        pegawai
      }

    })

    setData(result)

  }

  /* ================= APPROVE ================= */

  async function approvePegawai(pegawaiId:string){

    setLoading(true)

    try{

      /* update nilai_final */

      await supabase
        .from("nilai_final")
        .update({status:"approved"})
        .eq("pegawai_id",pegawaiId)

      /* simpan ke history */

      await supabase
        .from("history_penghargaan")
        .insert({
          pegawai_id:pegawaiId,
          keterangan:"Pegawai Teladan",
          tanggal:new Date()
        })

      alert("Pegawai berhasil diapprove")

      await getData()

    }catch(err){

      console.error(err)
      alert("Gagal approve")

    }

    setLoading(false)

  }

  /* ================= REJECT ================= */

  async function rejectPegawai(pegawaiId:string){

    setLoading(true)

    try{

      await supabase
        .from("nilai_final")
        .update({status:"rejected"})
        .eq("pegawai_id",pegawaiId)

      alert("Pegawai ditolak")

      await getData()

    }catch(err){

      console.error(err)
      alert("Gagal reject")

    }

    setLoading(false)

  }

  /* ================= UI ================= */

  return(

  <div className="min-h-screen bg-[#0b1635] text-blue-100 px-8 py-10">

    <div className="max-w-6xl mx-auto space-y-10">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">
          Approval Nominasi
        </h1>

        <p className="text-blue-300/70 mt-1">
          Review Nominations. Confirm the Best.
        </p>

      </div>

      {/* LIST */}

      <div className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-2xl p-10">

        <h2 className="text-xl font-bold mb-8 text-cyan-300">
          Daftar Nominasi
        </h2>

        {data.length === 0 && (
          <p className="text-blue-300/60">
            Belum ada data nominasi
          </p>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {data.map((item)=>{

            const pegawai = item.pegawai

            return(

            <div
              key={item.id}
              className="bg-[#0f1c3f] border border-cyan-400/15 rounded-xl p-6 flex flex-col justify-between"
            >

              <div>

                <p className="text-sm text-cyan-300 uppercase">
                  {pegawai?.tim || "-"}
                </p>

                <h3 className="text-lg font-semibold text-white mt-1">
                  {pegawai?.nama || "Nama tidak ditemukan"}
                </h3>

                <p className="text-sm text-blue-300 mt-2">
                  Total Nilai : {item.total_nilai}
                </p>

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  disabled={loading}
                  onClick={()=>approvePegawai(item.pegawai_id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  disabled={loading}
                  onClick={()=>rejectPegawai(item.pegawai_id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg"
                >
                  Reject
                </button>

              </div>

            </div>

            )

          })}

        </div>

      </div>

    </div>

  </div>

  )

}