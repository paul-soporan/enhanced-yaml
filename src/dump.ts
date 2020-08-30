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

export function safeDump(value: unknown, options: SafeDumpOptions = {}, original?: string): string {
  return dump(value, { ...options, schema: 'failsafe' }, original);
}
