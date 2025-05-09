"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  RefreshCw,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { SecuritySession } from "../../../generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { SessionDetails } from "@/components/app/monitoring/SessionDetails";

import { SessionFilters } from "@/components/app/monitoring/SessionFilters";
import { UploadNumbersDialog } from "@/components/app/monitoring/UploadNumbersDialog";

interface Props {
  sessions: (SecuritySession & {
    batch: {
      name: string;
      id: string;
    } | null;
  })[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  uniqueStatuses: string[];
  uniqueDomains: string[];
  uniqueBatches: {
    id: string;
    name: string;
  }[];
}

// Page size is now provided from server component
const ITEMS_PER_PAGE = 10;

export default function ClientOnly({
  sessions: initialSessions,
  totalCount,
  currentPage,
  pageSize,
  uniqueBatches,
  uniqueStatuses,
  uniqueDomains,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters
  const page = Number(searchParams.get("page")) || currentPage;
  const searchQuery = searchParams.get("q") || "";

  const sortBy = searchParams.get("sort") || "updatedAt";
  const sortOrder = searchParams.get("order") || "desc";

  const [sessions, setSessions] = useState<
    (SecuritySession & {
      batch: {
        name: string;
        id: string;
      } | null;
    })[]
  >(initialSessions);
  const [selectedSession, setSelectedSession] = useState<
    | (SecuritySession & {
        batch: {
          name: string;
          id: string;
        } | null;
      })
    | null
  >(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Pagination
  const totalItems = totalCount;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, page), totalPages);

  // Use the server-provided paginated sessions directly
  const paginatedSessions = sessions;

  useEffect(() => {
    setSessions(initialSessions);
  }, [initialSessions]);

  // Update URL with filters
  const updateUrlParams = async (
    params: Record<string, string | number | null>
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    // Reset page when changing filters or search
    if (
      !("page" in params) &&
      (params.q !== undefined ||
        params.status !== undefined ||
        params.batch !== undefined)
    ) {
      newParams.set("page", "1");
    }
    const newUrl = `?${newParams.toString()}`;
    await router.replace(newUrl, { scroll: false });
    // And then re-fetch the Server Component data
    router.refresh();
    console.log("URL updated and data refreshed:", newParams.toString());
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      router.refresh();
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this batch and all its sessions?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/monitoring/batches?batchId=${batchId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete batch");
      }

      setSessions((prev) => prev.filter((s) => s.batchId !== batchId));
      toast.success("Batch deleted successfully");
    } catch (error) {
      console.error("Error deleting batch:", error);
      toast.error("Failed to delete batch");
    }
  };

  const handleSearch = (value: string) => {
    updateUrlParams({ q: value || null });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      updateUrlParams({
        sort: column,
        order: sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      // Default to desc for new column
      updateUrlParams({ sort: column, order: "desc" });
    }
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Security Sessions Monitor</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Numbers
          </Button>
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {showFilters && (
        <SessionFilters
          updateUrlParams={updateUrlParams}
          uniqueStatuses={uniqueStatuses}
          uniqueBatches={uniqueBatches}
          uniqueDomains={uniqueDomains}
        />
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by security code, phone number, status, or batch ID..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border mb-4 p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("securityCode")}
                className="cursor-pointer"
              >
                Security Code {getSortIcon("securityCode")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("phoneNumber")}
                className="cursor-pointer"
              >
                Phone Number {getSortIcon("phoneNumber")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("status")}
                className="cursor-pointer"
              >
                Status {getSortIcon("status")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("batchId")}
                className="cursor-pointer"
              >
                Domain
              </TableHead>
              <TableHead
                onClick={() => handleSort("updatedAt")}
                className="cursor-pointer"
              >
                Updated At {getSortIcon("updatedAt")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSessions.length > 0 ? (
              paginatedSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    {session.securityCode}
                  </TableCell>
                  <TableCell>{session.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{session.domain || "N/A"}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(session.updatedAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                      >
                        View
                      </Button>
                      {session.batchId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteBatch(session.batchId!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing{" "}
          {paginatedSessions.length > 0
            ? (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1
            : 0}
          -{Math.min(safeCurrentPage * ITEMS_PER_PAGE, totalItems)} of{" "}
          {totalItems} sessions
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Show pages around the current page
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else {
                // Calculate which page numbers to show based on current page
                const middleIndex = 2; // Middle of the 5 buttons
                let startPage = safeCurrentPage - middleIndex;

                if (startPage < 1) {
                  startPage = 1;
                } else if (startPage + 4 > totalPages) {
                  startPage = totalPages - 4;
                }

                pageNumber = startPage + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={
                    safeCurrentPage === pageNumber ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className="w-8 h-8"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Dialog */}
      <UploadNumbersDialog
        showUploadDialog={showUploadDialog}
        setShowUploadDialog={setShowUploadDialog}
        setSessions={setSessions}
        uniqueBatches={uniqueBatches}
      />

      {/* Session Details Modal */}
      <SessionDetails
        session={selectedSession}
        setSelectedSession={setSelectedSession}
        onDelete={(sessionId) => {
          setSessions((prev) => prev.filter((s) => s.id !== sessionId));
          setSelectedSession(null);
          toast.success("Session deleted successfully");
        }}
        onRefresh={(updatedSession) => {
          setSessions((prev) =>
            prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
          );
          setSelectedSession(updatedSession);
          toast.success("Session updated successfully");
        }}
      />
    </div>
  );
}
