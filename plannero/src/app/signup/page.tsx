import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { getServerSession } from "@/lib/session";

export default async function SignupPage() {
  const session = await getServerSession();

  if (session?.user?.id) {
    redirect("/workspaces");
  }

  return <AuthCard mode="signup" />;
}
