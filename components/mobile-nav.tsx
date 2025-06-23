"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, UserPlus, Phone, ShieldCheck, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdmitCardSetting } from "@/lib/actions"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [admitCardEnabled, setAdmitCardEnabled] = useState(false)

  useEffect(() => {
    const checkAdmitCardSetting = async () => {
      try {
        const result = await getAdmitCardSetting()
        setAdmitCardEnabled(result.enabled)
      } catch (error) {
        console.error("Error checking admit card setting:", error)
      }
    }

    checkAdmitCardSetting()
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home, active: pathname === "/" },
    { href: "/register", label: "Register", icon: UserPlus, active: pathname === "/register" },
    { href: "/contact", label: "Contact", icon: Phone, active: pathname === "/contact" },
    ...(admitCardEnabled
      ? [{ href: "/admit-card", label: "Admit Card", icon: CreditCard, active: pathname === "/admit-card" }]
      : []),
    { href: "/admin/login", label: "Admin", icon: ShieldCheck, active: pathname.startsWith("/admin") },
  ]

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="text-slate-800 dark:text-white hover:bg-cyan-600/20 dark:hover:bg-cyan-700 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl z-50 border-b border-slate-200 dark:border-slate-700 shadow-2xl">
          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-slate-800 dark:text-white p-3 rounded-xl transition-all duration-300 border border-transparent",
                  item.active
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 border-cyan-500"
                    : "hover:bg-cyan-100 dark:hover:bg-cyan-900/20 hover:border-cyan-300 dark:hover:border-cyan-700",
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
