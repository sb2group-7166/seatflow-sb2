import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bbdeaa69246942caa443ecc439620bf6',
  appName: 'seatflow-sb2-admin',
  webDir: 'dist',
  server: {
    url: 'https://bbdeaa69-2469-42ca-a443-ecc439620bf6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    // Remove the invalid buildOptions
  }
};

export default config;