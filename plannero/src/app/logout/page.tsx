import { AppFrame } from "@/components/app-frame";
import { LogoutButton } from "@/components/logout-button";

export default function LogoutPage() {
  return (
    <AppFrame title="Sign out" subtitle="Close your current session safely.">
      <div className="surface rounded-2xl p-6">
        <p className="text-sm text-[var(--ink-2)]">
          You are signed in. Use the button below to end your session on this device.
        </p>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </div>
    </AppFrame>
  );
}
