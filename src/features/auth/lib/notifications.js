import { toast } from "../../../components/ui/toast";

function addToast(options) {
  toast.add({ timeout: 4_000, ...options });
}

export function notifyLoginSuccess(user) {
  addToast({ title: `Welcome back, ${user.name}`, type: "success" });
}

export function notifyRegistrationSuccess(user) {
  addToast({ title: `Account created for ${user.name}`, type: "success" });
}

export function notifyLogoutSuccess() {
  addToast({ title: "You’ve been logged out", type: "success" });
}

export function notifyAccountAccessRequired() {
  addToast({
    title: "Sign in required",
    description: "Please sign in to access My Account.",
    type: "warning",
  });
}

export function notifySessionExpired() {
  addToast({
    title: "Session expired",
    description: "Please sign in again.",
    type: "warning",
  });
}
