"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyIcon, CheckIcon } from "lucide-react";
import { TooltipContent } from "@radix-ui/react-tooltip";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  extraDetails?: string;
  className?: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  extraDetails,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() => setCopied(true))
      .catch((err) => console.error("Copy failed:", err));
  };

  // Reset copied state after 2s
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div
      className={clsx(
        "flex items-start space-x-4 w-full verflow-hidden",
        className
      )}
    >
      {/* Icon */}
      <div className="mt-1 text-gray-500">{icon}</div>

      {/* Content */}
      <div className="f">
        {/* Header: label + copy button */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">{label}</span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                aria-label={`Copy ${label}`}
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
          </Tooltip>
        </div>

        {/* Main value */}
        <p className="mt-1 text-gray-900 w-full break-all">{value ?? "N/A"}</p>

        {/* Optional extra details */}
        {extraDetails && (
          <p className="mt-1 text-xs text-gray-400">{extraDetails}</p>
        )}
      </div>
    </div>
  );
};
