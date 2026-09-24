import React from "react";
import { getPlatform } from "@/lib/platform";

export function CopyRight() {
  const platform = getPlatform();
  return (
    <div className="text-center mt-8 text-sm text-gray-400">
      <p>Copyright © 2025 {platform.name}</p>
      <p>All Rights Reserved.</p>
    </div>
  );
}
