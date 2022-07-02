### How To Use

add below to package.json

```json
"css-import-generator": {
  "css-root":"src/styles/css",
  "destination":"src/css-imports.js", // It's optional but default path is src/styles/css/index.js
}
```

### What It does

given `css-root`, it scans every scss, css, sass file and generated single file at `destination` which contains all import statements.

If `destination` is not given, It generates js file under `{given css-root}/index.js`

- Available for both Windows/MacOS

### ScreenShots
