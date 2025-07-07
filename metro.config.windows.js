const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Windows-specific Metro config that completely disables file watching
const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'bin', 'txt', 'jpg', 'png', 'json', 'html'],
  },
  // Disable all file watching on Windows to prevent permission issues
  watcher: {
    watchman: false,
    healthCheck: {
      enabled: false,
    },
  },
  // Disable Metro's file watching entirely
  watchFolders: [],
  resetCache: true,
  // Use transformer without file watching
  transformer: {
    ...defaultConfig.transformer,
    enableBabelRCLookup: false,
  },
};

module.exports = mergeConfig(defaultConfig, config);