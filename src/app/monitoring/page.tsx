export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React from "react";
import ClientOnly from "./client";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export default async function MonitoringPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    q,
    page: pageParam,
    status: statusParam,
    domain,
    batch,
    sort,
    order,
  } = await searchParams;
  // Extract URL query parameters
  const page = Number(pageParam) || 1;
  const pageSize = 10;
  const query = q?.toString() || "";
  const status = statusParam?.toString() || "";
  const batchId = batch?.toString() || "";
  const domainFilter = domain?.toString() || "";
  const sortBy = sort?.toString() || "createdAt";
  const sortOrder = order?.toString() || "desc";

  // Build filter conditions for database query
  const where: Prisma.SecuritySessionWhereInput = {
    ...(query && {
      OR: [
        { securityCode: { contains: query, mode: "insensitive" } },
        { phoneNumber: { contains: query, mode: "insensitive" } },
        { status: { contains: query, mode: "insensitive" } },
        { batchId: { contains: query, mode: "insensitive" } },
        { domain: { contains: query, mode: "insensitive" } },
      ],
    }),
    ...(status && { status: status === "all" ? undefined : status }),
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
    },
  });

  // Get unique statuses and batch IDs for filters
  const uniqueStatuses = await prisma.securitySession.findMany({
    distinct: ["status"],
    select: { status: true },
  });

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
      uniqueStatuses={uniqueStatuses.map((status) => status.status)}
      uniqueDomains={uniqueDomains
        .map((domain) => domain.domain)
        .filter((x) => x !== null)}
    />
  );
}
