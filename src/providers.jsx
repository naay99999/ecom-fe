import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { router } from "./router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";

export default function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </Toaster>
    </QueryClientProvider>
  );
}
