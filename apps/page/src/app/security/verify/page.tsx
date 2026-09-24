import React from "react";
import ClientOnly from "./client";
import prisma from "@/lib/prisma";

interface Props {
  searchParams: Promise<{
    security_code: string;
  }>;
}

export default async function SecurityPage({ searchParams }: Props) {
  const { security_code } = await searchParams;
  if (!security_code) {
    return <div>Security code is required</div>;
  }

  const securitySession = await prisma.securitySession.findFirst({
    where: {
      securityCode: security_code,
    },
  });

  if (!securitySession) {
    return <div>Invalid security code</div>;
  }

  return <ClientOnly securitySession={securitySession} />;
}
