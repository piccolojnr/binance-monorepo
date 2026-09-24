import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Shield,
  Copy,
  Check,
  Ban,
  RefreshCw,
  Loader2,
  Clock,
  Globe,
  Smartphone,
  Key,
  AlertTriangle,
  Info,
  DollarSign,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ISecuritySession } from "@/types";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
  extraDetails?: string;
}

// Info Item Component
const InfoItem = ({ icon, label, value, extraDetails }: InfoItemProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value + "").then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => console.error("Could not copy text: ", err)
    );
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">{label}</span>
          {value && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">
                  {copied ? "Copied!" : "Copy to clipboard"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-sm font-medium text-gray-900 truncate">
          {value || "Not available"}
        </p>
        {extraDetails && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {extraDetails}
          </p>
        )}
      </div>
    </div>
  );
};

interface SecurityCodeProps {
  code: string | null;
  onCopy?: () => void;
}

// Security Code Component
const SecurityCode = ({ code, onCopy }: SecurityCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          if (onCopy) onCopy();
        },
        (err) => console.error("Could not copy text: ", err)
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          <Shield className="h-4 w-4 text-indigo-500" />
          Security Code
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </Button>
      </div>
      <div className="bg-gray-50 p-3 rounded-md border border-gray-100 font-mono text-sm tracking-tight break-all">
        {code}
      </div>
    </div>
  );
};

interface RecoveryPhraseProps {
  phrase: string | null;
  onCopy?: () => void;
}

// Recovery Phrase Component
const RecoveryPhrase = ({ phrase, onCopy }: RecoveryPhraseProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (phrase) {
      navigator.clipboard.writeText(phrase).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          if (onCopy) onCopy();
        },
        (err) => console.error("Could not copy text: ", err)
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          <Key className="h-4 w-4 text-amber-500" />
          Recovery Phrase
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium"
          onClick={handleCopy}
          disabled={!phrase}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Phrase</span>
            </>
          )}
        </Button>
      </div>
      <div className="bg-gray-50 p-3 rounded-md border border-gray-100 font-mono text-sm tracking-tight break-all min-h-10">
        {phrase || "No recovery phrase available"}
      </div>
    </div>
  );
};

interface AmountProps {
  amount: number | null;
}

// Amount Component
const Amount = ({ amount }: AmountProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-500" />
          Amount Withdrawn
        </h3>
      </div>
      <div className="bg-gray-50 p-3 rounded-md border border-gray-100 font-medium text-lg">
        {amount ? `$${amount.toFixed(2)}` : "Not available"}
      </div>
    </div>
  );
};

interface SessionDetailsProps {
  session: ISecuritySession | null;
  setSelectedSession: (session: ISecuritySession | null) => void;
  onDelete?: (sessionId: string) => void;
  onRefresh?: (session: ISecuritySession) => void;
}

// Main SessionDetails Component
export const SessionDetails = ({
  session,
  setSelectedSession,
  onDelete,
  onRefresh,
}: SessionDetailsProps) => {
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Expired: "bg-red-50 text-red-700 border-red-200",
      default: "bg-amber-50 text-amber-700 border-amber-200",
    };

    return status === "Active" || status === "Expired"
      ? statusConfig[status]
      : statusConfig.default;
  };

  if (!session) return null;

  return (
    <Dialog open={!!session} onOpenChange={() => setSelectedSession(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4 sticky top-0 bg-white border-b z-10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              <span>Session Details</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSelectedSession(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription asChild>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                Viewing detailed information for this session
              </p>
              {session && (
                <Badge
                  className={`${getStatusBadge(
                    session.status
                  )} border px-2 py-0.5`}
                >
                  {session.status}
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Security Code Section */}
          <SecurityCode code={session.securityCode} />

          {/* Information Grid Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Session Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                icon={<Shield className="h-4 w-4" />}
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
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="Caller"
                value={session.caller?.email || "Unknown"}
                extraDetails={session.caller?.name}
              />
            </div>
          </div>

          {/* Recovery Phrase Section */}
          <RecoveryPhrase phrase={session.recoveryPhrase} />

          {/* Amount Section */}
          <Amount amount={session.amountWithdrawn} />
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          <div className="flex w-full gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 sm:flex-none"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Delete Session
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
