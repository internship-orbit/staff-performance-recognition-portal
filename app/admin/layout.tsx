import Sidebar from "./components/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64">

        {/* BATASI SEMUA CONTENT TERMASUK HEADER */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

          <div className="mt-8">
            {children}
          </div>

        </div>

      </div>

    </div>
  )
}