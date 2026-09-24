import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientOnly from "./client";

export default async function CallersPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin/callers");
  }

  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!admin || !admin.admin) {
    redirect("/auth/signin?callbackUrl=/admin/callers");
  }

  const callers = await prisma.user.findMany({
    where: {
      parentId: admin.id,
    },
  });

  return <ClientOnly initialCallers={callers} />;
}
