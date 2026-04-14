import type { ReactNode } from "react"
import Header from "./components/header"
import Sidebar from "./components/sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="orbit-shell">
      <Sidebar />
      <div className="lg:pl-80">
        <Header />
        <main className="px-4 pb-10 pt-24 md:px-6 lg:px-8">
          <div className="mx-auto max-w-screen-2xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}