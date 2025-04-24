import { redirect } from "next/navigation";

export default function SecretSantaPage() {
  redirect("/secret-santa/groups");
}
