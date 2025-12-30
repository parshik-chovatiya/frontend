"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const features = [
    "Smart Reminder Alerts",
    "Easy Medicine Tracking",
    "Daily Adherence Reports",
  ];

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div
      className=" w-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url('/images/background.png')` }}
    >
      {/* Top Right Login Button */}
      <div className="w-full justify-end flex">
        <div className="w-fit justify-end my-4 mx-10">
          <Button variant={"outline"}>
            <Link href="/login" className="text-lg">Login</Link>
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full flex justify-center">
        <div className="w-[400px] h-[300px] relative">
          <Image
            src="/images/home.svg"
            alt="Medical Care"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Center Content */}
      <div className="flex justify-center items-center flex-col text-center gap-4">

        <div className="flex flex-col justify-center ">
          <span className="text-primary text-5xl mb-2 uppercase mb-4">Never Miss Your Medicine</span>
          <span className="text-lg">Get timely reminders and stay healthy with smart alerts that fit your routine.</span>
        </div>
        <div className="flex flex-col gap-4 w-fit">
          {features.map((text, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-secondary shadow-sm rounded-full py-2 px-5"
            >
              {/* SHADCN Badge */}
              <Badge
                variant="destructive"
                className="rounded-full p-2 flex items-center justify-center"
              >
                <Check size={16} className="text-white" strokeWidth={3} />
              </Badge>

              <span className=" font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center flex-col text-center gap-4">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button
            variant="default"
            className="relative h-full bottom-0 mt-4 px-12 py-2 rounded-full"
            disabled={loading}
            onClick={() => router.push("/onboarding")}
          >
            {loading ? "Loading..." : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}
