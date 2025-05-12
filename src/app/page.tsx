import { redirect } from "next/navigation";

export default function Home() {
  redirect("https://www.coinbase.com/");
  return <div>Redirecting...</div>;
}
