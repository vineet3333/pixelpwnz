export default {
  expo: {
    name: 'Signet',
    slug: 'signet-clone',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark', // Based on design.md dark theme
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0A0A0A',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.pixelpwnz.signet',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundColor: '#0A0A0A',
      },
      package: 'com.pixelpwnz.signet',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-font',
      [
        'expo-document-picker',
        {
          appleTeamId: 'YOUR_APPLE_TEAM_ID',
        }
      ]
    ],
    extra: {
      eas: {
        projectId: 'YOUR_EAS_PROJECT_ID',
      },
    },
  },
};
