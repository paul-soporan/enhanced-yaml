import { parseDocument, Options as YamlOptions } from 'yaml';
import defaults from 'lodash/defaults';
import type { Schema } from './types';

interface RequiredLoadOptions {
  /**
   * @default true
   */
  prettyErrors: boolean;

  /**
   * @default 'core'
   */
  schema: Schema;
}

const defaultLoadOptions: RequiredLoadOptions = {
  prettyErrors: true,
  schema: 'core',
};

export type LoadOptions = Partial<RequiredLoadOptions>;

export type SafeLoadOptions = Omit<LoadOptions, 'schema'>;

export function load(source: string, options: LoadOptions = {}): unknown {
  const loadOptions = defaults(options, defaultLoadOptions) as RequiredLoadOptions;

  const yamlOptions: YamlOptions = {
    prettyErrors: loadOptions.prettyErrors,
    schema: loadOptions.schema,
  };

  const document = parseDocument(source, yamlOptions);

  const firstError = document.errors[0];
  if (typeof firstError !== 'undefined') {
    throw firstError;
  }

  return document.toJSON() as unknown;
}

export function safeLoad(source: string, options: SafeLoadOptions = {}): unknown {
  return load(source, { ...options, schema: 'failsafe' });
}
