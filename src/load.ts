import { parseDocument, Options as YamlOptions } from 'yaml';
import defaults from 'lodash/defaults';
import type { Schema } from './types';

interface RequiredLoadOptions {
  /**
   * @default 'core'
   */
  schema: Schema;
}

const defaultLoadOptions: RequiredLoadOptions = {
  schema: 'core',
};

export type LoadOptions = Partial<RequiredLoadOptions>;

export type SafeLoadOptions = Omit<LoadOptions, 'schema'>;

export function load(source: string, options: LoadOptions = {}): unknown {
  const loadOptions = defaults(options, defaultLoadOptions) as RequiredLoadOptions;

  const yamlOptions: YamlOptions = {
    schema: loadOptions.schema,
  };

  const document = parseDocument(source, yamlOptions);

  return document.toJSON() as unknown;
}

export function safeLoad(source: string, options: SafeLoadOptions = {}): unknown {
  return load(source, { ...options, schema: 'failsafe' });
}
