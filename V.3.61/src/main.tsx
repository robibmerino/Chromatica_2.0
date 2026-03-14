import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { getSupabaseConfig } from "./lib/env";
import "./index.css";
import { App } from "./App";

const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
rootEl.setAttribute("data-supabase-configured", getSupabaseConfig() ? "yes" : "no");
