import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seatflow.admin',
  appName: 'SeatFlow Admin',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'localhost',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#999999"
    }
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
    }
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: true,
    scrollEnabled: true,
    backgroundColor: '#FFFFFF'
  }
};

export default config;
