import { parseDocument, Options as YamlOptions } from 'yaml';
// eslint-disable-next-line import/no-extraneous-dependencies -- Inlined by Rollup
import defaults from 'lodash/defaults';
import { Schema } from './Schema';

interface RequiredLoadOptions {
  /**
   * @default Schema.CORE
   */
  schema: Schema;
}

const defaultLoadOptions: RequiredLoadOptions = {
  schema: Schema.CORE,
};

export type LoadOptions = Partial<RequiredLoadOptions>;

export interface SafeLoadOptions extends LoadOptions {
  /**
   * @default Schema.FAILSAFE
   */
  schema?: Schema;
}

export function load(source: string, options: LoadOptions = {}): unknown {
  const loadOptions = defaults(options, defaultLoadOptions) as RequiredLoadOptions;

  const yamlOptions: YamlOptions = {
    schema: loadOptions.schema,
  };

  const document = parseDocument(source, yamlOptions);

  return document.toJSON() as unknown;
}

export function safeLoad(source: string, options: SafeLoadOptions = {}): unknown {
  return load(source, { schema: Schema.FAILSAFE, ...options });
}
