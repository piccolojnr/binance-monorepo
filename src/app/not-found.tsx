import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-10 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
          Oops! The page you&apos;re looking for can&apos;t be found.
        </p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
