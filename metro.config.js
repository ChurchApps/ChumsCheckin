const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional asset extensions
config.resolver.assetExts.push('bin', 'txt', 'html');

// Disable watchman to avoid Windows permission issues
config.watchFolders = [];
config.server = {
  enhanceMiddleware: (middleware) => {
    return middleware;
  },
};

// Configure watchman settings
config.watchman = false;

module.exports = config;