import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import { colors } from "@/lib/config/tokens";
import "./index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY — add it to the root .env.",
  );
}

// Point the generated API client at the api-server origin. The client already
// prefixes /api, so this must be the ORIGIN only (empty = same-origin).
setBaseUrl(import.meta.env.VITE_API_BASE_URL ?? "");

// Match Clerk's prebuilt UI to the ember dark theme (tokens stay the source).
const appearance = {
  variables: {
    colorPrimary: colors.brand.ember,
    colorBackground: colors.surface.panel,
    colorText: colors.foreground,
    colorInputBackground: colors.neutral[900],
    colorInputText: colors.foreground,
  },
};

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={publishableKey} appearance={appearance}>
    <App />
  </ClerkProvider>,
);
