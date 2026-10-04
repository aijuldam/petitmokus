import { defineConfig } from "astro/config";

// The Petit Mokus parent site: homepage, Journal and Updates.
// Static output only: no adapter, no server runtime, no integrations.
// scripts/assemble-site.mjs merges this build with the Kids app.
export default defineConfig({
  site: "https://petitmokus.com",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  devToolbar: { enabled: false },
});
