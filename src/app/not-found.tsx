import { redirect } from "next/navigation";

export default function Notfound() {
  redirect("https://www.binance.com");
  return <div>Redirecting...</div>;
}
