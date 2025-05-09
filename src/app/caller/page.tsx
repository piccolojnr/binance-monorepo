import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientOnly from "./client";
import prisma from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export default async function CallerDashboard() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect("/");
  }

  // Get caller information
  const caller = await prisma.caller.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  if (!caller) {
    redirect("/");
  }

  // Get pending sessions (not assigned to any caller)
  const pendingSessions = await prisma.securitySession.findMany({
    where: {
      callerId: null,
      status: "pending",
    },
    include: {
      batch: {
        select: {
          name: true,
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Get sessions assigned to this caller
  const assignedSessions = await prisma.securitySession.findMany({
    where: {
      callerId: caller.id,
    },
    include: {
      batch: {
        select: {
          name: true,
          id: true,
        },
      },
    },
    orderBy: {
      assignedAt: "desc",
    },
  });

  const activeSession = await prisma.securitySession.findFirst({
    where: {
      callerId: caller.id,
      status: "in_progress",
    },
  });

  return (
    <ClientOnly
      caller={caller}
      pendingSessions={pendingSessions}
      assignedSessions={assignedSessions}
      activeSession={activeSession}
    />
  );
}
