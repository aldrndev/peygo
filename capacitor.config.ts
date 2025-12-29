import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.peygo.app",
  appName: "PeyGo",

  // IMPORTANT: dummy folder only - not used in Remote URL mode
  webDir: "out",

  server: {
    url: "https://peygo.id",
    androidScheme: "https",
    allowNavigation: [
      "peygo.id",
      "*.peygo.id",
    ],
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f97316",
      showSpinner: false,
    },
  },

  android: {
    allowMixedContent: false,
  },
};

export default config;
