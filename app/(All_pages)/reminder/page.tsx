"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReminderWizard from "@/components/reminder/ReminderWizard";
import { reminderApi } from "@/lib/api/reminderApi";
import { toast } from "sonner";

export default function ReminderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setLoading(true);

    try {
      // Transform form data to API format
      const apiData = {
        medicine_name: formData.medicine_name,
        medicine_type: formData.medicine_type,
        dose_count_daily: formData.dose_count_daily,
        notification_methods: formData.notification_methods || [],
        start_date: formData.start_date,
        quantity: Number(formData.quantity),
        refill_reminder: formData.refill_reminder || false,
        refill_threshold: formData.refill_reminder && formData.refill_threshold 
          ? Number(formData.refill_threshold) 
          : undefined,
        dose_schedules: formData.dose_schedules,
        phone_number: formData.phone_number || undefined,
      };

      // Call create reminder API
      const response = await reminderApi.createReminder(apiData);

      toast.success("Medicine reminder created successfully!");
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error: any) {
      console.error("Failed to create reminder:", error);
      
      // Extract error message
      const errorMsg = 
        error?.response?.data?.medicine_name?.[0] ||
        error?.response?.data?.dose_schedules?.[0] ||
        error?.response?.data?.notification_methods?.[0] ||
        error?.response?.data?.detail ||
        "Failed to create reminder";
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Creating reminder...</p>
          </div>
        </div>
      )}
      <ReminderWizard onSubmit={handleSubmit} />
    </div>
  );
}