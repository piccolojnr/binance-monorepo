import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserIcon,
  ShieldIcon,
  CopyIcon,
  CheckIcon,
  BanIcon,
  RefreshCw,
  Loader2,
  Clock,
  Globe,
  Smartphone,
  Key,
  AlertTriangle,
  Info,
} from "lucide-react";
import { SecuritySession } from "../../../../generated/prisma";
import { InfoItem } from "./InfoItem";

export const SessionDetails = ({
  session,
  setSelectedSession,
  onDelete,
  onRefresh,
}: {
  session:
    | (SecuritySession & {
        batch: {
          name: string;
          id: string;
        } | null;
      })
    | null;
  setSelectedSession: (
    session:
      | (SecuritySession & {
          batch: {
            name: string;
            id: string;
          } | null;
        })
      | null
  ) => void;
  onDelete?: (sessionId: string) => void;
  onRefresh?: (
    session: SecuritySession & {
      batch: {
        name: string;
        id: string;
      } | null;
    }
  ) => void;
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedRecoveryPhrase, setCopiedRecoveryPhrase] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDelete = async () => {
    if (session) {
      try {
        setIsDeleting(true);
        const response = await fetch(`/api/security/sessions/${session.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          if (onDelete) {
            onDelete(session.id);
          }
        } else {
          console.error("Failed to delete session");
        }
      } catch (error) {
        console.error("Error deleting session:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCopyCode = () => {
    if (session) {
      navigator.clipboard.writeText(session.securityCode).then(
        () => {
          setCopiedCode(true);
          setTimeout(() => {
            setCopiedCode(false);
          }, 2000);
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  };

  const handleCopyRecoveryPhrase = () => {
    if (session) {
      navigator.clipboard.writeText(session.recoveryPhrase || "").then(
        () => {
          setCopiedRecoveryPhrase(true);
          setTimeout(() => {
            setCopiedRecoveryPhrase(false);
          }, 2000);
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  };

  const handleRefresh = async () => {
    if (session) {
      try {
        setIsRefreshing(true);
        const response = await fetch(`/api/security/sessions/${session.id}`, {
          method: "GET",
        });
        if (response.ok) {
          const updatedSession = await response.json();
          if (onRefresh) {
            onRefresh(updatedSession);
          }
        } else {
          console.error("Failed to refresh session");
        }
      } catch (error) {
        console.error("Error refreshing session:", error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Dialog open={!!session} onOpenChange={() => setSelectedSession(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Session Details
          </DialogTitle>
          <DialogDescription
            className="flex items-center justify-between"
            asChild
          >
            <div>
              <p className="text-gray-500">
                Viewing detailed information for this session
              </p>
              {session && (
                <Badge className={getStatusColor(session.status)}>
                  {session.status}
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        {session && (
          <>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-700 mb-1">
                      Security Code
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 h-8"
                      onClick={handleCopyCode}
                    >
                      {copiedCode ? (
                        <>
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 text-sm">Copied</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="h-4 w-4" />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-lg font-mono bg-white p-2 rounded border border-gray-200">
                    {session.securityCode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <InfoItem
                  icon={<Smartphone className="h-4 w-4" />}
                  label="Phone Number"
                  value={session.phoneNumber}
                />
                <InfoItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Created At"
                  value={new Date(session.createdAt).toLocaleString()}
                />
                <InfoItem
                  icon={<ShieldIcon className="h-4 w-4" />}
                  label="IP Address"
                  value={session.ipAddress}
                />
                <InfoItem
                  icon={<Info className="h-4 w-4" />}
                  label="User Agent"
                  value={session.userAgent}
                />
                <InfoItem
                  icon={<Globe className="h-4 w-4" />}
                  label="Domain"
                  value={session.domain}
                />
                <InfoItem
                  icon={<AlertTriangle className="h-4 w-4" />}
                  label="Batch ID"
                  value={session.batchId}
                  extraDetails={session.batch?.name}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Recovery Information
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 h-8"
                  onClick={handleCopyRecoveryPhrase}
                >
                  {copiedRecoveryPhrase ? (
                    <>
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 text-sm">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-4 w-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="font-mono">
                  {session.recoveryPhrase || "No recovery phrase available"}
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Refresh Session
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <BanIcon className="h-4 w-4" />
                    Delete Session
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
