"use client"

import { Pill, LayoutDashboard, User2, ChevronUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useAddMedicine } from "@/components/add-medicine-context"

export function AppSidebar() {
  const { openDialog } = useAddMedicine()
  const pathname = usePathname()
  return (
    <Sidebar className="w-64 border-r">
      <SidebarContent className="h-screen flex flex-col">
        <SidebarGroup className="flex flex-col h-full">

          {/* Logo */}
          <SidebarGroupLabel className="px-4 py-5 text-2xl font-semibold border-b">
            MediAlert
          </SidebarGroupLabel>

          {/* Menu */}
          <SidebarGroupContent className="flex-1 px-2 py-4">
            <SidebarMenu className="space-y-1">

              {/* Dashboard link */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>  </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Add Medicine → OPENS DIALOG */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={openDialog}>
                  <Pill className="h-5 w-5" />
                  <span>Add Medicine Reminder</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>

          {/* Footer */}
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User2 className="h-5 w-5" />
                      Username
                      <ChevronUp className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent side="top" className="w-full">
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
