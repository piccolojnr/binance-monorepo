import { Shield } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";

export function Banner({ securityCode }: { securityCode: string }) {
  return (
    <Card className="shadow-none border rounded-md mb-6">
      <CardContent className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-medium">Security Center</h2>
          </div>
          <div className="text-right">
            <p className="text-sm">Welcome back</p>
            <p className="text-sm font-medium text-gray-500">
              Secure Session ID: {securityCode}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
