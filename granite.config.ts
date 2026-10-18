import { defineConfig } from '@apps-in-toss/web-framework/config';

// IMPORTANT: Change appName and icon to match the exact values in your Apps in Toss Console.
export default defineConfig({
  appName: 'clockout',
  brand: {
    displayName: '칼퇴하자!',
    primaryColor: '#A677D5',
    icon: '', // Replace with the image URL copied from the Toss Console application icon.
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: { dev: 'vite dev', build: 'vite build' },
  },
  permissions: [],
  outdir: 'dist',
});