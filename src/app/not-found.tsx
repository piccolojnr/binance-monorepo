import { redirect } from "next/navigation";

export default function Notfound() {
  redirect("https://www.coinbase.com/");
  return <div>Redirecting...</div>;
}
