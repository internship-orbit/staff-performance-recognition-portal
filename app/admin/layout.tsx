import Sidebar from "./components/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0b1635]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 lg:ml-64">

        <div className="
          w-full
          max-w-7xl
          mx-auto
          px-4 sm:px-6 lg:px-8
          py-6 sm:py-8
        ">
          {children}
        </div>

      </div>
    </div>
  )
}