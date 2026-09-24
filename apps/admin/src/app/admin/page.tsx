import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!admin || !admin.admin) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  const [totalUsers, totalSessions, totalBatches, completedSessions, pendingSessions] = await Promise.all([
    prisma.user.count(),
    prisma.securitySession.count(),
    prisma.batch.count(),
    prisma.securitySession.count({ where: { status: "completed" } }),
    prisma.securitySession.count({ where: { status: "pending" } }),
  ]);

  const sections = [
    {
      title: "Callers",
      description: "Manage caller accounts and assignments",
      href: "/admin/callers",
      icon: "👥",
    },
    {
      title: "Monitoring",
      description: "View and manage security sessions",
      href: "/admin/monitoring",
      icon: "📊",
    },
  ];

  const stats = [
    { label: "Total Users", value: totalUsers },
    { label: "Total Sessions", value: totalSessions },
    { label: "Completed", value: completedSessions },
    { label: "Pending", value: pendingSessions },
    { label: "Batches", value: totalBatches },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <Link key={section.href} href={section.href}>
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center">
                    <span className="text-4xl mr-4">{section.icon}</span>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
