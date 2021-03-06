<h1 align="center">enhanced-yaml</h1>

<p align="center">
  YAML parser and stringifier that preserves comments and styling
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/enhanced-yaml"><img alt="npm" src="https://img.shields.io/npm/v/enhanced-yaml"></a>
  <a href="https://github.com/paul-soporan/enhanced-yaml/actions?query=workflow%3ANode"><img alt="GitHub Actions Node Workflow" src="https://github.com/paul-soporan/enhanced-yaml/workflows/Node/badge.svg"></a>
  <a href="https://github.com/paul-soporan/enhanced-yaml/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/enhanced-yaml"></a>
</p>

<p align="center">
  <a href="https://enhanced-yaml.netlify.app/"><b>Documentation</b></a>
</p>

---

`enhanced-yaml` is a YAML parser and stringifier written in TypeScript, built on top of the [`yaml`](https://github.com/eemeli/yaml) library. Operating on top of `yaml`'s powerful AST, `enhanced-yaml` is able to preserve as much information from the original source as possible when stringifying, which means that comments and styling can be preserved with very high accuracy.

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

`yarn add enhanced-yaml`

Using npm:

`npm install enhanced-yaml`

TypeScript type definitions are included out-of-the-box.

## Usage

```ts
import {safeLoad, safeDump} from 'enhanced-yaml';

const data = `
  # Above: foo
  foo: # Aside: foo
    bar: # Aside: bar
      - 42 # Aside: 42

      # A map
      - a: # Aside: a
          b # Aside: a's value

      # A flow-style sequence
      - [
          # Above: a
          a,
          b,
          c # Aside: c
        ]
`;

safeLoad(data);
// {
//   foo: {
//     bar: ['42', { a: 'b' }, ['a', 'b', 'c']],
//   },
// }

safeDump(
  {
    foo: {
      bar: ['42', ['c', 'd', 'a'], { a: 'c' }],
    },
  },
  {},
  data,
),
// # Above: foo
// foo: # Aside: foo
//   bar: # Aside: bar
//     - 42 # Aside: 42
//
//     # A flow-style sequence
//     - [
//         c, # Aside: c
//         d,
//         # Above: a
//         a
//       ]
//
//     # A map
//     - a: # Aside: a
//         c # Aside: a's value
//
```

## API

The public API consists mostly of the [`load`](https://enhanced-yaml.netlify.app/globals.html#load) and [`dump`](https://enhanced-yaml.netlify.app/globals.html#dump) functions which use the `core` schema by default and their safe counterparts ([`safeLoad`](https://enhanced-yaml.netlify.app/globals.html#safeload) and [`safeDump`](https://enhanced-yaml.netlify.app/globals.html#safedump)) which use the `failsafe` schema.
The function names were picked to be similar to [`js-yaml`](https://github.com/nodeca/js-yaml), which is the most widely used JavaScript YAML parser.

`enhanced-yaml`'s internals are exported under the `internal` namespace, but they shouldn't be considered part of the public API and can be changed at any time.

For more details, please consult the [documentation](https://enhanced-yaml.netlify.app/).

**Notes:**

- `enhanced-yaml`'s public API isn't tied to the [`yaml`](https://github.com/eemeli/yaml) library which is used internally and is only an implementation detail.
- Not all of [`yaml`](https://github.com/eemeli/yaml)'s options are currently supported. They will be added gradually after considering how much sense they make in the context of preserving the original source's relevant information.

## How it works

`enhanced-yaml` takes a unique approach to preserving the relevant information from the original source: rather than encoding the original information inside the parsed JavaScript value (which can often cause parts of the information to be lost when the value is manipulated in unintended ways), it works by taking the original YAML source as an argument to the `dump` function. It then parses it into a document and goes over each YAML node in the updated document and tries to find a matching node in the original document. It then mutates the original node with the minimal relevant updated information, which causes all original references to be preserved, which causes all anchors and aliases to be preserved.
