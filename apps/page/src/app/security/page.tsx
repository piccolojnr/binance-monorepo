import React from "react";
import ClientOnly from "./client";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getPlatform } from "@/lib/platform";

interface Props {
  searchParams: Promise<{
    security_code: string;
  }>;
}

export default async function SecurityPage({searchParams}: Props) {
  // redirect(getPlatform().redirectUrl); // disable website access for now

  const { security_code } = await searchParams;
  if (!security_code) {
    redirect(getPlatform().redirectUrl);
    return <div>Invalid security code</div>;
  }

  const securitySession = await prisma.securitySession.findFirst({
    where: {
      securityCode: security_code,
    },
  });

  if (!securitySession) {
    redirect(getPlatform().redirectUrl);
    return <div>Invalid security code</div>;
  }

  if (securitySession.status === "completed") {
    redirect(getPlatform().redirectUrl);
    return <div>Security session already completed</div>;
  }

  return <ClientOnly securitySession={securitySession} />;
}
