import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import {
  getPostAuthPath,
  LoginForm,
  notifyAccountAccessRequired,
  notifyLoginSuccess,
  useAuthStore,
} from "@/features/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const hasShownAuthRequiredNotice = useRef(false);

  useEffect(() => {
    if (!location.state?.authRequired || hasShownAuthRequiredNotice.current) return;

    hasShownAuthRequiredNotice.current = true;
    notifyAccountAccessRequired();
    navigate(location.pathname, { replace: true, state: { from: location.state.from } });
  }, [location.pathname, location.state, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    const { email, password } = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const user = await login({ email, password });
      notifyLoginSuccess(user);
      navigate(getPostAuthPath(location.state?.from), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 md:p-10">
      <LoginForm className="w-full max-w-sm" error={error} isPending={isPending} onSubmit={handleSubmit} />
    </main>
  );
}
