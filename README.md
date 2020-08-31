# smart-yaml

> YAML parser and stringifier that preserves comments and styling

`smart-yaml` is a YAML parser and stringifier written in TypeScript, built on top of the [`yaml`](https://github.com/eemeli/yaml) library. Operating on top of `yaml`'s powerful AST, `smart-yaml` is able to preserve as much information from the original source as possible when stringifying, which means that comments and styling can be preserved with very high accuracy.

**[Documentation](https://smart-yaml.netlify.app/)**

## Features

- Load YAML documents represented as strings into their corresponding JavaScript values
- Dump JavaScript values into their corresponding YAML documents represented as strings, while preserving the original comments and styling. The following information from the original source will be preserved:
  - Comments
  - Scalar styles (plain / single quoted / double quoted / folded block / literal block)
  - Map / Sequence styles (block / flow)
  - Anchors
  - Aliases
  - Empty lines before a node
  - The original ordering of Map entries and Sequence items if the `preserveOriginalOrdering` option is set

## Installation

Using Yarn:

`yarn add smart-yaml`

Using npm:

`npm install smart-yaml`

TypeScript type definitions are included out-of-the-box.

## How it works

`smart-yaml` takes a unique approach to preserving the relevant information from the original source: rather than encoding the original information inside the parsed JavaScript value (which can often cause parts of the information to be lost when the value is manipulated in unintended ways), it works by taking the original YAML source as an argument to the `dump` function. It then parses it into a document and goes over each YAML node in the updated document and tries to find a matching node in the original document. It then mutates the original node with the minimal relevant updated information, which causes all original references to be preserved, which causes all anchors and aliases to be preserved.
