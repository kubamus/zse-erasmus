import { auth } from "@/lib/auth";
import { unauthorized } from "./errors";

export async function requireSessionUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    throw unauthorized();
  }

  return { userId: session.user.id };
}
