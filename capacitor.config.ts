import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seatflow.sb2admin',
  appName: 'seatflow-sb2-admin',
  webDir: 'dist',
  server: {
    cleartext: true
  },
  android: {
    // Remove the invalid buildOptions
  }
};

export default config;