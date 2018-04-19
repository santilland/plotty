module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": false
  },
  "rules": {
    "comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "ignore",
    }],
    "no-restricted-syntax": ["error", "WithStatement"],
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": [2, { devDependencies: true }],
    "no-plusplus": "off",
    "no-underscore-dangle": ["error", {
      "allowAfterThis": true,
    }],
    "class-methods-use-this": "off"
  },
  "env": {
    "es6": true,
    "mocha": true,
    "browser": true,
    "node": true
  },
};
