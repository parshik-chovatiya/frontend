"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pill,
    Droplet,
    Syringe,
    Thermometer,
    Calendar,
    Clock,
    Package,
    CheckCircle2,
} from "lucide-react";

import { DatePicker } from "@/components/ui/datePicker";
const TOTAL_STEPS = 5;

const MEDICINE_TYPES = [
    { value: "tablet", label: "Tablet", icon: Pill, bgColor: "#ff7078" },
    { value: "capsule", label: "Capsule", icon: Thermometer, bgColor: "#fab005" },
    { value: "injection", label: "Injection", icon: Syringe, bgColor: "#228be6" },
    { value: "syrup", label: "Syrup", icon: Droplet, bgColor: "#845ef7" },
];

const NOTIFICATION_OPTIONS = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Browser Notification" }
]

const STEP_IMAGES = {
    1: "/step1.png",
    2: "/step2.png",
    3: "/step3.png",
    4: "/step4.png",
    5: "/step5.png",
};

export default function Reminder({ onSubmit: onSubmitProp, }: { onSubmit?: (data: any) => void; }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<any>({
        name: "",
        medicineType: "tablet",
        NotificationType: ["email"],
        email: "",
        countryCode: "+91",
        mobileNumber: "",
        browserPermission: false,
        doses: 1,
        times: [""],
        doseAmounts: [1],
        startDate: "",
        quantity: "",
        enableThreshold: false,
        threshold: "",
    });

    useEffect(() => {
        // Replace this with your actual store email fetch
        const userEmail = null; // Get from your store: useStore((state) => state.user?.email)
        setForm((prev: any) => ({
            ...prev,
            email: userEmail || "JohnDeo@gmail.com"
        }));
    }, []);
    const [errors, setErrors] = useState<any>({});

    const checkDuplicateTimes = (times: string[]) => {
        const filledTimes = times.filter((t: string) => t.length > 0);
        const uniqueTimes = new Set(filledTimes);
        return filledTimes.length !== uniqueTimes.size;
    };

    const getDuplicateTimeIndices = (times: string[]) => {
        const duplicates: number[] = [];
        const timeMap: { [key: string]: number[] } = {};

        times.forEach((time, index) => {
            if (time.length > 0) {
                if (!timeMap[time]) {
                    timeMap[time] = [];
                }
                timeMap[time].push(index);
            }
        });

        Object.values(timeMap).forEach((indices) => {
            if (indices.length > 1) {
                duplicates.push(...indices);
            }
        });

        return duplicates;
    };

    const goNext = () => {
        const valid = validateStep();
        if (valid) {
            setErrors({});
            setStep((prev) => prev + 1);
        } else {
            if (step === 3) {
                if (checkDuplicateTimes(form.times)) {
                    setErrors({ times: "Each dose must have a different time" });
                }
            } else if (step === 4 && form.threshold) {
                const threshold = Number(form.threshold);
                const quantity = Number(form.quantity);
                if (threshold <= 0) {
                    setErrors({ threshold: "Threshold must be greater than 0" });
                } else if (threshold >= quantity) {
                    setErrors({
                        threshold: "Threshold must be less than total quantity",
                    });
                }
            }
        }
    };

    const goBack = () => {
        setErrors({});
        setStep((prev) => prev - 1);
    };

    const validateStep = () => {
        switch (step) {
            case 1:
                return form.name.trim().length > 0 && form.medicineType.length > 0;
            case 2:
                if (form.doses <= 0 || form.times.length !== form.doses) return false;
                if ((form.NotificationType || []).length === 0) return false;

                // Validate email if email is selected
                if ((form.NotificationType || []).includes("email")) {
                    if (!form.email || !form.email.includes("@")) return false;
                }

                // Validate mobile number if SMS is selected
                if ((form.NotificationType || []).includes("sms")) {
                    if (!form.mobileNumber || form.mobileNumber.trim().length < 10) return false;
                }

                // Validate browser permission if push is selected
                if ((form.NotificationType || []).includes("push")) {
                    if (!form.browserPermission) return false;
                }

                return true;
            case 3:
                if (!form.startDate) return false;
                if (!form.times.every((t: string) => t.length > 0)) return false;
                if (!form.doseAmounts.every((a: number) => a > 0)) return false;
                return !checkDuplicateTimes(form.times);
            case 4:
                if (!form.quantity || Number(form.quantity) <= 0) return false;
                if (form.enableThreshold && form.threshold) {
                    const threshold = Number(form.threshold);
                    const quantity = Number(form.quantity);
                    if (threshold <= 0 || threshold >= quantity) return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleSubmit = () => {
        if (onSubmitProp) {
            onSubmitProp(form);
        } else {
            console.log("Medicine Reminder Set:", form);
            alert("Medicine reminder has been set successfully!");
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1:
                return "Medicine Details";
            case 2:
                return "Select Doses Per Day";
            case 3:
                return "Set Timing for Each Dose";
            case 4:
                return "Quantity & Refill Settings";
            case 5:
                return "Review & Confirm";
            default:
                return "";
        }
    };

    const getStepIcon = () => {
        switch (step) {
            case 1:
                return Pill;
            case 2:
                return Calendar;
            case 3:
                return Clock;
            case 4:
                return Package;
            case 5:
                return CheckCircle2;
            default:
                return Pill;
        }
    };

    const getStepImage = () => {
        return STEP_IMAGES[step as keyof typeof STEP_IMAGES] || STEP_IMAGES[1];
    };

    const getContainerHeight = () => {
        return "md:h-[500px]";
    };

    const getStepHeight = () => {
        return "h-[300px]";
    };

    const currentIndex = MEDICINE_TYPES.findIndex(
        (t) => t.value === form.medicineType
    );
    const getRelativePosition = (index) => {
        const total = MEDICINE_TYPES.length;
        let diff = index - currentIndex;

        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        return diff;
    };
    const getMedicineTypeLabel = (type: string) => {
        return (
            MEDICINE_TYPES.find((t) => t.value === type)?.label.toLowerCase() || type
        );
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        {/* Framer Motion Icon Carousel */}
                        <div className="flex items-center justify-center overflow-hidden">
                            <div className="relative w-full h-26 max-w-sm mx-auto">
                                {MEDICINE_TYPES.map((type, index) => {
                                    const Icon = type.icon
                                    const position = getRelativePosition(index) // -2 -1 0 +1 +2
                                    const isCenter = position === 0

                                    return (
                                        <motion.div
                                            key={type.value}
                                            className="absolute left-1/2 top-1/2 -translate-y-1/2"
                                            initial={false}
                                            animate={{
                                                x: `calc(-50% + ${position * 110}px)`,
                                                opacity:
                                                    Math.abs(position) === 0
                                                        ? 1
                                                        : Math.abs(position) === 1
                                                            ? 0.75
                                                            : 0,
                                                scale: isCenter ? 1 : 0.85
                                            }}
                                            transition={{
                                                duration: 0.35,
                                                ease: "linear"
                                            }}
                                        >
                                            <div className="rounded-full flex items-center justify-center shadow-sm text-white"
                                                style={{
                                                    width: isCenter ? 96 : 80,
                                                    height: isCenter ? 96 : 80,
                                                    opacity: isCenter ? 1 : 0.4,
                                                    backgroundColor: type.bgColor
                                                }}
                                            >
                                                <Icon
                                                    className={`${isCenter ? "w-16 h-16" : "w-12 h-12"}`}
                                                />
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Medicine Name</label>
                                <Input
                                    placeholder="Enter medicine name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full h-9"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter the name of your medicine as prescribed by your doctor
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Medicine Type</label>
                                <Select
                                    value={form.medicineType}
                                    onValueChange={(v) => setForm({ ...form, medicineType: v })}
                                >
                                    <SelectTrigger className="w-full h-9">
                                        <SelectValue placeholder="Select medicine type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MEDICINE_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Select how many times you need to take this medicine each day
                            </p>
                            <Select
                                value={form.doses.toString()}
                                onValueChange={(v) =>
                                    setForm({
                                        ...form,
                                        doses: Number(v),
                                        times: Array(Number(v)).fill(""),
                                        doseAmounts: Array(Number(v)).fill(1),
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9">
                                    <SelectValue placeholder="Select doses per day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <SelectItem key={i} value={`${i + 1}`}>
                                            {i + 1} {i === 0 ? "time" : "times"} Daily
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                Select notification methods
                            </p>
                            <div className="w-full flex gap-2 overflow-x-auto ">
                                {NOTIFICATION_OPTIONS.map((option) => {
                                    const isSelected = (form.NotificationType || []).includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                const currentNotifications = form.NotificationType || [];
                                                if (isSelected) {
                                                    setForm({
                                                        ...form,
                                                        NotificationType: currentNotifications.filter(
                                                            (type: string) => type !== option.value
                                                        ),
                                                    });
                                                } else {
                                                    setForm({
                                                        ...form,
                                                        NotificationType: [...currentNotifications, option.value],
                                                    });
                                                }
                                            }}
                                            className={`px-4 py-1 rounded-lg border-2 transition-all font-medium text-sm        whitespace-nowrap flex-shrink-0 ${isSelected
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background text-foreground border-border hover:border-primary/50"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Conditional Inputs Based on Selected Notification Types */}
                        {(form.NotificationType || []).length > 0 && (
                            <div className="space-y-4 overflow-y-scroll max-h-30 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-4 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {/* Email Input */}
                                {(form.NotificationType || []).includes("email") && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <Input
                                            type="email"
                                            value={form.email}
                                            disabled
                                            className="bg-muted cursor-not-allowed h-9"
                                        />
                                    </div>
                                )}

                                {/* SMS Input */}
                                {(form.NotificationType || []).includes("sms") && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Mobile Number</label>
                                        <div className="flex gap-2">
                                            <Select
                                                value={form.countryCode}
                                                onValueChange={(v) =>
                                                    setForm({ ...form, countryCode: v })
                                                }
                                            >
                                                <SelectTrigger className="w-24 h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="+1">+1</SelectItem>
                                                    <SelectItem value="+44">+44</SelectItem>
                                                    <SelectItem value="+91">+91</SelectItem>
                                                    <SelectItem value="+86">+86</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="tel"
                                                placeholder="Enter mobile number"
                                                value={form.mobileNumber}
                                                onChange={(e) =>
                                                    setForm({ ...form, mobileNumber: e.target.value })
                                                }
                                                className="flex-1 h-9"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Browser Notification Permission - Switch */}
                                {(form.NotificationType || []).includes("push") && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
                                            <div className="space-y-0.5">
                                                <label className="text-sm font-medium">Browser Notifications</label>
                                                <p className="text-xs text-muted-foreground">
                                                    {form.browserPermission
                                                        ? "Permission granted"
                                                        : "Enable to receive browser notifications"}
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.browserPermission}
                                                    onChange={async (e) => {
                                                        if (e.target.checked) {
                                                            if ("Notification" in window) {
                                                                const permission = await Notification.requestPermission();
                                                                setForm({
                                                                    ...form,
                                                                    browserPermission: permission === "granted"
                                                                });
                                                            } else {
                                                                alert("Browser notifications not supported");
                                                            }
                                                        } else {
                                                            setForm({
                                                                ...form,
                                                                browserPermission: false
                                                            });
                                                        }
                                                    }}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            case 3:
                const duplicateIndices = getDuplicateTimeIndices(form.times);
                return (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                            <label className="text-sm font-medium">Start Date :</label>
                            <DatePicker
                                value={form.startDate ? new Date(form.startDate + "T00:00:00") : undefined}
                                minDate={new Date()}
                                onChange={(date) => {
                                    if (date) {
                                        const year = date.getFullYear()
                                        const month = String(date.getMonth() + 1).padStart(2, '0')
                                        const day = String(date.getDate()).padStart(2, '0')
                                        setForm({
                                            ...form,
                                            startDate: `${year}-${month}-${day}`,
                                        })
                                    } else {
                                        setForm({
                                            ...form,
                                            startDate: "",
                                        })
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-2.5 max-h-[250px] pr-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-4 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {form.times.map((_: any, i: number) => (
                                <div key={i} className="border rounded-lg p-3 bg-primary/2 space-y-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        Dose {i + 1}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">Amount</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={form.doseAmounts[i]}
                                                    onChange={(e) => {
                                                        const amounts = [...form.doseAmounts];
                                                        amounts[i] = Number(e.target.value);
                                                        setForm({ ...form, doseAmounts: amounts });
                                                    }}
                                                    className="w-full h-8 text-sm bg-white"
                                                    min="1"
                                                />
                                                <span className="text-xs text-gray-600 whitespace-nowrap uppercase">
                                                    {getMedicineTypeLabel(form.medicineType)}
                                                    {form.doseAmounts[i] > 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">Time</label>
                                            <Input
                                                type="time"
                                                value={form.times[i]}
                                                onChange={(e) => {
                                                    const t = [...form.times];
                                                    t[i] = e.target.value;
                                                    setForm({ ...form, times: t });

                                                    if (checkDuplicateTimes(t)) {
                                                        setErrors({
                                                            times: "Each dose must have a different time",
                                                        });
                                                    } else {
                                                        setErrors({});
                                                    }
                                                }}
                                                className={`w-full h-8 text-sm bg-white${duplicateIndices.includes(i) ? "border-red-500" : ""
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.times && (
                            <p className="text-xs text-red-500">{errors.times}</p>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Total Pills/Tablets</label>
                            <Input
                                type="number"
                                placeholder="Enter total quantity"
                                value={form.quantity}
                                onChange={(e) => {
                                    setForm({ ...form, quantity: e.target.value });
                                    setErrors({});
                                }}
                                className="w-full h-9"
                                min="1"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the total quantity of medicine you have
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-sm font-medium">
                                    Enable refill reminder
                                </span>
                                <Switch
                                    checked={form.enableThreshold}
                                    onCheckedChange={(v) => {
                                        setForm({
                                            ...form,
                                            enableThreshold: v,
                                            threshold: v ? form.threshold : "",
                                        });
                                        setErrors({});
                                    }}
                                />
                            </div>

                            {form.enableThreshold && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">
                                        Remind me when stock reaches
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="Enter threshold quantity"
                                        value={form.threshold}
                                        onChange={(e) => {
                                            setForm({ ...form, threshold: e.target.value });
                                            setErrors({});
                                        }}
                                        className={`w-full h-9 ${errors.threshold ? "border-red-500" : ""
                                            }`}
                                        min="1"
                                    />
                                    {errors.threshold && (
                                        <p className="text-xs text-red-500">{errors.threshold}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        We will remind you to refill when your medicine stock reaches
                                        this level
                                        {form.quantity && ` (must be less than ${form.quantity})`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-3 h-full flex flex-col ">
                        <div className="space-y-2 text-xs bg-gray-50 p-3 rounded-lg border overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-4 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Medicine :</span>
                                <span className="font-medium">{form.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Medicine Type :</span>
                                <span className="font-medium capitalize">{form.medicineType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Notification Type :</span>
                                <span className="font-medium capitalize">
                                    {(form.NotificationType || [])
                                        .map((type: string) => {
                                            const option = NOTIFICATION_OPTIONS.find(opt => opt.value === type);
                                            return option ? option.label : type;
                                        })
                                        .join(', ')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Start Date :</span>
                                <span className="font-medium">{new Date(form.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Doses per dayb :</span>
                                <span className="font-medium">{form.doses} {form.doses === 1 ? 'time' : 'times'} Daily</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <span className="text-gray-600 font-medium">Schedule :</span>
                                {form.times.map((time: string, i: number) => (
                                    <div key={i} className="flex justify-between mt-1 ml-2">
                                        <span className="text-gray-600">Dose {i + 1}:</span>

                                        <span className="font-medium">
                                            {form.doseAmounts[i]} {getMedicineTypeLabel(form.medicineType)}{form.doseAmounts[i] > 1 ? 's' : ''} at {time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total quantity :</span>
                                <span className="font-medium">{form.quantity}</span>
                            </div>
                            {form.enableThreshold && form.threshold && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Refill alert at :</span>
                                    <span className="font-medium">{form.threshold}</span>
                                </div>
                            )}
                        </div>
                        <Button className="w-full h-9" onClick={handleSubmit}>
                            Set Reminder
                        </Button>
                    </div>
                )

            default:
                return null;
        }
    };

    const isNextDisabled = () => {
        return !validateStep();
    };

    const StepIcon = getStepIcon();

    return (
        <div className="flex flex-col">
            {/* Main Container - Combined Card */}
            <div className="w-full max-w-6xl mx-auto px-4 pt-2">
                <div
                    className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${getContainerHeight()}`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                        {/* Right Side - Image (Desktop only) */}
                        <div className="hidden md:flex bg-gradient-to-br from-primary/5 to-purple-100 items-center justify-center overflow-hidden">
                            <img
                                src={getStepImage()}
                                alt={getStepTitle()}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                        </div>
                        {/* Left Side - Form */}
                        <div className="w-full p-6 flex flex-col">
                            {/* Icon Header - Only visible on mobile */}
                            <div className="flex justify-center md:hidden mb-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <StepIcon className="w-8 h-8 text-primary" />
                                </div>
                            </div>

                            <div className="space-y-1 text-center md:text-left mb-4">
                                <h2 className="text-3xl font-semibold tracking-tight mb-3">
                                    {getStepTitle()}
                                </h2>
                                <p className="text-muted-foreground">
                                    Step <span className="text-primary">{step}</span> of{" "}
                                    {TOTAL_STEPS}
                                </p>
                            </div>

                            {/* Step Content with Dynamic Height */}
                            <div
                                className={`grow ${getStepHeight()} transition-all duration-300`}
                            >
                                {renderStep()}
                            </div>

                            {/* Navigation Footer */}
                            <div className="flex justify-between items-center pt-4 mt-auto">
                                <Button
                                    variant="outline"
                                    disabled={step === 1}
                                    onClick={goBack}
                                    className="px-5 h-9"
                                >
                                    Back
                                </Button>

                                <div className="flex gap-1.5">
                                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i + 1 === step
                                                ? "bg-primary w-5"
                                                : i + 1 < step
                                                    ? "bg-primary/50"
                                                    : "bg-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {step < TOTAL_STEPS ? (
                                    <Button
                                        onClick={goNext}
                                        disabled={isNextDisabled()}
                                        className="px-5 h-9"
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <div className="w-[68px]" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
