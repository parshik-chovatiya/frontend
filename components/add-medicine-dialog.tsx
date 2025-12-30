"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAddMedicine } from "./add-medicine-context"
import { AddMedicineForm } from "./add-medicine-form"
import { toast } from "sonner"

export function AddMedicineDialog() {
    const { open, closeDialog } = useAddMedicine()


    const handleSubmit = (data: any) => {
        console.log("FINAL DATA", data)

        toast.success("Event has been created.",{
            position:"top-center",
            style:{backgroundColor:"#22c55e",color:"white"}
        })
        setTimeout(closeDialog, 800)
    }


    return (
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-md overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-primary">Add Medicine Reminder</DialogTitle>
                </DialogHeader>
                <AddMedicineForm onSubmit={handleSubmit} />
            </DialogContent>
        </Dialog>
    )
}