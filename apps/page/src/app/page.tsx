import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { getPlatform } from "@/lib/platform";

export default function Home() {
  const platform = getPlatform();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 bg-primary/10 rounded-full p-5 w-20 h-20 flex items-center justify-center">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">
          {platform.name} Security Center
        </h1>
        <p className="text-gray-600 mb-8">
          Verify a transaction or review the security status of your account.
        </p>
        <Button asChild className="w-full h-12">
          <Link href="/security">Verify Transaction</Link>
        </Button>
      </div>
    </main>
  );
}
