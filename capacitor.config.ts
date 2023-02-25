import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eniacgt.ionic.jobExchange',
  appName: 'jobExchange',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      AndroidXEnabled: 'true',
      AndroidLaunchMode: 'singleTask',
      ScrollEnabled: 'false',
      'android-minSdkVersion': '19',
      'android-targetSdkVersion': '31',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      GOOGLE_MAPS_ANDROID_API_KEY: 'AIzaSyDfI8fbeuGwtgTJxEMABzDwHZ8GTH11Tiw',
      GOOGLE_MAPS_IOS_API_KEY: 'AIzaSyDfI8fbeuGwtgTJxEMABzDwHZ8GTH11Tiw',
      Orientation: 'portrait'
    }
  }
};

export default config;
