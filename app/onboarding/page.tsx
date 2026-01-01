"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import NameStep from "@/components/onboarding/NameStep";
import DetailsStep from "@/components/onboarding/DetailsStep";
import { authApi } from "@/lib/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/_authSlice";
import { toast } from "sonner";

interface OnboardingData {
  name: string;
  gender: string;
  birthdate: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [data, setData] = useState<OnboardingData>({
    name: "",
    gender: "",
    birthdate: "",
  });

  // Check if user is already onboarded
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.is_onboarded) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const steps = [
    {
      title: "What's your name?",
      component: NameStep,
      image: "/images/step1.png",
      validate: () => true, // Optional step
    },
    {
      title: "Tell us about yourself",
      component: DetailsStep,
      image: "/images/step2.png",
      validate: (data: OnboardingData) => {
        if (!data.gender) {
          toast.error("Please select a gender");
          return false;
        }
        if (!data.birthdate) {
          toast.error("Please select your birthdate");
          return false;
        }
        return true;
      },
    },
  ];

  async function handleComplete() {
    if (!data.gender || !data.birthdate) {
      toast.error("Complete all required fields");
      return;
    }

    try {
      // Call onboarding API
      const res = await authApi.completeOnboarding({
        name: data.name.trim() || user?.email.split('@')[0] || '',
        gender: data.gender,
        birthdate: data.birthdate,
      });

      const updatedUser = res.data.user;

      // Update user in Redux
      dispatch(setUser(updatedUser));

      toast.success("Welcome! Onboarding complete.");
      router.push("/dashboard");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.name?.[0]
        || err?.response?.data?.birthdate?.[0]
        || err?.response?.data?.gender?.[0]
        || err?.response?.data?.detail 
        || "Failed to complete onboarding";
      toast.error(errorMsg);
    }
  }

  return (
    <OnboardingWizard
      steps={steps}
      data={data}
      setData={setData}
      onComplete={handleComplete}
    />
  );
}