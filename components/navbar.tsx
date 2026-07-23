"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Truck,
  Send,
  Mail,
  Folder,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Catalog", href: "/catalog", icon: () => <Package className="h-5 w-5" /> },
  { name: "Vendors", href: "/vendors", icon: () => <Truck className="h-5 w-5" /> },
  { name: "Suppliers", href: "/suppliers", icon: () => <Send className="h-5 w-5" /> },
  { name: "Mail", href: "/email", icon: () => <Mail className="h-5 w-5" /> },
  { name: "Projects", href: "/projects", icon: () => <Folder className="h-5 w-5" /> },
  { name: "Import/Export", href: "/import-export", icon: () => <Upload className="h-5 w-5" /> },
  { name: "Settings", href: "/settings", icon: () => <Settings className="h-5 w-5" /> },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded bg-primary">
              <Package className="size-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground uppercase font-heading">
              EngStore
            </span>
          </Link>
          <div className="flex items-center gap-4">
          </div>

          <nav className="flex items-center">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname === "/" && item.name === "Settings");//Defaulting to Settings active if at root to match image
                return (
                  <Button nativeButton={false} key={item.name} variant={isActive ? "default" : "ghost"} size="sm" className="h-8 text-[13px]" render={<Link href={item.href} />}>
                      {item.icon()}
                      {item.name}
                  </Button>
                );
              })}
            <div className="flex gap-2">

            </div>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="h-6 w-px bg-border mx-2" />

          <Button variant="ghost" size="icon-sm" className="size-8 text-muted-foreground hover:text-foreground">
            <LogOut data-icon="inline-start" className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
