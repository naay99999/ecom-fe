import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/features/auth";

export default function AccountLayout() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) {
    return <p className="py-8 text-center text-muted-foreground">Loading account…</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location, authRequired: true }} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
