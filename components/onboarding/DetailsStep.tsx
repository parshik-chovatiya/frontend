"use client";

import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DetailsStepProps {
  data: any;
  updateData: (newData: any) => void;
}

export default function DetailsStep({ data, updateData }: DetailsStepProps) {
  const [open, setOpen] = useState(false);

  // Convert stored birthdate to Date object
  const dateValue = data.birthdate ? new Date(data.birthdate) : undefined;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");

      updateData({ birthdate: `${year}-${month}-${day}` });
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label>Gender</Label>

        <div className="flex gap-3 w-full">
          {["male", "female", "other"].map((g) => {
            const isActive = data.gender === g;

            return (
              <Button
                key={g}
                variant={isActive ? "default" : "outline"}
                onClick={() => updateData({ gender: g })}
                className={`
          flex-1 
          rounded-lg
          font-medium 
          transition-colors
          ${isActive ? "" : "hover:bg-accent"}
        `}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1">
          Date of birth
        </Label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-full justify-between font-normal"
            >
              {dateValue ? dateValue.toLocaleDateString() : "Select date"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
