import { redirect } from "next/navigation";

export default function Notfound() {
  redirect("/security");
  return <div>Redirecting...</div>;
}
