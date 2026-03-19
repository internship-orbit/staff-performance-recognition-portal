"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

/* ================= TYPES ================= */

type Pegawai = {
id: string
nama: string
tim: string
}

type Nominasi = {
id: string
total_nilai: number
pegawai: Pegawai | null
}

export default function ApprovalPage(){

const [data,setData] = useState<Nominasi[]>([])
const [loading,setLoading] = useState(false)
const [isLocked,setIsLocked] = useState(false)

useEffect(()=>{
loadData()
checkApprovalLock()
},[])

/* ================= CEK HISTORY/ RIWAYAT ================= */
async function checkApprovalLock(){

const {data,error} = await supabase
.from("history_penghargaan")
.select("id")
.eq("tahun",2026)
.eq("triwulan",1)
.limit(1)

if(data && data.length > 0){
setIsLocked(true)
}

}

/* ================= LOAD DATA ================= */

async function loadData(){

const {data,error} = await supabase
.from("nominasi_final")
.select(`
id,
total_nilai,
pegawai:pegawai_id (
id,
nama,
tim
)
`)
.order("total_nilai",{ascending:false})

if(error){
console.error("Error load approval:",error)
return
}

if(!data){
setData([])
return
}

/* mapping aman */

const mapped:Nominasi[] = data.map((item:any)=>({

id:item.id,
total_nilai:item.total_nilai,
pegawai:item.pegawai ?? null

}))

setData(mapped)

}

async function approvePegawai(item:Nominasi){

setLoading(true)

try{

/* ================= SIMPAN KE HISTORY PERMANEN ================= */

await supabase
.from("history_penghargaan")
.insert({
pegawai_id: item.pegawai?.id,
nama: item.pegawai?.nama,
tim: item.pegawai?.tim,
total_nilai: item.total_nilai,
triwulan: 1,          // nanti bisa dynamic dari tabel periode
tahun: 2026,
periode_label: "Triwulan 1 2026"
})

/* ================= SET APPROVED ================= */

await supabase
.from("nilai_final")
.update({status:"approved"})
.eq("pegawai_id",item.pegawai?.id)

/* ================= REJECT SEMUA YANG LAIN ================= */

await supabase
.from("nilai_final")
.update({status:"rejected"})
.neq("pegawai_id",item.pegawai?.id)

alert("Pegawai Teladan berhasil ditetapkan")

await loadData()

}catch(err){

console.error(err)
alert("Gagal approve")

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

{/* DATA */}

<div className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-2xl p-10">

<h2 className="text-xl font-bold mb-8 text-cyan-300">
Daftar Nominasi
</h2>

{data.length === 0 && (
<p className="text-blue-300/60">
Belum ada data nominasi dari hasil penilaian juri
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

{pegawai?.tim || "Tim tidak ditemukan"}

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
disabled={loading || !pegawai || isLocked}
onClick={()=>approvePegawai(item)}
className={`flex-1 text-white text-sm py-2 rounded-lg
${isLocked
? "bg-gray-500 cursor-not-allowed"
: "bg-green-600 hover:bg-green-700"
}`}
>
{isLocked ? "Sudah Ditentukan" : "Approve"}
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