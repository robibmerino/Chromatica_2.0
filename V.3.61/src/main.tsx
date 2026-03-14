import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { getSupabaseConfig } from "./lib/env";
import "./index.css";
import { App } from "./App";

// Salir del bucle: en producción (Vercel), si cargamos sin Supabase es que el SW sirvió HTML viejo. Quitar SW y recargar una vez.
const isProduction = typeof window !== "undefined" && /vercel\.app$/i.test(window.location.hostname);
const alreadyTriedClear = typeof window !== "undefined" && sessionStorage.getItem("chromatica-sw-cleared") === "1";
if (isProduction && !getSupabaseConfig() && !alreadyTriedClear && navigator.serviceWorker) {
  sessionStorage.setItem("chromatica-sw-cleared", "1");
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
    window.location.reload();
  });
} else {
  createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
  );
}
