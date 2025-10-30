"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, TrendingUp, TrendingDown, Home, Target, Bell, PieChart } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Receitas",
    href: "/receitas",
    icon: TrendingUp,
  },
  {
    title: "Despesas",
    href: "/despesas",
    icon: TrendingDown,
  },
  {
    title: "Financiamentos",
    href: "/financiamentos",
    icon: Home,
  },
  {
    title: "Metas",
    href: "/metas",
    icon: Target,
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: PieChart,
  },
  {
    title: "Alertas",
    href: "/alertas",
    icon: Bell,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
