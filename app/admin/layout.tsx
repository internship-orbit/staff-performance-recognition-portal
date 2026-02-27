import Sidebar from "@/app/admin/components/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-[#F5F6FA]">
      <Sidebar />
      <div className="ml-64 w-full p-10">
        {children}
      </div>
    </div>
  )
}