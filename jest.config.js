module.exports = {
  preset: 'react-native',
  transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/src/.*\\.(test|spec))\\.(jsx?|tsx?)$",
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ]
};
