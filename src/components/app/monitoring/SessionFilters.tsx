import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

interface SessionFiltersProps {
  updateUrlParams: (params: Record<string, string | number | null>) => void;
  uniqueStatuses: string[];
  uniqueBatches: {
    id: string;
    name: string;
  }[];
  uniqueDomains: string[];
  handleDeleteBatch: (batchId: string) => void;
}

export function SessionFilters({
  updateUrlParams,
  uniqueBatches,
  uniqueStatuses,
  uniqueDomains,
  handleDeleteBatch,
}: SessionFiltersProps) {
  const searchParams = useSearchParams();

  const statusFilter = searchParams.get("status") || "";
  const batchFilter = searchParams.get("batch") || "";
  const domainFilter = searchParams.get("domain") || "";
  const handleStatusFilter = (value: string) => {
    updateUrlParams({ status: value || null });
  };

  const handleBatchFilter = (value: string) => {
    updateUrlParams({ batch: value || null });
  };

  const handleDomainFilter = (value: string) => {
    updateUrlParams({ domain: value || null });
  };

  const clearFilters = () => {
    updateUrlParams({
      q: null,
      status: null,
      batch: null,
      domain: null,
      page: 1,
    });
  };
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Filters</CardTitle>
          {(statusFilter || batchFilter || domainFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" /> Clear Filters
            </Button>
          )}
        </div>
        <CardDescription>
          Filter sessions by status and batch ID
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Batch ID</label>
            <Select value={batchFilter} onValueChange={handleBatchFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {uniqueBatches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id || ""}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Domain</label>
            <Select value={domainFilter} onValueChange={handleDomainFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {uniqueDomains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          {batchFilter && batchFilter !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteBatch(batchFilter)}
              className="h-8 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            >
              Delete Batch
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
