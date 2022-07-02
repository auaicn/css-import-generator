# css-import-generator

Recursively scans every `scss`, `css`, `sass` files under `css-root-path`<br>
and generates single file at `destination` which contains all import statements.

- Available for both Windows(win32) and MacOS(posix) environment

## ScreenShots

Below file is auto-generated. I'm using it for big project 😀

![result-screenshot](./docs/result-screenshot.png)

## Usage

1.  Install the package

    ```shell
    yarn add css-import-generator
    # or
    npm i css-import-generator
    ```

2.  Add below to your package.json

    ```json
    "css-import-generator": {
       "css-root":"src/styles/css",
       "destination":"src/css-imports.js",
    }
    ```

    - `css-root` is **necessary**.

      If not given, it won't work.

    - `destination` field is optional.

      If not given, generated file will be at under `{css-root}/index.js`

3.  Run below code **at project root path**

    ```
    npx css-import-generator
    ```

## Further Requirements?

If you need any extra functionality, please contact me > dev.kyung@gmail.com
