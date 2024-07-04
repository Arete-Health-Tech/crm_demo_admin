import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'IVY-CRM',
  webDir: 'build',
  server: {
    url: "https://arete.demo.aretehealth.tech/prod/api/v1/"
    // url: "http://localhost:3000/prod/api/v1/"
  }
};

export default config;
