import type { LucideIcon } from "lucide-react"
import { StatIcon } from "./ui"

type StatsCardProps = {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
}: StatsCardProps) {
  return (
    <div className="orbit-panel-soft p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-orbit-muted">{title}</p>
          <p className="mt-3 truncate text-4xl font-bold tracking-tight text-orbit-text">
            {value}
          </p>
          <p className="mt-3 text-sm leading-7 text-orbit-muted">{subtitle}</p>
        </div>
        <StatIcon icon={icon} />
      </div>
    </div>
  )
}