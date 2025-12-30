"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const TOTAL_STEPS = 6

export function AddMedicineForm({ onSubmit: onSubmitProp }: { onSubmit?: (data: any) => void }) {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState<any>({
        email: "",
        name: "",
        doses: 1,
        times: [""],
        quantity: "",
        restock: false,
        threshold: "",
    })
    const [errors, setErrors] = useState<any>({})
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Check if user is logged in on component mount
    useState(() => {
        const accessToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1]
        setIsLoggedIn(!!accessToken)
    })

    const checkDuplicateTimes = (times: string[]) => {
        const filledTimes = times.filter((t: string) => t.length > 0)
        const uniqueTimes = new Set(filledTimes)
        return filledTimes.length !== uniqueTimes.size
    }

    const getDuplicateTimeIndices = (times: string[]) => {
        const duplicates: number[] = []
        const timeMap: { [key: string]: number[] } = {}

        times.forEach((time, index) => {
            if (time.length > 0) {
                if (!timeMap[time]) {
                    timeMap[time] = []
                }
                timeMap[time].push(index)
            }
        })

        Object.values(timeMap).forEach(indices => {
            if (indices.length > 1) {
                duplicates.push(...indices)
            }
        })

        return duplicates
    }

    const goNext = () => {
        const valid = validateStep()
        if (valid) {
            setErrors({})
            setStep(prev => prev + 1)
        } else {
            // Set error messages only when user clicks Next
            if (step === 1 && !isLoggedIn) {
                setErrors({ email: "Please enter a valid email address" })
            } else if (step === (isLoggedIn ? 3 : 4)) {
                if (checkDuplicateTimes(form.times)) {
                    setErrors({ times: "Each dose must have a different time" })
                }
            } else if (step === (isLoggedIn ? 5 : 6) && form.restock) {
                const threshold = Number(form.threshold)
                const quantity = Number(form.quantity)
                if (form.threshold.length === 0 || threshold <= 0) {
                    setErrors({ threshold: "Threshold must be greater than 0" })
                } else if (threshold >= quantity) {
                    setErrors({ threshold: "Threshold must be less than total quantity" })
                }
            }
        }
    }

    const goBack = () => {
        setErrors({})
        setStep(prev => prev - 1)
    }

    const validateStep = () => {
        const actualStep = isLoggedIn ? step : step - 1

        switch (actualStep) {
            case 0: // Email step (only when not logged in)
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
            case 1:
                return form.name.trim().length > 0
            case 2:
                return form.doses > 0 && form.times.length === form.doses
            case 3:
                if (!form.times.every((t: string) => t.length > 0)) {
                    return false
                }
                return !checkDuplicateTimes(form.times)
            case 4:
                return form.quantity.length > 0 && Number(form.quantity) > 0
            case 5:
                if (!form.restock) return true
                const threshold = Number(form.threshold)
                const quantity = Number(form.quantity)
                if (form.threshold.length === 0 || threshold <= 0) {
                    return false
                }
                if (threshold >= quantity) {
                    return false
                }
                return true
            default:
                return true
        }
    }

    const handleSubmit = () => {
        if (onSubmitProp) {
            onSubmitProp(form)
        } else {
            console.log("Medicine Reminder Set:", form)
            alert("Medicine reminder has been set successfully!")
        }
    }

    const getStepTitle = () => {
        const actualStep = isLoggedIn ? step : step - 1

        switch (actualStep) {
            case 0: return "Enter Your Email"
            case 1: return "Medicine Name"
            case 2: return "Select Doses Per Day"
            case 3: return "Set Timing for Each Dose"
            case 4: return "Total Quantity"
            case 5: return "Refill Reminder"
            case 6: return "Review & Confirm"
            default: return ""
        }
    }

    const getStepHeight = () => {
        const actualStep = isLoggedIn ? step : step - 1

        switch (actualStep) {
            case 0: return 
            case 1: return "h-[120px]"
            case 2: return "h-[120px]"
            case 3: return form.doses <= 2 ? "h-[180px]" : "h-[280px]"
            case 4: return "h-[120px]"
            case 5: return form.restock ? "h-[180px]" : "h-[120px]"
            case 6: return "h-[280px]"
            default: return "h-[120px]"
        }
    }

    const renderStep = () => {
        const actualStep = isLoggedIn ? step : step - 1

        switch (actualStep) {
            case 0:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                You are not logged in. Please <span><a href="/login" className="text-sm text-primary hover:underline">
                                    Click here
                                </a></span> to login.
                            </p>

                        </div>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={(e) => {
                                setForm({ ...form, email: e.target.value })
                                setErrors({})
                            }}
                            className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>
                )

            case 1:
                return (
                    <div className="space-y-4">
                        <Input
                            placeholder="Enter medicine name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full"
                        />
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4">
                        <Select
                            value={form.doses.toString()}
                            onValueChange={(v) =>
                                setForm({ ...form, doses: Number(v), times: Array(Number(v)).fill("") })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select doses per day" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <SelectItem key={i} value={`${i + 1}`}>
                                        {i + 1} {i === 0 ? 'time' : 'times'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )

            case 3:
                const duplicateIndices = getDuplicateTimeIndices(form.times)
                return (
                    <div className="space-y-4">
                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                            {form.times.map((_: any, i: number) => (
                                <div key={i} className="space-y-1.5">
                                    <p className="text-xs text-gray-600">Dose {i + 1} Time</p>
                                    <Input
                                        type="time"
                                        value={form.times[i]}
                                        onChange={(e) => {
                                            const t = [...form.times]
                                            t[i] = e.target.value
                                            setForm({ ...form, times: t })

                                            // Check for duplicates immediately
                                            if (checkDuplicateTimes(t)) {
                                                setErrors({ times: "Each dose must have a different time" })
                                            } else {
                                                setErrors({})
                                            }
                                        }}
                                        className={`w-full ${duplicateIndices.includes(i) ? 'border-red-500' : ''}`}
                                    />
                                </div>
                            ))}
                        </div>
                        {errors.times && (
                            <p className="text-xs text-red-500">{errors.times}</p>
                        )}
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-4">
                        <Input
                            type="number"
                            placeholder="Enter total quantity"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                            className="w-full"
                            min="1"
                        />
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-1">
                            <span className="text-sm font-medium">Enable refill reminder</span>
                            <Switch
                                checked={form.restock}
                                onCheckedChange={(v) => {
                                    setForm({ ...form, restock: v })
                                    setErrors({})
                                }}
                            />
                        </div>
                        {form.restock && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium block">Refill Threshold Quantity</label>
                                <Input
                                    type="number"
                                    placeholder="Enter threshold quantity"
                                    value={form.threshold}
                                    onChange={(e) => {
                                        setForm({ ...form, threshold: e.target.value })
                                        setErrors({})
                                    }}
                                    className="w-full"
                                    min="1"
                                />
                                {errors.threshold && (
                                    <p className="text-xs text-red-500">{errors.threshold}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Must be less than total quantity ({form.quantity || '0'})
                                </p>
                            </div>
                        )}
                    </div>
                )

            case 6:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2.5 text-sm bg-gray-50 p-4 rounded-lg border">
                            {!isLoggedIn && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{form.email}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Medicine:</span>
                                <span className="font-medium">{form.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Doses per day:</span>
                                <span className="font-medium">{form.doses} {form.doses === 1 ? 'time' : 'times'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Times:</span>
                                <span className="font-medium">{form.times.join(", ")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total quantity:</span>
                                <span className="font-medium">{form.quantity}</span>
                            </div>
                            {form.restock && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Refill at:</span>
                                    <span className="font-medium">{form.threshold}</span>
                                </div>
                            )}
                        </div>
                        <Button className="w-full mt-4" onClick={handleSubmit}>
                            Set Reminder
                        </Button>
                    </div>
                )

            default:
                return null
        }
    }

    const isNextDisabled = () => {
        return !validateStep()
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">{getStepTitle()}</h2>
                <p className="text-sm text-muted-foreground">Step <span className="text-primary">{step}</span> of {isLoggedIn ? TOTAL_STEPS : TOTAL_STEPS + 1}</p>
            </div>

            <div className="space-y-6">
                {/* Step Content with Dynamic Height */}
                <div className={`${getStepHeight()} transition-all duration-300`}>
                    {renderStep()}
                </div>

                {/* Navigation Footer */}
                <div className="flex justify-between items-center pt-6">
                    <Button
                        variant="outline"
                        disabled={step === 1}
                        onClick={goBack}
                        className="px-6"
                    >
                        Back
                    </Button>

                    <div className="flex gap-1.5">
                        {Array.from({ length: isLoggedIn ? TOTAL_STEPS : TOTAL_STEPS + 1 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 w-2 rounded-full transition-all duration-300 ${i + 1 === step
                                        ? 'bg-primary w-6'
                                        : i + 1 < step
                                            ? 'bg-primary/50'
                                            : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {step < (isLoggedIn ? TOTAL_STEPS : TOTAL_STEPS + 1) ? (
                        <Button
                            onClick={goNext}
                            disabled={isNextDisabled()}
                            className="px-6"
                        >
                            Next
                        </Button>
                    ) : (
                        <div className="w-[76px]" />
                    )}
                </div>
            </div>
        </div>
    )
}