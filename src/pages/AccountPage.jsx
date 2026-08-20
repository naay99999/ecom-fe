import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { notifyLogoutSuccess, useAuthStore } from "@/features/auth";

export default function AccountPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    await logout();
    notifyLogoutSuccess();
    navigate("/login", { replace: true });
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">My Account</h1>
        <p className="text-muted-foreground">Signed in as {user?.email}</p>
      </div>
      <Button variant="outline" onClick={handleLogout} disabled={isPending}>
        {isPending ? "Logging out…" : "Log out"}
      </Button>
    </section>
  );
}
