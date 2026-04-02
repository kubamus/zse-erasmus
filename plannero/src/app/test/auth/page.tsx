"use client";
import { authClient } from "@/lib/authClient";

export default function Page() {
  const session = authClient.useSession();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const res = await authClient.signUp.email({ email, name, password });
    if (res.error) {
      console.error(res.error);
    } else {
      console.log("User signed up:", res.data.user.email);
    }
  };
  return (
    <main>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      {!session.data && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 items-center justify-center"
        >
          <label>
            Email:
            <input type="email" name="email" />
          </label>
          <label>
            Name:
            <input type="text" name="name" />
          </label>
          <label>
            Password:
            <input type="password" name="password" />
          </label>
          <button type="submit">Sign Up</button>
        </form>
      )}
    </main>
  );
}
