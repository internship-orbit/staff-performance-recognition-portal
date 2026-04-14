type RankingRow = {
  id: string | number
  nama: string
  nip?: string
  unit: string
  nilai: number
}

type RankingTableProps = {
  rows: RankingRow[]
}

function getMedal(index: number) {
  if (index === 0) return "🥇"
  if (index === 1) return "🥈"
  if (index === 2) return "🥉"
  return `#${index + 1}`
}

export default function RankingTable({ rows }: RankingTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-orbit">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-orbit-cloud-soft">
            <tr>
              <th className="px-4 py-4 text-left font-bold text-orbit-text">Peringkat</th>
              <th className="px-4 py-4 text-left font-bold text-orbit-text">Nama Pegawai</th>
              <th className="px-4 py-4 text-left font-bold text-orbit-text">NIP</th>
              <th className="px-4 py-4 text-left font-bold text-orbit-text">Tim / Unit</th>
              <th className="px-4 py-4 text-right font-bold text-orbit-text">Nilai Akhir</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-orbit bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-base text-orbit-muted">
                  Belum ada data ranking yang dapat ditampilkan.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id} className="transition hover:bg-orbit-cloud-soft">
                  <td className="px-4 py-4 font-bold text-orbit-cosmic">{getMedal(index)}</td>
                  <td className="px-4 py-4 font-semibold text-orbit-text">{row.nama}</td>
                  <td className="px-4 py-4 text-orbit-muted">{row.nip || "-"}</td>
                  <td className="px-4 py-4 text-orbit-muted">{row.unit}</td>
                  <td className="px-4 py-4 text-right font-bold text-orbit-text">
                    {row.nilai.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}