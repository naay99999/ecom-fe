import { Outlet, ScrollRestoration } from "react-router";
import { Header } from "@/components/Header";

export default function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
}
