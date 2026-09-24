import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SecuritySession } from "@binance/db";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { toast } from "sonner";

interface UploadNumbersDialogProps {
  showUploadDialog: boolean;
  setShowUploadDialog: (show: boolean) => void;
  setSessions: React.Dispatch<
    React.SetStateAction<
      (SecuritySession & {
        batch: {
          name: string;
          id: string;
        } | null;
      })[]
    >
  >;
  uniqueBatches: {
    id: string;
    name: string;
  }[];
}

export function UploadNumbersDialog({
  showUploadDialog,
  setShowUploadDialog,
  setSessions,
  uniqueBatches,
}: UploadNumbersDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [batchName, setBatchName] = useState("");
  const [batchNameError, setBatchNameError] = useState("");

  const handleUpload = async () => {
    // Validate batch name
    if (batchName.length < 3) {
      setBatchNameError("Batch name must be at least 3 characters long");
      return;
    }

    if (uniqueBatches.some((batch) => batch.name === batchName)) {
      setBatchNameError("Batch name must be unique");
      return;
    }
    try {
      setIsUploading(true);
      const numbers = phoneNumbers
        .split("\n")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      if (numbers.length === 0) {
        toast.error("Please enter at least one phone number");
        return;
      }

      const response = await fetch("/api/monitoring/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumbers: numbers }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload numbers");
      }

      const data = await response.json();
      setSessions((prev) => [...data.sessions, ...prev]);
      setShowUploadDialog(false);
      setPhoneNumbers("");
      toast.success(`Successfully created ${numbers.length} sessions`);
    } catch (error) {
      console.error("Error uploading numbers:", error);
      toast.error("Failed to upload numbers");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Phone Numbers</DialogTitle>
          <DialogDescription>
            You can upload phone numbers in bulk by entering them below. Each
            number should be on a new line.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Enter phone numbers (one per line)
            </p>
            <Textarea
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              placeholder="+1234567890&#10;+0987654321&#10;..."
              className="h-32"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Batch Name</p>
            <Input
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="Batch Name"
              className={cn(
                "w-full",
                batchNameError ? "border-red-500" : "border-gray-300"
              )}
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter a unique name for this batch. This will help you identify it
            </p>
            {batchNameError && (
              <p className="text-xs text-red-500 mt-1">{batchNameError}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
