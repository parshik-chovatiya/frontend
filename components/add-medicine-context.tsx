"use client"
import { createContext, useContext, useState } from "react"


const AddMedicineContext = createContext<any>(null)


export function AddMedicineProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)


    return (
        <AddMedicineContext.Provider
            value={{
                open,
                openDialog: () => setOpen(true),
                closeDialog: () => setOpen(false),
            }}
        >
            {children}
        </AddMedicineContext.Provider>
    )
}


export const useAddMedicine = () => {
    const ctx = useContext(AddMedicineContext)
    if (!ctx) throw new Error("useAddMedicine must be inside provider")
    return ctx
}