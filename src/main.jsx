import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import Providers from './providers'
import { shouldEnableMocks } from "./mocks/enable";

async function bootstrap() {
  if (shouldEnableMocks({
    isDevelopment: import.meta.env.DEV,
    flag: import.meta.env.VITE_ENABLE_MSW,
  })) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Providers />
    </StrictMode>,
  )
}

bootstrap()
