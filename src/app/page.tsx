import { redirect } from "next/navigation";

export default function Home() {
  redirect("https://www.binance.com");
  return <div>Redirecting...</div>;
}
