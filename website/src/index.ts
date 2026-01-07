import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: process.env.PORT || 3000,
  routes: {
    // Serve index.html for all routes (SPA)
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Server running at ${server.url}`);
