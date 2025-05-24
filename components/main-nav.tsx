"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Home, UserPlus, Phone, ShieldCheck, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { getAdmitCardSetting } from "@/lib/actions"

export function MainNav() {
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

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-white hover:bg-emerald-700 hover:text-white",
                pathname === "/" && "bg-emerald-700",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/register" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-white hover:bg-emerald-700 hover:text-white",
                pathname === "/register" && "bg-emerald-700",
              )}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-white hover:bg-emerald-700 hover:text-white",
                pathname === "/contact" && "bg-emerald-700",
              )}
            >
              <Phone className="mr-2 h-4 w-4" />
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/admin/login" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-white hover:bg-emerald-700 hover:text-white",
                pathname.startsWith("/admin") && "bg-emerald-700",
              )}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {admitCardEnabled && (
          <NavigationMenuItem>
            <Link href="/admit-card" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-white hover:bg-emerald-700 hover:text-white",
                  pathname === "/admit-card" && "bg-emerald-700",
                )}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Admit Card
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
