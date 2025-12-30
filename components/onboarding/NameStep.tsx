"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NameStepProps {
  data: any;
  updateData: (newData: any) => void;
}

export default function NameStep({ data, updateData }: NameStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2">Your Name</Label>
        <Input
          placeholder="Enter your name"
          value={data.name || ""}
          onChange={(e) => updateData({ name: e.target.value })}
        />
      </div>
    </div>
  );
}