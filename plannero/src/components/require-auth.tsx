import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export async function requireAuthUser() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user;
}
