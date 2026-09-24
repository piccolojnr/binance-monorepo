import { redirect } from "next/navigation";
import { getPlatform } from "@/lib/platform";

export default function Home() {
  redirect(getPlatform().redirectUrl);
}