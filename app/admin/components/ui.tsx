import { Loader2, type LucideIcon } from "lucide-react"
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="orbit-kicker">ORBIT Workspace</span>
        <h1 className="mt-4 orbit-title">{title}</h1>
        <p className="mt-3 max-w-4xl orbit-subtitle">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}

export function SectionCard({
  title,
  description,
  children,
  action,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <section className={cn("orbit-panel p-5 md:p-6", className)}>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-orbit-text">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm leading-7 text-orbit-muted">{description}</p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  )
}

export function StatusBadge({
  children,
  tone = "default",
}: {
  children: ReactNode
  tone?: "default" | "success" | "warning" | "danger" | "info"
}) {
  const toneClass = {
    default: "border-slate-200 bg-slate-100 text-slate-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
  }[tone]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClass
      )}
    >
      {children}
    </span>
  )
}

export function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-dashed border-orbit bg-orbit-cloud-soft px-6 py-12 text-center">
      <p className="text-base font-semibold text-orbit-text">{title}</p>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-orbit-muted">
        {description}
      </p>
    </div>
  )
}

export function LoadingState({
  label = "Memuat data...",
}: {
  label?: string
}) {
  return (
    <div className="orbit-panel flex min-h-56 items-center justify-center gap-3 p-6 text-sm text-orbit-muted">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  )
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-orbit-text">{children}</label>
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("orbit-input", props.className)} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("orbit-input", props.className)} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-2xl border border-orbit bg-white px-4 py-3 text-sm text-orbit-text outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
        props.className
      )}
    />
  )
}

export function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={cn("orbit-btn-primary", props.className)} />
}

export function SecondaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={cn("orbit-btn-secondary", props.className)} />
}

export function StatIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, var(--orbit-cosmic) 0%, var(--orbit-plum) 100%)",
      }}
    >
      <Icon className="h-5 w-5" />
    </div>
  )
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
}) {
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
        <StatIcon icon={Icon} />
      </div>
    </div>
  )
}