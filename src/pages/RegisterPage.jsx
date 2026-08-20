import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

import {
  getPostAuthPath,
  notifyRegistrationSuccess,
  SignupForm,
  useAuthStore,
} from "@/features/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const register = useAuthStore((state) => state.register);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const { name, email, password, confirmPassword } = Object.fromEntries(new FormData(event.currentTarget));
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsPending(true);
    try {
      const user = await register({ name, email, password });
      notifyRegistrationSuccess(user);
      navigate(getPostAuthPath(location.state?.from), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 md:p-10">
      <SignupForm className="w-full max-w-sm" error={error} isPending={isPending} onSubmit={handleSubmit} />
    </main>
  );
}
