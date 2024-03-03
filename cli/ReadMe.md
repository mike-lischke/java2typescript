[![Weekly Downloads](https://img.shields.io/npm/dw/antlr-format-cli?style=for-the-badge&color=blue)](https://www.npmjs.com/package/antlr-format-cli)
[![npm version](https://img.shields.io/npm/v/antlr-format-cli?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/antlr-format-cli)

# <img src="https://raw.githubusercontent.com/mike-lischke/antlr-format/master/images/formatter-title.png" alt="antlr-format">

The `antlr-format-cli` package is a terminal tool to use the [`antlr-format`](https://www.npmjs.com/package/antlr-format) package in a terminal, in batch files and other automatic formatting scenarios.

## Installation

For a local installation in your project use:

```bash
npm i --save-dev antlr-format-cli
```

Or as a global module, which allows you to run it anywhere on your machine:

```bash
npm i -g --save-dev antlr-format-cli
```

The package provides the command `antlr-format` (note the missing -cli suffix).

## Usage

Running the formatter tool in a terminal is simple. Switch to the project folder (or if you have the formatter installed globally use any directory) and issue the command:

```bash
antlr-format --config config.json -v ./**/MyGrammar.g4 AnotherGrammar.g4
```

with the actual path to the grammar(s) you want to be formatted.

You can omit the `--config` parameter, in which case the default options will be used. The list of files supports the usual glob pattern for file systems. Grammars may contain syntax errors (e.g. for testing), but you should only use the tool for real ANTLR4 grammars, otherwise the outcome is unpredictable.

Run the tool with `--help` to have it print its supported parameters. For a detailed description of the supported formatting options check out the [formatting](https://github.com/mike-lischke/antlr-format/blob/main/doc/formatting.md) documentation in the `antlr-format` node package.

## Release Notes

### 1.2.1

Updated the tool with the latest `antlr-format` package.

### 1.2.0

The `--pattern` parameters has been removed. Instead files + patterns can be passed to the tool without any option name, but the file list has been moved to the end of the arguments list.

### 1.0.0

This is the initial release of the tool, after it was extracted from the 'antlr-format` package.
