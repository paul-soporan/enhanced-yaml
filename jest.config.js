/** @typedef {import('ts-jest')} */
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      packageJson: './package.json',
    },
  },
};

module.exports = config;
