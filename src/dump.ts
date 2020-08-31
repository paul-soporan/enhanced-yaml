import { Document, parseDocument, createNode, Options as YamlOptions } from 'yaml';
import defaults from 'lodash/defaults';
import pick from 'lodash/pick';
import { updaters, assertions } from './internal';
import type { Schema, Pair } from './types';

interface RequiredDumpOptions {
  /**
   * @default 2
   */
  indent: number;

  /**
   * @default true
   */
  indentBlockSequences: boolean;

  /**
   * If true, the original ordering of Map entries and Sequence items will be preserved.
   *
   * Applied before `sortMapEntries`.
   *
   * @default false
   */
  preserveOriginalOrdering: boolean;

  /**
   * @default true
   */
  prettyErrors: boolean;

  /**
   * @default 'core'
   */
  schema: Schema;

  /**
   * @default false
   */
  sortMapEntries: boolean | ((a: Pair, b: Pair) => number);
}

const defaultDumpOptions: RequiredDumpOptions = {
  indent: 2,
  indentBlockSequences: true,
  preserveOriginalOrdering: false,
  prettyErrors: true,
  schema: 'core',
  sortMapEntries: false,
};

export type DumpOptions = Partial<RequiredDumpOptions>;

export type SafeDumpOptions = Omit<DumpOptions, 'schema'>;

/**
 * Stringifies a JavaScript value into the corresponding YAML string.
 *
 * Uses the `core` schema by default.
 *
 * @param value The JavaScript value to dump.
 * @param options The `DumpOptions` that affect how the value is serialized.
 * @param original The original YAML string. If set, this function will preserve all comments and styling from the original source.
 */
export function dump(value: unknown, options: DumpOptions = {}, original?: string): string {
  const dumpOptions = defaults(options, defaultDumpOptions) as RequiredDumpOptions;

  const { sortMapEntries } = dumpOptions;

  const yamlOptions: YamlOptions = {
    indent: dumpOptions.indent,
    indentSeq: dumpOptions.indentBlockSequences,
    prettyErrors: dumpOptions.prettyErrors,
    schema: dumpOptions.schema,
    sortMapEntries:
      typeof sortMapEntries === 'function'
        ? (a, b) => {
            assertions.assertNode(a.key);
            assertions.assertNode(a.value);
            assertions.assertNode(b.key);
            assertions.assertNode(b.value);

            return sortMapEntries(
              { key: a.key.toJSON(), value: a.value.toJSON() },
              { key: b.key.toJSON(), value: b.value.toJSON() },
            );
          }
        : dumpOptions.sortMapEntries,
  };

  const document = new Document(yamlOptions);
  document.setSchema();

  if (original) {
    const originalDocument = parseDocument(original, yamlOptions);

    const firstError = originalDocument.errors[0];
    if (typeof firstError !== 'undefined') {
      throw firstError;
    }

    Object.assign(
      document,
      pick(originalDocument, [
        'contents',
        'anchors',
        'comment',
        'commentBefore',
        'directivesEndMarker',
      ]),
    );
  }

  const valueNode = createNode(value, /* wrapScalars */ true);

  document.contents = updaters.updateValue(document.contents, valueNode, {
    ...dumpOptions,
    document,
  });

  return document.toString();
}

/**
 * Serializes (stringifies) a JavaScript value into the corresponding YAML string.
 *
 * Uses the `failsafe` schema.
 *
 * @param value The JavaScript value to dump.
 * @param options The `DumpOptions` that affect how the value is serialized.
 * @param original The original YAML string. If set, this function will preserve all comments and styling from the original source.
 */
export function safeDump(value: unknown, options: SafeDumpOptions = {}, original?: string): string {
  return dump(value, { ...options, schema: 'failsafe' }, original);
}
