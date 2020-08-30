import { Document, parseDocument, createNode, Options as YamlOptions } from 'yaml';
import defaults from 'lodash/defaults';
import pick from 'lodash/pick';
import { updaters } from './internal';
import type { Schema } from './types';

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
   * @default 'core'
   */
  schema: Schema;
}

const defaultDumpOptions: RequiredDumpOptions = {
  indent: 2,
  indentBlockSequences: true,
  schema: 'core',
};

export type DumpOptions = Partial<RequiredDumpOptions>;

export type SafeDumpOptions = Omit<DumpOptions, 'schema'>;

export function dump(value: unknown, options: DumpOptions = {}, original?: string): string {
  const dumpOptions = defaults(options, defaultDumpOptions) as RequiredDumpOptions;

  const yamlOptions: YamlOptions = {
    indent: dumpOptions.indent,
    indentSeq: dumpOptions.indentBlockSequences,
    schema: dumpOptions.schema,
  };

  const document = new Document(yamlOptions);

  if (original) {
    const originalDocument = parseDocument(original, yamlOptions);

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

  document.contents = updaters.updateValue(document.contents, valueNode);

  return document.toString();
}

export function safeDump(value: unknown, options: SafeDumpOptions = {}, original?: string): string {
  return dump(value, { ...options, schema: 'failsafe' }, original);
}
