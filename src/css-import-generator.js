#!/usr/bin/env node
"use strict";
var _a;
exports.__esModule = true;
var find_package_json_1 = require("find-package-json");
var fs_1 = require("fs");
var path = require("path/posix");
var process_1 = require("process");
var packageInfo = (0, find_package_json_1["default"])().next().value;
if (packageInfo === undefined) {
    console.error('Failed to get package information. Are you in project directory root-path?');
    (0, process_1.exit)();
}
var config = packageInfo['css-import-generator'];
if (config === undefined) {
    console.error('Please provide value for "css-import-generator" in package.json field');
    (0, process_1.exit)();
}
var cssRoot = config['css-root'];
if (cssRoot === undefined) {
    console.error('Please provide value for "css-root" under "css-import-generator" field of "package.json". It\'s necessary');
    (0, process_1.exit)();
}
var destination = (_a = config['destination']) !== null && _a !== void 0 ? _a : path.resolve(cssRoot, 'index.js');
if (destination) {
    console.warn("\"destination\" field is missing. It's okay but we will generate output js file at ".concat(destination, "\nyou can override this behavior by providing value for \"destination\" under \"css-import-generator\" field of \"package.json\""));
}
var newLine = '\n';
var extensions = new Set(['css', 'scss', 'sass']);
/**
 * content to write into {destination}
 */
var content = '';
var makeEmptyLine = function () {
    return newLine;
};
var makeImport = function (_a) {
    var relativePath = _a.relativePath;
    return "import '".concat(relativePath, "'").concat(newLine);
};
var makeComment = function (_a) {
    var comment = _a.comment;
    return "// ".concat(comment).concat(newLine);
};
var generateImport = function (_a) {
    var root = _a.root, currentDirectory = _a.currentDirectory;
    var dirents = (0, fs_1.readdirSync)(currentDirectory, { withFileTypes: true });
    var directories = dirents.filter(function (dirent) { return dirent.isDirectory(); });
    var files = dirents.filter(function (dirent) { return dirent.isFile(); });
    // comment directory
    if (content.length > 0)
        content += makeEmptyLine();
    content += makeComment({
        comment: "in directory ".concat(path.relative(destination, currentDirectory))
    });
    // files
    files.forEach(function (file) {
        var extension = file.name.split('.').pop();
        if (extension && extensions.has(extension)) {
            content += makeImport({
                relativePath: path.join(path.relative(destination, currentDirectory), file.name)
            });
        }
    });
    // call for sub-directories
    directories.forEach(function (directory) {
        generateImport({
            root: root,
            currentDirectory: path.resolve(currentDirectory, directory.name)
        });
    });
};
// main-logic
generateImport({ root: cssRoot, currentDirectory: cssRoot });
(0, fs_1.writeFile)(destination, content, function (err) {
    if (err) {
        console.error(err);
    }
});
console.log('\n');
console.log("successfully generated \"".concat(destination, "\""));
