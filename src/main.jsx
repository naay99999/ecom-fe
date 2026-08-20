import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import Providers from './providers'
import { shouldEnableMocks } from "./mocks/enable";
import { useAuthStore } from "@/features/auth";

async function bootstrap() {
  if (shouldEnableMocks({
    isDevelopment: import.meta.env.DEV,
    flag: import.meta.env.VITE_ENABLE_MSW,
  })) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  // Fire-and-forget: tries to restore a session from the httpOnly refresh
  // cookie. AccountLayout shows a loading state until isHydrated flips true,
  // so this doesn't need to block the first render.
  useAuthStore.getState().bootstrap();

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Providers />
    </StrictMode>,
  )
}

bootstrap()
