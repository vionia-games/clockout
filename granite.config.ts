import { defineConfig } from '@apps-in-toss/web-framework/config';

// In Toss Console, register this appName and upload its icon.
// The installed SDK's "brand" type currently accepts only primaryColor.
// Display name and icon are managed in Toss Console, not here.
export default defineConfig({
  appName: 'clockout',
  brand: {
    primaryColor: '#A677D5',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: { dev: 'vite dev', build: 'vite build' },
  },
  permissions: [],
  outdir: 'dist',
});
