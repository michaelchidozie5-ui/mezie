import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mezie.studio',
  appName: 'Mezie Studio',
  webDir: 'out',
  server: {
    url: 'https://mezie-studio.vercel.app',
    cleartext: true
  }
};

export default config;