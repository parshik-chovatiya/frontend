"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAddMedicine } from "@/components/add-medicine-context"

export function HeaderBar() {
  const { openDialog } = useAddMedicine()

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <SidebarTrigger />

      <Button onClick={openDialog}>
        Add Medicine Reminder
      </Button>
    </div>
  )
}
