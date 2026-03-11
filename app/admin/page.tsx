"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Header from "./components/header"
import QuickActions from "./components/quickactions"
import StatsCard from "./components/statscard"

import { Users, FileCheck, AlertCircle, Activity } from "lucide-react"

export default function AdminPage(){

const [nominasi,setNominasi] = useState<any[]>([])
const [finalNominee,setFinalNominee] = useState<any[]>([])
const [ranking,setRanking] = useState<any[]>([])

const [pegawaiCount,setPegawaiCount] = useState(0)
const [nilaiCount,setNilaiCount] = useState(0)

useEffect(()=>{
loadNominasi()
loadRanking()
loadStats()
},[])

/* =========================
LOAD STATS CARD
========================= */

async function loadStats(){

const {data:pegawai} = await supabase
.from("pegawai")
.select("id")

const {data:nilai} = await supabase
.from("nilai_final")
.select("id")

setPegawaiCount(pegawai?.length || 0)
setNilaiCount(nilai?.length || 0)

}

/* =========================
LOAD NOMINASI
========================= */

async function loadNominasi(){

const {data,error} = await supabase
.from("nilai_final")
.select(`
id,
nilai,
total_nilai,
periode_bulan,
pegawai:pegawai_id(
id,
nama,
tim
)
`)

if(error){
console.log(error)
return
}

if(!data){
setNominasi([])
return
}

/* AUTO NOMINASI TOP 1 TIM BULAN */

const map:any = {}

data.forEach((item:any)=>{

const tim = item.pegawai?.tim || "Tanpa Tim"

const bulan = new Date(item.periode_bulan)
.toLocaleDateString("id-ID",{month:"long"})

const key = `${tim}-${bulan}`

if(!map[key]){
map[key] = item
}else{
if(item.total_nilai > map[key].total_nilai){
map[key] = item
}
}

})

setNominasi(Object.values(map))

}

/* =========================
LOAD FINAL RANKING
========================= */

async function loadRanking(){

const {data,error} = await supabase
.from("penilaian")
.select(`
pegawai_id,
total_nilai,
pegawai:pegawai_id(
id,
nama,
tim
)
`)

if(error){
console.log(error)
return
}

if(!data){
setRanking([])
return
}

const map:any = {}

data.forEach((item:any)=>{

const id = item.pegawai?.id

if(!map[id]){
map[id] = {
pegawai_id:item.pegawai?.id,
nama:item.pegawai?.nama,
tim:item.pegawai?.tim,
total:0,
count:0
}
}

map[id].total += item.total_nilai
map[id].count += 1

})

const result = Object.values(map).map((item:any)=>({
pegawai_id:item.pegawai_id,
nama:item.nama,
tim:item.tim,
nilai:item.total/item.count
}))

result.sort((a:any,b:any)=>b.nilai-a.nilai)

setRanking(result)

}

/* =========================
PILIH NOMINASI FINAL
========================= */

function pilihFinal(item:any){

const tim = item.pegawai?.tim

const sudahAda = finalNominee.find(
(n:any)=> n.pegawai?.tim === tim
)

if(sudahAda){
alert("Setiap tim hanya boleh 1 nominasi final")
return
}

setFinalNominee([...finalNominee,item])

}

function tolakFinal(id:any){

setFinalNominee(
finalNominee.filter((n:any)=> n.id !== id)
)

}

/* =========================
KIRIM KE JURI
========================= */

async function kirimKeJuri(){

if(finalNominee.length === 0){
alert("Belum ada nominasi final")
return
}

await supabase
.from("nominasi_final")
.delete()
.neq("id","00000000-0000-0000-0000-000000000000")

const dataInsert = finalNominee.map((item:any)=>({

pegawai_id:item.pegawai.id,
tim:item.pegawai.tim,
total_nilai:item.total_nilai

}))

const {error} = await supabase
.from("nominasi_final")
.insert(dataInsert)

if(error){
console.log(error)
alert("Gagal mengirim ke juri")
return
}

alert("Berhasil dikirim ke juri")

setFinalNominee([])

}

/* =========================
KIRIM KE APPROVAL
========================= */

async function kirimKeApproval(){

if(ranking.length === 0){
alert("Belum ada ranking juri")
return
}

await supabase
.from("nominasi_final")
.delete()
.neq("id","00000000-0000-0000-0000-000000000000")

const dataInsert = ranking.map((item:any)=>({

pegawai_id:item.pegawai_id,
tim:item.tim,
total_nilai:item.nilai

}))

const {error} = await supabase
.from("nominasi_final")
.insert(dataInsert)

if(error){
console.log(error)
alert("Gagal mengirim ke approval")
return
}

alert("Ranking berhasil dikirim ke verifikator")

}

/* =========================
GROUPING TIM
========================= */

const groupedByTeam = nominasi.reduce((acc:any,item:any)=>{

const tim = item.pegawai?.tim || "Tanpa Tim"

if(!acc[tim]) acc[tim] = []

acc[tim].push(item)

return acc

},{})

return(

<div className="min-h-screen bg-[#0b1635] text-blue-100 space-y-8">

<Header
title="Admin Board"
subtitle="Manage. Evaluate. Recognize."
/>

{/* =========================
STATS CARD
========================= */}

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

<StatsCard
title="Total Pegawai"
value={pegawaiCount}
subtitle="Data terdaftar"
icon={<Users size={22}/>}
/>

<StatsCard
title="Data Sudah Dinilai"
value={nilaiCount}
subtitle="Sudah diinput"
icon={<FileCheck size={22}/>}
/>

<StatsCard
title="Data Belum Dinilai"
value={pegawaiCount - nilaiCount}
subtitle="Perlu input"
icon={<AlertCircle size={22}/>}
/>

<StatsCard
title="Monitoring Penilaian TPK"
value="IN PROGRESS"
subtitle="Status Evaluasi"
icon={<Activity size={22}/>}
/>

</div>

<QuickActions/>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{/* =========================
NOMINASI PER TIM
========================= */}

<div className="bg-[#1a2f6d]/80 rounded-2xl p-8">

<h2 className="text-xl font-bold text-cyan-300 mb-6">
Nominasi Per Tim
</h2>

<div className="space-y-8">

{Object.entries(groupedByTeam).map(([tim,data]:any)=>(

<div key={tim}>

<h3 className="text-cyan-300 font-bold text-lg">
TIM {tim.toUpperCase()}
</h3>

<div className="space-y-4 mt-4">

{data.map((item:any)=>{

const bulan = new Date(item.periode_bulan)
.toLocaleDateString("id-ID",{month:"long"})

const sudahDipilih = finalNominee.find(
(n:any)=> n.pegawai?.tim === tim
)

return(

<div
key={item.id}
className="flex justify-between bg-[#0f1c3f] p-4 rounded-xl"
>

<div>

<p className="font-semibold text-white">
{item.pegawai?.nama}
</p>

<p className="text-xs text-blue-300">
{bulan} • Nilai {item.total_nilai}
</p>

</div>

<div className="flex gap-2">

<button
onClick={()=>pilihFinal(item)}
disabled={!!sudahDipilih}
className="px-3 py-1 text-xs bg-green-500 rounded-md disabled:opacity-40"
>
OKE
</button>

<button
onClick={()=>tolakFinal(item.id)}
className="px-3 py-1 text-xs bg-red-500 rounded-md"
>
TIDAK
</button>

</div>

</div>

)

})}

</div>

</div>

))}

</div>

</div>

{/* =========================
NOMINASI FINAL
========================= */}

<div className="bg-[#1a2f6d]/80 rounded-2xl p-8">

<h2 className="text-xl font-bold text-cyan-300 mb-6">
Nominasi Final
</h2>

{finalNominee.length === 0 && (
<p className="text-blue-300/60">
Belum ada nominasi final
</p>
)}

<div className="space-y-3">

{finalNominee.map((item:any)=>(

<div
key={item.id}
className="bg-[#0f1c3f] p-4 rounded-lg"
>
{item.pegawai?.nama}
</div>

))}

</div>

<button
onClick={kirimKeJuri}
className="mt-6 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md font-semibold"
>
Kirim ke Juri
</button>

</div>

</div>

{/* =========================
FINAL RANKING
========================= */}

<div className="bg-[#1a2f6d]/80 rounded-2xl p-8">

<h2 className="text-xl font-bold text-cyan-300 mb-6">
Final Ranking
</h2>

{ranking.length === 0 && (
<p className="text-blue-300/60">
Belum ada penilaian juri
</p>
)}

<div className="space-y-3">

{ranking.map((item:any,index:number)=>(

<div
key={index}
className="flex justify-between bg-[#0f1c3f] p-4 rounded-lg"
>

<span>
{index+1}. {item.nama}
</span>

<span className="text-cyan-300 font-semibold">
{item.nilai.toFixed(1)}
</span>

</div>

))}

</div>

<button
onClick={kirimKeApproval}
className="mt-6 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md font-semibold"
>
Kirim ke Approval
</button>

</div>

</div>

)

}