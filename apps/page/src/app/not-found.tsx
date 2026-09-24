import { redirect } from "next/navigation";
import { getPlatform } from "@/lib/platform";

export default function Notfound() {
  redirect(getPlatform().redirectUrl);
  return <div>Redirecting...</div>;
}
