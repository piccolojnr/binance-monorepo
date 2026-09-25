import React from "react";
import ClientOnly from "./client";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getPlatform } from "@/lib/platform";
import { getFlowTarget, getRequestMeta, recordFlowStep } from "@/lib/session-flow";

interface Props {
  searchParams: Promise<{
    security_code: string;
  }>;
}

export default async function SecurityPage({ searchParams }: Props) {
  const { security_code } = await searchParams;
  if (!security_code) {
    redirect(getPlatform().redirectUrl);
  }

  const securitySession = await prisma.securitySession.findFirst({
    where: {
      securityCode: security_code,
    },
  });

  if (!securitySession) {
    redirect(getPlatform().redirectUrl);
  }

  const target = getFlowTarget(securitySession, "confirm");
  if (target) {
    redirect(target);
  }

  const meta = await getRequestMeta();
  await recordFlowStep(securitySession.id, "confirm", meta);

  return <ClientOnly securitySession={securitySession} />;
}
