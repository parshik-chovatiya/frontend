"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Step {
  title: string;
  component: React.ComponentType<StepComponentProps>;
  image?: string;
  validate?: (data: any) => boolean;
}

interface StepComponentProps {
  data: any;
  updateData: (newData: any) => void;
}

interface OnboardingWizardProps {
  steps: Step[];
  data: any;
  setData: (data: any) => void;
  onComplete: () => void;
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function OnboardingWizard({
  steps,
  data,
  setData,
  onComplete,
}: OnboardingWizardProps) {
  const [current, setCurrent] = useState(0);
  const [contentHeight, setContentHeight] = useState<string>("auto");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const step = steps[current];

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(`${height}px`);
    }
  }, [current]);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    element.style.animation = "none";
    setTimeout(() => {
      element.style.animation = "slideIn 0.5s ease-out";
    }, 10);
  }, [current]);

  // Update data helper
  const updateData = (newData: any) => {
    setData({ ...data, ...newData });
  };

  // Validate current step
  const validateStep = () => {
    if (!step.validate) return true;
    return step.validate(data);
  };

  // Next step handler
  const next = () => {
    if (!validateStep()) return;

    if (current < steps.length - 1) {
      setCurrent((s) => s + 1);
    } else {
      onComplete();
    }
  };

  // Previous step handler
  const prev = () => {
    if (current > 0) {
      setCurrent((s) => s - 1);
    }
  };

  // Render step component
  const renderStepComponent = () => {
    const StepComponent = step.component;
    return <StepComponent data={data} updateData={updateData} />;
  };

  // Determine button configuration
  const isFirstStep = current === 0;
  const isLastStep = current === steps.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left side - Form */}
        <div className="p-8 flex flex-col">
          {/* Stepper Progress */}
          <div className="flex gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all duration-300",
                  i <= current ? "bg-blue-600" : "bg-gray-200"
                )}
              />
            ))}
          </div>

          {/* Content Container with Fixed Height */}
          <div
            ref={contentRef}
            className="flex-1 w-full"
          >
            <div ref={containerRef}>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {step.title}
              </h1>

              <div className="space-y-4">{renderStepComponent()}</div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 mt-auto">
            {!isFirstStep && (
              <Button variant="outline" onClick={prev} className="px-8">
                Previous
              </Button>
            )}

            {isFirstStep && <div />}

            <Button
              onClick={next}
              className={cn("px-8", isFirstStep && "ml-auto")}
            >
              {isLastStep ? "Submit" : "Next"}
            </Button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <img
            src={
              step.image ||
              "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600"
            }
            alt="onboarding illustration"
            className="max-w-md w-full drop-shadow-2xl rounded-2xl object-cover"
          />
        </div>
      </div>
    </div>
  );
}