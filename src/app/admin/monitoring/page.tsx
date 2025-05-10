export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React from "react";
import ClientOnly from "./client";
import prisma from "@/lib/prisma";
import { $Enums, Prisma } from "../../../../generated/prisma";
import { authConfig } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MonitoringPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    return redirect("/auth/signin?callbackUrl=/admin/monitoring");
  }
  // Check if the user is an admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const {
    q,
    page: pageParam,
    status: rawStatus,
    domain,
    batch,
    sort,
    order,
  } = await searchParams;
  // Extract URL query parameters
  const page = Number(pageParam) || 1;
  const pageSize = 10;
  const query = q?.toString() || "";
  const isValidStatus = (value: any): value is $Enums.SessionStatus =>
    ["pending", "in_progress", "completed", "failed"].includes(value);

  const status = isValidStatus(rawStatus) ? rawStatus : undefined;
  const batchId = batch?.toString() || "";
  const domainFilter = domain?.toString() || "";
  const sortBy = sort?.toString() || "updatedAt";
  const sortOrder = order?.toString() || "desc";

  // Build filter conditions for database query
  const where: Prisma.SecuritySessionWhereInput = {
    ...(query && {
      OR: [
        { securityCode: { contains: query, mode: "insensitive" } },
        { phoneNumber: { contains: query, mode: "insensitive" } },
        { batchId: { contains: query, mode: "insensitive" } },
        { domain: { contains: query, mode: "insensitive" } },
      ],
    }),
    ...(status && { status }),
    ...(batchId && { batchId: batchId === "all" ? undefined : batchId }),
    ...(domainFilter && {
      domain: domainFilter === "all" ? undefined : domainFilter,
    }),
  };

  // Build sort condition
  const orderBy = {
    [sortBy]: sortOrder,
  };

  // First get total count for pagination info
  const totalCount = await prisma.securitySession.count({ where });

  // Then get paginated data
  const sessions = await prisma.securitySession.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      batch: {
        select: {
          id: true,
          name: true,
        },
      },
      caller: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  // Get unique statuses and batch IDs for filters

  const uniqueBatches = await prisma.batch.findMany({
    distinct: ["id"],
    select: { id: true, name: true },
  });

  const uniqueDomains = await prisma.securitySession.findMany({
    distinct: ["domain"],
    select: { domain: true },
  });

  return (
    <ClientOnly
      sessions={sessions}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      uniqueBatches={uniqueBatches}
      uniqueStatuses={["draft", "pending", "in_progress", "completed"]}
      uniqueDomains={uniqueDomains
        .map((domain) => domain.domain)
        .filter((x) => x !== null)}
      userBalance={user?.balance || 0}
    />
  );
}
