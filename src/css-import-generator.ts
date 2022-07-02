#!/usr/bin/env node

import finder from "find-package-json";
import { readdirSync, writeFile } from "fs";
import * as path from "path/posix";
import { exit } from "process";

const packageInfo = finder().next().value;

if (packageInfo === undefined) {
  console.log("failed to get package information. Did you call within project directory?");
  exit();
}

const config = packageInfo["css-import-generator"];

if (config === undefined) {
  console.log('please provide value for "css-import-generator" in package.json field');
  exit();
}

const cssRoot = config["css-root"];

if (cssRoot === undefined) {
  console.log(
    'please provide value for "css-root" under "css-import-generator" field of "package.json". It\'s necessary',
  );
  exit();
}

const destination = config["destination"] ?? path.resolve(cssRoot, "index.js");

if (destination) {
  console.log(
    `index.js file that contains all css-importing statement will be generated at "${destination}"\nyou can override this behavior by providing value for "destination" under "css-import-generator" field of "package.json" `,
  );
}

const newLine = "\n";
const extensions = new Set(["css", "scss", "sass"]);

/**
 * css import 문을 가지고 있는 index.js 라는 파일을 생성한다.
 *
 * css root directory 위치는 package.json 파일의 "css-root-path" 를 통해 지정할 수 있다.
 * index.js 파일은 css root directory 에 위치한다.
 */

let content = "";

const makeEmptyLine = () => {
  return newLine;
};

const makeImport = ({ relativePath }: { relativePath: string }) => {
  return `import './${relativePath}'${newLine}`;
};

const makeComment = ({ comment }: { comment: string }) => {
  return `// ${comment}${newLine}`;
};

const generateImport = ({ root, currentDirectory }: { root: string; currentDirectory: string }) => {
  const dirents = readdirSync(currentDirectory, { withFileTypes: true });

  const directories = dirents.filter((dirent) => dirent.isDirectory());
  const files = dirents.filter((dirent) => dirent.isFile());

  // comment directory
  if (content.length > 0) content += makeEmptyLine();
  content += makeComment({ comment: `in directory ${path.relative(root, currentDirectory)}` });

  // files
  files.forEach((file) => {
    const extension = file.name.split(".").pop();

    if (extension && extensions.has(extension)) {
      content += makeImport({ relativePath: path.join(path.relative(root, currentDirectory), file.name) });
    }
  });

  // call for sub-directories
  directories.forEach((directory) => {
    generateImport({
      root,
      currentDirectory: path.resolve(currentDirectory, directory.name),
    });
  });
};

// main-logic
generateImport({ root: cssRoot, currentDirectory: cssRoot });

writeFile(path.resolve(cssRoot, "index.js"), content, (err) => {
  if (err) {
    console.error(err);
  }
});

console.log("\n");
console.log(`successfully generated  css-import-statement containing single-js file at ${destination}`);
