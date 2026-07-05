import adapter_auto from "@sveltejs/adapter-auto";
import adapter_cloudflare from "@sveltejs/adapter-cloudflare";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// Choose adapter based on environment variable or flag
const adapter = process.env.ADAPTER === 'cloudflare' 
  ? adapter_cloudflare() 
  : adapter_auto();


export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },

      adapter: adapter,
    }),
  ],
});
