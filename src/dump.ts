import { Document, parseDocument, createNode, Options as YamlOptions } from 'yaml';
// eslint-disable-next-line import/no-extraneous-dependencies -- Inlined by Rollup
import defaults from 'lodash/defaults';
// eslint-disable-next-line import/no-extraneous-dependencies -- Inlined by Rollup
import pick from 'lodash/pick';
import { updaters } from './internal';
import { Schema } from './Schema';

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
   * @default Schema.CORE
   */
  schema: Schema;
}

const defaultDumpOptions: RequiredDumpOptions = {
  indent: 2,
  indentBlockSequences: true,
  schema: Schema.CORE,
};

export type DumpOptions = Partial<RequiredDumpOptions>;

export interface SafeDumpOptions extends DumpOptions {
  /**
   * @default Schema.FAILSAFE
   */
  schema?: Schema;
}

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

    Object.assign(document, pick(originalDocument, ['contents', 'anchors']));
  }

  const valueNode = createNode(value, /* wrapScalars */ true);

  document.contents = updaters.updateValue(document.contents, valueNode);

  return document.toString();
}

export function safeDump(value: unknown, options: SafeDumpOptions = {}, original?: string): string {
  return dump(value, { schema: Schema.FAILSAFE, ...options }, original);
}
